import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/main-layout";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
}

async function getAllEvents() {
  const supabase = getSupabase();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true }); // Or false for newest first

  return events || [];
}

export default async function AllEventsPage() {
  const events = await getAllEvents();

  return (
    <MainLayout>
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-12">All Events</h1>

          {events.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No events found at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        event.image_url ||
                        "/placeholder.svg?height=200&width=400"
                      }
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-600 mb-4 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <p className="text-gray-700 mb-4 line-clamp-3 flex-grow">
                      {event.description}
                    </p>
                    <Link href={`/events/${event.id}`} className="mt-auto">
                      <Button variant="outline" className="w-full">
                        View Details
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
