"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

interface GalleryGridProps {
  images: GalleryImage[];
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

export function GalleryGrid({ images }: Readonly<GalleryGridProps>) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const groupedGalleries = groupImagesByEventAndDate(images);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {groupedGalleries.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No images available in the gallery.
        </div>
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
                  <h2 className="text-3xl font-bold text-gray-800">
                    {group.eventName}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(group.date), "MMMM d, yyyy")} •{" "}
                    {group.images.length} image
                    {group.images.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                  {group.images.map((image) => (
                    <div
                      key={image.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                      onClick={() => openLightbox(image)}
                    >
                      <div className="relative h-48 sm:h-56">
                        <Image
                          src={
                            image.image_url ||
                            "/placeholder.svg?height=200&width=300"
                          }
                          alt={image.event_name || "Gallery image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {image.description && (
                        <div className="p-3">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {image.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full">
            <Image
              src={selectedImage.image_url || "/placeholder.svg"}
              alt={"Gallery image"}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh] mx-auto"
            />

            {(selectedImage.event_name || selectedImage.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
                {selectedImage.event_name && (
                  <h3 className="text-lg font-semibold">
                    {selectedImage.event_name}
                  </h3>
                )}
                {selectedImage.event_date && (
                  <p className="text-sm text-gray-300">
                    {format(new Date(selectedImage.event_date), "MMMM d, yyyy")}
                  </p>
                )}
                {selectedImage.description && (
                  <p className="mt-2">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
