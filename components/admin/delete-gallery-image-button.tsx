"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { Trash } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/alert-dialog-custom";

interface DeleteGalleryImageButtonProps {
  imageId: string;
}

export function DeleteGalleryImageButton({
  imageId,
}: DeleteGalleryImageButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setShowConfirm(false);
    setIsLoading(true);

    try {
      const supabase = getBrowserClient();

      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      toast({
        title: "Image Deleted",
        description: "The image has been deleted successfully.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while deleting the image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        variant="destructive"
        size="sm"
      >
        <Trash className="h-4 w-4 mr-1" />
        {isLoading ? "Deleting..." : "Delete"}
      </Button>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}
