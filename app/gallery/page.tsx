import { MainLayout } from "@/components/main-layout";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { getSupabase } from "@/lib/supabase";

async function getGalleryImages() {
  const supabase = getSupabase();

  const { data: images, error } = await supabase
    .from("gallery")
    .select("*")
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }

  return images || [];
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-12">Gallery</h1>

          <GalleryGrid images={images} />
        </div>
      </div>
    </MainLayout>
  );
}
