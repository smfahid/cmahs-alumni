"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { Star } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/alert-dialog-custom";

interface SetHeroImageButtonProps {
  imageId: string;
  isHero: boolean;
}

export function SetHeroImageButton({
  imageId,
  isHero,
}: SetHeroImageButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [heroCount, setHeroCount] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkHeroCount = async () => {
      try {
        const supabase = getBrowserClient();
        const { count, error } = await supabase
          .from("gallery")
          .select("*", { count: "exact", head: true })
          .eq("is_hero", true);

        if (!error) {
          setHeroCount(count || 0);
        }
      } catch (error) {
        console.error("Error checking hero count:", error);
      }
    };

    checkHeroCount();
  }, []);

  const handleToggleHero = async () => {
    setShowConfirm(false);
    setIsLoading(true);

    try {
      const supabase = getBrowserClient();

      if (isHero) {
        // If it's already a hero image, just remove the hero status
        const { error } = await supabase
          .from("gallery")
          .update({ is_hero: false })
          .eq("id", imageId);

        if (error) throw error;

        toast({
          title: "Hero Status Removed",
          description: "The image is no longer set as a hero image.",
        });
      } else {
        // Check if we've reached the limit
        if (heroCount >= 4) {
          toast({
            title: "Hero Image Limit Reached",
            description:
              "You can only have 4 hero images. Please remove an existing hero image first.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // If it's not a hero image, make it a hero image
        const { error } = await supabase
          .from("gallery")
          .update({ is_hero: true })
          .eq("id", imageId);

        if (error) throw error;

        toast({
          title: "Hero Status Set",
          description: "The image has been set as a hero image.",
        });
      }

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while updating the image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!isHero && heroCount >= 4) {
      toast({
        title: "Hero Image Limit Reached",
        description:
          "You can only have 4 hero images. Please remove an existing hero image first.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirm(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant={isHero ? "outline" : "default"}
        size="sm"
      >
        <Star className="h-4 w-4 mr-1" />
        {isLoading ? "Updating..." : isHero ? "Remove Hero" : "Set as Hero"}
      </Button>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={isHero ? "Remove Hero Status" : "Set as Hero Image"}
        description={
          isHero
            ? "Are you sure you want to remove the hero status from this image?"
            : "Are you sure you want to set this image as a hero image? It will be featured prominently on the site."
        }
        onConfirm={handleToggleHero}
        confirmText={isHero ? "Remove" : "Set as Hero"}
        cancelText="Cancel"
        variant={isHero ? "default" : "default"}
      />
    </>
  );
}
