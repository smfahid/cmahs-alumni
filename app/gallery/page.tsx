import { MainLayout } from "@/components/main-layout";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { getSupabase } from "@/lib/supabase";

async function getGalleryImages(page = 1, pageSize = 20) {
  const supabase = getSupabase();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: images, count } = await supabase
    .from("gallery")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    images: images || [],
    totalCount: count || 0,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
    currentPage: page,
  };
}

export default async function GalleryPage({
  searchParams,
}: Readonly<{
  searchParams: { page?: string };
}>) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const { images, totalPages, currentPage } = await getGalleryImages(page);

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-12">Gallery</h1>

          <GalleryGrid
            images={images}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </div>
    </MainLayout>
  );
}
