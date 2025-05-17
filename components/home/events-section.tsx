import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
}

export function EventsSection({ events }: { events: Event[] }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming Events
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us at our upcoming events to connect with fellow alumni and
            stay engaged with our community.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-soft">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              No upcoming events at the moment
            </h3>
            <p>
              Check back soon for new events or subscribe to our newsletter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-soft overflow-hidden card-hover"
              >
                <div className="relative h-52">
                  <Image
                    src={
                      event.image_url || "/placeholder.svg?height=200&width=400"
                    }
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">
                      {event.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-600 mb-3">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">
                      {formatDate(event.event_date)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <Link href={`/events/${event.id}`}>
                    <Button variant="outline" className="w-full group">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/events">
            <Button className="px-8">View All Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
