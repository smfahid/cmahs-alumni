import Link from "next/link"
import Image from "next/image"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { DeleteGalleryImageButton } from "@/components/admin/delete-gallery-image-button"
import { SetHeroImageButton } from "@/components/admin/set-hero-image-button"

async function getGalleryImages() {
  const supabase = getSupabase()

  const { data: images } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

  return images || []
}

export default async function AdminGalleryPage() {
  const images = await getGalleryImages()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <Link href="/admin/gallery/upload">
          <Button>Upload New Image</Button>
        </Link>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No images in the gallery. Upload some images to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={image.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={image.title || "Gallery image"}
                  fill
                  className="object-cover"
                />
                {image.is_hero && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    Hero Image
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{image.title || "Untitled"}</h3>
                <p className="text-sm text-gray-500 mb-4">Uploaded on {formatDate(image.created_at)}</p>

                <div className="flex justify-between">
                  <SetHeroImageButton imageId={image.id} isHero={image.is_hero} />
                  <DeleteGalleryImageButton imageId={image.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
