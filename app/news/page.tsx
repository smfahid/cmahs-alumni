import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/main-layout";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase";

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string;
  published_date: string;
}

async function getAllNews() {
  const supabase = getSupabase();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("published_date", { ascending: false }); // Newest first

  return news || [];
}

export default async function AllNewsPage() {
  const newsItems = await getAllNews();

  return (
    <MainLayout>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-12">All News</h1>

          {newsItems.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No news articles found at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        item.image_url ||
                        "/placeholder.svg?height=200&width=400"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-gray-600 mb-2 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{formatDate(item.published_date)}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-700 mb-4 line-clamp-3 flex-grow">
                      {item.content}
                    </p>
                    <Link href={`/news/${item.id}`} className="mt-auto">
                      <Button variant="outline" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
