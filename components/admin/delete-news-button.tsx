"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { Trash, Loader2 } from "lucide-react";
import { STORAGE_BUCKETS } from "@/lib/storage-utils";

interface DeleteNewsButtonProps {
  newsId: string;
  imageUrl?: string | null;
}

export function DeleteNewsButton({ newsId, imageUrl }: DeleteNewsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = getBrowserClient();

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this news article? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Delete image from storage if it exists
      if (imageUrl) {
        try {
          const imageName = imageUrl.split("/").pop(); // Extract file name from URL
          if (imageName) {
            const { error: storageError } = await supabase.storage
              .from(STORAGE_BUCKETS.NEWS)
              .remove([imageName]); // Assumes image is in the root of the 'news' bucket or path is relative

            // If your filePath in storage is like 'news/image.jpg', adjust accordingly:
            // const filePath = imageUrl.substring(imageUrl.indexOf(STORAGE_BUCKETS.NEWS + '/') + STORAGE_BUCKETS.NEWS.length + 1);
            // await supabase.storage.from(STORAGE_BUCKETS.NEWS).remove([filePath]);

            if (storageError) {
              console.warn(
                "Failed to delete image from storage:",
                storageError.message
              );
              // Optionally, inform the user but still proceed with DB deletion
              toast({
                title: "Image Deletion Warning",
                description: `Could not delete image: ${storageError.message}. The article record will still be deleted.`,
                variant: "default",
                duration: 7000,
              });
            }
          }
        } catch (e: any) {
          console.warn(
            "Error parsing or deleting image from storage:",
            e.message
          );
        }
      }

      // 2. Delete news article from database
      const { error: dbError } = await supabase
        .from("news")
        .delete()
        .eq("id", newsId);

      if (dbError) throw dbError;

      toast({
        title: "News Article Deleted",
        description: "The news article has been deleted successfully.",
      });

      router.refresh(); // Refresh the page to update the list
    } catch (error: any) {
      toast({
        title: "Error Deleting Article",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isLoading}
      variant="destructive"
      size="sm"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Trash className="h-4 w-4 mr-1" />
      )}
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
}
