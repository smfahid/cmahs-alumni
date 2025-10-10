"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { Trash } from "lucide-react";

interface DeleteEventButtonProps {
  eventId: string;
}

export function DeleteEventButton({ eventId }: DeleteEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getBrowserClient();

      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while deleting the event.",
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
      <Trash className="h-4 w-4 mr-1" />
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
}
