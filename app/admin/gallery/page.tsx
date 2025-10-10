import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDate } from "@/lib/utils";
import { DeleteGalleryImageButton } from "@/components/admin/delete-gallery-image-button";
import { SetHeroImageButton } from "@/components/admin/set-hero-image-button";
import { format } from "date-fns";

interface GalleryImage {
  id: string;
  event_name: string | null;
  event_date: string | null;
  description: string | null;
  image_url: string;
  is_hero: boolean;
  created_at: string;
}

interface GroupedGallery {
  date: string;
  eventName: string;
  images: GalleryImage[];
}

async function getGalleryImages() {
  const supabase = getSupabase();
  const { data: images, error } = await supabase
    .from("gallery")
    .select("*")
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load gallery:", error);
    return [];
  }

  return images || [];
}

function groupImagesByEventAndDate(images: GalleryImage[]): GroupedGallery[] {
  const grouped = new Map<string, GalleryImage[]>();

  images.forEach((image) => {
    const date =
      image.event_date || format(new Date(image.created_at), "yyyy-MM-dd");
    const key = date;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(image);
  });

  // Convert to array and sort by date (newest first)
  const result: GroupedGallery[] = [];
  Array.from(grouped.entries())
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .forEach(([date, images]) => {
      // Find the last event name for this date (most recent upload)
      const eventName =
        images.find((img) => img.event_name)?.event_name || "Untitled Event";
      result.push({ date, eventName, images });
    });

  return result;
}

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();
  const groupedGalleries = groupImagesByEventAndDate(images);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <Link href="/admin/gallery/upload">
          <Button>Upload New Images</Button>
        </Link>
      </div>

      {groupedGalleries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No images in the gallery. Upload some images to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={groupedGalleries.map((_, index) => `item-${index}`)}
          className="w-full"
        >
          {groupedGalleries.map((group, index) => (
            <AccordionItem key={group.date} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {group.eventName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(group.date), "MMMM d, yyyy")} •{" "}
                    {group.images.length} image
                    {group.images.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {group.images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={
                            image.image_url ||
                            "/placeholder.svg?height=200&width=300"
                          }
                          alt={image.event_name || "Gallery image"}
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
                        {image.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {image.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mb-4">
                          Uploaded on {formatDate(image.created_at)}
                        </p>

                        <div className="flex justify-between gap-2">
                          <SetHeroImageButton
                            imageId={image.id}
                            isHero={image.is_hero}
                          />
                          <DeleteGalleryImageButton imageId={image.id} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
