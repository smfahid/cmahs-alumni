"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryImage {
  id: string;
  title?: string;
  description?: string;
  image_url: string;
  created_at: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  totalPages: number;
  currentPage: number;
}

export function GalleryGrid({
  images,
  totalPages,
  currentPage,
}: Readonly<GalleryGridProps>) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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
      {images.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No images available in the gallery.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => openLightbox(image)}
              >
                <div className="relative h-48 sm:h-56">
                  <Image
                    src={
                      image.image_url || "/placeholder.svg?height=200&width=300"
                    }
                    alt={image.title || "Gallery image"}
                    fill
                    className="object-cover"
                  />
                </div>
                {image.title && (
                  <div className="p-3">
                    <h3 className="text-sm font-medium truncate">
                      {image.title}
                    </h3>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Link
                href={`/gallery?page=${currentPage > 1 ? currentPage - 1 : 1}`}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={`inline-flex items-center px-4 py-2 border rounded-md ${
                  currentPage <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Link
                    key={page}
                    href={`/gallery?page=${page}`}
                    className={`inline-flex items-center px-4 py-2 border rounded-md ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </Link>
                )
              )}

              <Link
                href={`/gallery?page=${
                  currentPage < totalPages ? currentPage + 1 : totalPages
                }`}
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : undefined}
                className={`inline-flex items-center px-4 py-2 border rounded-md ${
                  currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}
        </>
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
              alt={selectedImage.title || "Gallery image"}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh] mx-auto"
            />

            {(selectedImage.title || selectedImage.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
                {selectedImage.title && (
                  <h3 className="text-lg font-semibold">
                    {selectedImage.title}
                  </h3>
                )}
                {selectedImage.description && (
                  <p className="mt-1">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
