import { notFound } from "next/navigation"
import Image from "next/image"
import { MainLayout } from "@/components/main-layout"
import { Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase"

async function getEvent(id: string) {
  const supabase = getSupabase()

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()

  return event
}

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 sm:h-80 md:h-96">
              <Image
                src={event.image_url || "/placeholder.svg?height=400&width=800"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span>{formatDate(event.event_date)}</span>
                </div>

                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
