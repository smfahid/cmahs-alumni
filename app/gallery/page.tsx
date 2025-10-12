import { getSupabase } from "@/lib/supabase";
import GalleryClient from "./gallery-client";

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

  return <GalleryClient images={images} />;
}
