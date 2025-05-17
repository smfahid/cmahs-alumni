import { MainLayout } from "@/components/main-layout";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { NewsSection } from "@/components/home/news-section";
import { CommitteesSection } from "@/components/home/committees-section";
import { getSupabase } from "@/lib/supabase";

async function getHomePageData() {
  const supabase = getSupabase();

  // Get about content
  const { data: aboutData } = await supabase
    .from("about_content")
    .select("*")
    .limit(1)
    .single();

  // Get events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .limit(3);

  // Get news
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("published_date", { ascending: false })
    .limit(3);

  // Get hero images
  const { data: heroImages } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_hero", true)
    .limit(5);

  return {
    about: aboutData,
    events: events || [],
    news: news || [],
    heroImages: heroImages || [],
  };
}

export default async function Home() {
  const { about, events, news, heroImages } = await getHomePageData();

  return (
    <MainLayout>
      <HeroSection images={heroImages} />
      <AboutSection about={about} />
      <EventsSection events={events} />
      <NewsSection news={news} />
    </MainLayout>
  );
}
