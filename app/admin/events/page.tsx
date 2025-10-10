import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Edit } from "lucide-react";
import { DeleteEventButton } from "@/components/admin/delete-event-button";

async function getEvents() {
  const supabase = getSupabase();
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });
  if (error) {
    console.error("Failed to load events:", error);
    return [];
  }
  return events || [];
}

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link href="/admin/events/create">
          <Button>Create New Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No events found. Create your first event to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={
                    event.image_url || "/placeholder.svg?height=200&width=300"
                  }
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{event.title}</h3>

                <div className="flex items-center text-gray-600 mt-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {formatDate(event.event_date)}
                  </span>
                </div>

                {event.location && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm truncate">{event.location}</span>
                  </div>
                )}

                <div className="mt-4 flex justify-between">
                  <Link href={`/admin/events/edit/${event.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteEventButton eventId={event.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
