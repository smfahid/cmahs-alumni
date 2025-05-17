import Link from "next/link"
import Image from "next/image"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Calendar, Edit } from "lucide-react"
import { DeleteNewsButton } from "@/components/admin/delete-news-button"

async function getNews() {
  const supabase = getSupabase()

  const { data: news } = await supabase.from("news").select("*").order("published_date", { ascending: false })

  return news || []
}

export default async function AdminNewsPage() {
  const news = await getNews()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">News</h1>
        <Link href="/admin/news/create">
          <Button>Create News Article</Button>
        </Link>
      </div>

      {news.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No news articles found. Create your first article to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={item.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{formatDate(item.published_date)}</span>
                </div>

                <h3 className="font-medium truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.content}</p>

                <div className="mt-4 flex justify-between">
                  <Link href={`/admin/news/edit/${item.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteNewsButton newsId={item.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
