"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { STORAGE_BUCKETS } from "@/lib/storage-utils";

interface DeleteDonationButtonProps {
  donationId: string;
  imageUrl?: string | null;
}

export function DeleteDonationButton({
  donationId,
  imageUrl,
}: DeleteDonationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = getBrowserClient();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (imageUrl) {
        try {
          const url = new URL(imageUrl);
          // Pathname is /storage/v1/object/public/donations/image.png
          // We need 'image.png' if bucket is 'donations' and no subfolders were used.
          // Or, if you stored with a folder like 'donations_images/image.png', then that full path.
          // Assuming the path stored in image_url is relative to the bucket root or can be extracted.
          const pathSegments = url.pathname.split("/");
          const imagePath = pathSegments
            .slice(pathSegments.indexOf(STORAGE_BUCKETS.DONATIONS) + 1)
            .join("/");

          if (imagePath) {
            const { error: storageError } = await supabase.storage
              .from(STORAGE_BUCKETS.DONATIONS)
              .remove([imagePath]);
            if (storageError) {
              console.warn(
                "Failed to delete image from storage, proceeding with DB deletion:",
                storageError.message
              );
            }
          }
        } catch (e) {
          console.warn(
            "Could not parse or delete image from storage URL:",
            imageUrl,
            e
          );
        }
      }

      const { error: dbError } = await supabase
        .from("donations")
        .delete()
        .match({ id: donationId });

      if (dbError) throw dbError;

      toast({
        title: "Donation Deleted",
        description: "The donation has been successfully deleted.",
      });
      setIsDialogOpen(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error Deleting Donation",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            donation record and its associated image (if any).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setIsDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
