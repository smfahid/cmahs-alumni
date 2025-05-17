import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string;
  published_date: string;
}

export function NewsSection({ news }: { news: News[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news and announcements from our alumni
            community.
          </p>
        </div>

        {news.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg shadow-soft">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No news at the moment</h3>
            <p>Check back soon for updates or subscribe to our newsletter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-xl shadow-soft overflow-hidden card-hover"
              >
                <div className="relative h-52">
                  <Image
                    src={
                      item.image_url || "/placeholder.svg?height=200&width=400"
                    }
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                      {formatDate(item.published_date)}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.content}
                  </p>
                  <Link href={`/news/${item.id}`}>
                    <Button variant="outline" className="w-full group">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/news">
            <Button className="px-8">View All News</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
