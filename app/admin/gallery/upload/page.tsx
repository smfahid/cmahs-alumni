"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { ImageIcon, X, Calendar as CalendarIcon } from "lucide-react";
import { ensureBucketExists, STORAGE_BUCKETS } from "@/lib/storage-utils";
import { format } from "date-fns";

export default function GalleryUploadPage() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [heroImageCount, setHeroImageCount] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check current hero image count
    const checkHeroImageCount = async () => {
      try {
        const supabase = getBrowserClient();
        const { count, error } = await supabase
          .from("gallery")
          .select("*", { count: "exact", head: true })
          .eq("is_hero", true);

        if (error) throw error;
        setHeroImageCount(count || 0);
      } catch (error) {
        console.error("Error checking hero images:", error);
      }
    };

    checkHeroImageCount();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      const newPreviews = prevPreviews.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevPreviews[index]);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName.trim()) {
      toast({
        title: "Event Name Required",
        description: "Please enter an event name.",
        variant: "destructive",
      });
      return;
    }

    if (!eventDate) {
      toast({
        title: "Event Date Required",
        description: "Please select an event date.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Images Required",
        description: "Please select at least one image to upload.",
        variant: "destructive",
      });
      return;
    }

    // Remove the hero image limit check during upload
    // Images are uploaded as non-hero by default, limit only applies when setting as hero

    setIsLoading(true);

    try {
      const supabase = getBrowserClient();
      const bucketExists = await ensureBucketExists(STORAGE_BUCKETS.GALLERY);

      if (!bucketExists) {
        throw new Error(
          "Unable to access gallery storage. Please contact the administrator."
        );
      }

      const uploadPromises = images.map(async (imageFile) => {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.GALLERY)
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKETS.GALLERY)
          .getPublicUrl(filePath);

        return {
          event_name: eventName.trim(),
          event_date: format(eventDate, "yyyy-MM-dd"),
          description,
          image_url: urlData.publicUrl,
          is_hero: false,
        };
      });

      const galleryEntries = await Promise.all(uploadPromises);

      const { error: insertError } = await supabase
        .from("gallery")
        .insert(galleryEntries);

      if (insertError) throw insertError;

      toast({
        title: "Images Uploaded",
        description: `${images.length} image(s) have been uploaded successfully.`,
      });

      setImages([]);
      setImagePreviews([]);
      setEventName("");
      setEventDate(undefined);
      setDescription("");

      router.push("/admin/gallery");
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mr-4"
        >
          Back
        </Button>
        <h1 className="text-3xl font-bold">Upload Images</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload to Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Images</Label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[200px]">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                    {imagePreviews.map((previewUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={previewUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-center">
                      <Label
                        htmlFor="image-upload-more"
                        className="cursor-pointer flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 h-32 w-full"
                      >
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="mt-1 text-sm text-gray-500">
                          Add more
                        </span>
                      </Label>
                      <Input
                        id="image-upload-more"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                      >
                        Select Images
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB each. You can select multiple
                      files.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name *</Label>
              <Input
                id="event-name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g., Annual Sports Day 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Event Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description for all images (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Add a description for these event images..."
              />
            </div>

            {heroImageCount >= 4 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> You currently have {heroImageCount}{" "}
                  hero images. You can upload new images normally, but you'll
                  need to remove an existing hero image before marking new ones
                  as hero (maximum 4 allowed).
                </p>
              </div>
            )}

            <Button type="submit" disabled={isLoading || images.length === 0}>
              {isLoading
                ? `Uploading ${images.length} image(s)...`
                : `Upload ${images.length} Image(s)`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
