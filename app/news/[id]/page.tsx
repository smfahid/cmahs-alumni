import { notFound } from "next/navigation"
import Image from "next/image"
import { MainLayout } from "@/components/main-layout"
import { Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase"

async function getNewsItem(id: string) {
  const supabase = getSupabase()

  const { data: newsItem } = await supabase.from("news").select("*").eq("id", id).single()

  return newsItem
}

export default async function NewsDetailsPage({ params }: { params: { id: string } }) {
  const newsItem = await getNewsItem(params.id)

  if (!newsItem) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 sm:h-80 md:h-96">
              <Image
                src={newsItem.image_url || "/placeholder.svg?height=400&width=800"}
                alt={newsItem.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <span>{formatDate(newsItem.published_date)}</span>
              </div>

              <h1 className="text-3xl font-bold mb-6">{newsItem.title}</h1>

              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{newsItem.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
