"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
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
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg">No images available in the gallery.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedGalleries.map((group, index) => (
            <motion.div
              key={group.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-border/50"
            >
              <div className="mb-6">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  {group.eventName}
                </h2>
                <p className="text-[15px] text-muted-foreground mt-2">
                  {format(new Date(group.date), "MMMM d, yyyy")} •{" "}
                  {group.images.length}{" "}
                  {group.images.length !== 1 ? "photos" : "photo"}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {group.images.map((image, imgIndex) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: imgIndex * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-muted"
                    onClick={() => openLightbox(image)}
                  >
                    <Image
                      src={
                        image.image_url ||
                        "/placeholder.svg?height=400&width=400"
                      }
                      alt={image.event_name || "Gallery image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                    {image.description && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-xs sm:text-sm line-clamp-2 font-medium">
                            {image.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.button
              onClick={closeLightbox}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-6xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.image_url || "/placeholder.svg"}
                  alt={selectedImage.event_name || "Gallery image"}
                  width={1600}
                  height={1200}
                  className="object-contain max-h-[85vh] mx-auto rounded-2xl"
                  priority
                />
              </div>

              {(selectedImage.event_name || selectedImage.description) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white p-6 rounded-b-2xl backdrop-blur-sm"
                >
                  {selectedImage.event_name && (
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                      {selectedImage.event_name}
                    </h3>
                  )}
                  {selectedImage.event_date && (
                    <p className="text-sm md:text-base text-white/80 mt-1">
                      {format(
                        new Date(selectedImage.event_date),
                        "MMMM d, yyyy"
                      )}
                    </p>
                  )}
                  {selectedImage.description && (
                    <p className="mt-3 text-white/90 text-sm md:text-base leading-relaxed">
                      {selectedImage.description}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
