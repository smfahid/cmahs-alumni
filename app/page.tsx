import { MainLayout } from "@/components/main-layout";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { getSupabase } from "@/lib/supabase";

async function getHomePageData() {
  const supabase = getSupabase();

  // Get about content
  const { data: aboutData } = await supabase
    .from("about_content")
    .select("*")
    .limit(1)
    .single();

  // Get all events - the EventsSection component will filter them
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  // Get hero images
  const { data: heroImages } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_hero", true)
    .limit(5);

  return {
    about: aboutData,
    events: events || [],
    heroImages: heroImages || [],
  };
}

export default async function Home() {
  const { about, events, heroImages } = await getHomePageData();

  return (
    <MainLayout>
      <HeroSection images={heroImages} />
      <AboutSection about={about} />
      <EventsSection events={events} />
      {/* <NewsSection news={news} /> */}
    </MainLayout>
  );
}
