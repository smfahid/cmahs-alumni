"use client";

import { MainLayout } from "@/components/main-layout";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { AuthGuard } from "@/components/auth/auth-guard";

interface GalleryImage {
  id: string;
  image_url: string;
  event_name: string | null;
  event_date: string | null;
  created_at: string;
  is_hero: boolean;
}

interface GalleryClientProps {
  images: GalleryImage[];
}

export default function GalleryClient({
  images,
}: Readonly<GalleryClientProps>) {
  return (
    <AuthGuard>
      <MainLayout>
        <div className="bg-gradient-to-b from-white via-primary-50/20 to-white min-h-screen">
          {/* Header Section */}
          <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-4">
                  Gallery
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Relive the moments that make our community special
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Content */}
          <div className="pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <GalleryGrid images={images} />
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
