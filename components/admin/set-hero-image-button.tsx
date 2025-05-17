"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getSupabase } from "@/lib/supabase"
import { Star } from "lucide-react"

interface SetHeroImageButtonProps {
  imageId: string
  isHero: boolean
}

export function SetHeroImageButton({ imageId, isHero }: SetHeroImageButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleToggleHero = async () => {
    setIsLoading(true)

    try {
      const supabase = getSupabase()

      if (isHero) {
        // If it's already a hero image, just remove the hero status
        const { error } = await supabase.from("gallery").update({ is_hero: false }).eq("id", imageId)

        if (error) throw error

        toast({
          title: "Hero Status Removed",
          description: "The image is no longer set as a hero image.",
        })
      } else {
        // If it's not a hero image, make it a hero image
        const { error } = await supabase.from("gallery").update({ is_hero: true }).eq("id", imageId)

        if (error) throw error

        toast({
          title: "Hero Status Set",
          description: "The image has been set as a hero image.",
        })
      }

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating the image.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleToggleHero} disabled={isLoading} variant={isHero ? "outline" : "default"} size="sm">
      <Star className="h-4 w-4 mr-1" />
      {isLoading ? "Updating..." : isHero ? "Remove Hero" : "Set as Hero"}
    </Button>
  )
}
