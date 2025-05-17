"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getSupabase } from "@/lib/supabase"
import { ImageIcon } from "lucide-react"

export default function CreateNewsPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [publishedDate, setPublishedDate] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabase()

      let imageUrl = ""

      // Upload image if provided
      if (image) {
        const fileExt = image.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `news/${fileName}`

        const { error: uploadError } = await supabase.storage.from("news").upload(filePath, image)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage.from("news").getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      }

      // Create news article
      const { error: insertError } = await supabase.from("news").insert({
        title,
        content,
        published_date: publishedDate ? new Date(publishedDate).toISOString() : new Date().toISOString(),
        image_url: imageUrl || null,
      })

      if (insertError) throw insertError

      toast({
        title: "News Article Created",
        description: "The news article has been created successfully.",
      })

      router.push("/admin/news")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the news article.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create News Article</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedDate">Published Date</Label>
              <Input
                id="publishedDate"
                type="datetime-local"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
              />
              <p className="text-xs text-gray-500">If not specified, current date and time will be used.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imagePreview ? (
                  <div className="relative w-full max-w-md">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImage(null)
                        setImagePreview(null)
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                      >
                        Select Image
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Article"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
