"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getSupabase } from "@/lib/supabase"
import { Trash } from "lucide-react"

interface DeleteGalleryImageButtonProps {
  imageId: string
}

export function DeleteGalleryImageButton({ imageId }: DeleteGalleryImageButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabase()

      const { error } = await supabase.from("gallery").delete().eq("id", imageId)

      if (error) throw error

      toast({
        title: "Image Deleted",
        description: "The image has been deleted successfully.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the image.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleDelete} disabled={isLoading} variant="destructive" size="sm">
      <Trash className="h-4 w-4 mr-1" />
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  )
}
