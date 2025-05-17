"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase"; // Use browser client for client-side mutations
import { ImageIcon, ArrowLeft, Loader2 } from "lucide-react";
import { ensureBucketExists, STORAGE_BUCKETS } from "@/lib/storage-utils";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  published_date: string;
  image_url: string | null;
  created_at: string;
}

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { toast } = useToast();
  const supabase = getBrowserClient();

  const fetchNewsItem = useCallback(async () => {
    if (!newsId) return;
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", newsId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("News article not found");

      const article = data as NewsArticle;
      setTitle(article.title);
      setContent(article.content);
      setPublishedDate(
        article.published_date
          ? new Date(article.published_date).toISOString().substring(0, 16) // Format for datetime-local
          : ""
      );
      if (article.image_url) {
        setImagePreview(article.image_url);
        setExistingImageUrl(article.image_url);
      }
    } catch (error: any) {
      toast({
        title: "Error Fetching Article",
        description: error.message || "Could not load the news article.",
        variant: "destructive",
      });
      router.push("/admin/news");
    } finally {
      setIsFetching(false);
    }
  }, [newsId, router, supabase, toast]);

  useEffect(() => {
    fetchNewsItem();
  }, [fetchNewsItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      // If no file is selected (e.g., user cancels file dialog),
      // and there was an existing image, revert preview to existing image.
      // If they want to remove it, they should use a "Remove Image" button (added below).
      if (existingImageUrl) {
        setImagePreview(existingImageUrl);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Note: actual deletion from storage happens on submit
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await ensureBucketExists(supabase, STORAGE_BUCKETS.NEWS, {
        public: true,
      });
      let finalImageUrl: string | null = existingImageUrl;

      // 1. Handle new image upload
      if (imageFile) {
        // If there was an old image, delete it from storage
        if (existingImageUrl) {
          try {
            const oldImageName = existingImageUrl.split("/").pop();
            if (oldImageName) {
              await supabase.storage
                .from(STORAGE_BUCKETS.NEWS)
                .remove([oldImageName]);
            }
          } catch (storageError: any) {
            console.warn(
              "Failed to delete old image from storage:",
              storageError.message
            );
            // Non-fatal, proceed with update
          }
        }

        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `news/${fileName}`; // Keep consistent with create page

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.NEWS)
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKETS.NEWS)
          .getPublicUrl(filePath);
        finalImageUrl = urlData.publicUrl;
      }
      // 2. Handle image removal (if imagePreview is null and there was an existingImageUrl)
      else if (imagePreview === null && existingImageUrl !== null) {
        try {
          const oldImageName = existingImageUrl.split("/").pop();
          if (oldImageName) {
            await supabase.storage
              .from(STORAGE_BUCKETS.NEWS)
              .remove([oldImageName]);
          }
        } catch (storageError: any) {
          console.warn(
            "Failed to delete existing image from storage:",
            storageError.message
          );
        }
        finalImageUrl = null;
      }

      // Update news article in the database
      const { error: updateError } = await supabase
        .from("news")
        .update({
          title,
          content,
          published_date: publishedDate
            ? new Date(publishedDate).toISOString()
            : new Date().toISOString(),
          image_url: finalImageUrl,
        })
        .eq("id", newsId);

      if (updateError) throw updateError;

      toast({
        title: "News Article Updated",
        description: "The news article has been updated successfully.",
      });
      router.push("/admin/news");
      router.refresh(); // To reflect changes on the list page
    } catch (error: any) {
      toast({
        title: "Error Updating Article",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading article...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit News Article</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedDate">Published Date</Label>
              <Input
                id="publishedDate"
                type="datetime-local"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                If not specified, current date and time will be used.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[200px]">
                {imagePreview ? (
                  <div className="relative w-full max-w-md text-center">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="w-full h-auto max-h-64 object-contain rounded-md"
                    />
                    <div className="mt-2 space-x-2">
                      <Label
                        htmlFor="image-upload-edit"
                        className="cursor-pointer bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm"
                      >
                        Change Image
                      </Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                      >
                        Remove Image
                      </Button>
                    </div>
                    <Input
                      id="image-upload-edit"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Label
                        htmlFor="image-upload-edit"
                        className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                      >
                        Select Image
                      </Label>
                      <Input
                        id="image-upload-edit"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isLoading || isFetching}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Article"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
