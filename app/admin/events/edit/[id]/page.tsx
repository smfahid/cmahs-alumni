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
import { ArrowLeft, ImageIcon, Loader2 } from "lucide-react";
import { STORAGE_BUCKETS } from "@/lib/storage-utils"; // Assuming you have this for bucket names

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string; // ISO string
  location: string | null;
  image_url: string | null;
}

interface FormData {
  title: string;
  description: string;
  eventDate: string; // For datetime-local input
  location: string;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    eventDate: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  const supabase = getBrowserClient();

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Event not found");

      const event = data as Event;
      setFormData({
        title: event.title,
        description: event.description,
        eventDate: event.event_date
          ? new Date(event.event_date).toISOString().substring(0, 16)
          : "", // Format for datetime-local
        location: event.location || "",
      });
      if (event.image_url) {
        setImagePreview(event.image_url);
        setExistingImageUrl(event.image_url);
      }
    } catch (error: any) {
      toast({
        title: "Error Fetching Event",
        description: error.message,
        variant: "destructive",
      });
      router.push("/admin/events");
    } finally {
      setIsFetching(false);
    }
  }, [eventId, router, supabase, toast]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "Image too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.eventDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in Title, Description, and Event Date.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let finalImageUrl: string | null = existingImageUrl;

      // Handle image upload/replacement
      if (imageFile) {
        // If there was an old image and a new one is uploaded, delete the old one
        if (existingImageUrl) {
          try {
            const oldImageName = existingImageUrl
              .split(`${STORAGE_BUCKETS.EVENTS}/`)
              .pop();
            if (oldImageName) {
              await supabase.storage
                .from(STORAGE_BUCKETS.EVENTS)
                .remove([oldImageName]);
            }
          } catch (storageError: any) {
            console.warn(
              "Failed to delete old event image:",
              storageError.message
            );
            // Non-critical, proceed with update
          }
        }

        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`; // Store directly in the events bucket

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.EVENTS)
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;
        finalImageUrl = supabase.storage
          .from(STORAGE_BUCKETS.EVENTS)
          .getPublicUrl(uploadData.path).data.publicUrl;
      } else if (imagePreview === null && existingImageUrl !== null) {
        // Image was removed by user
        try {
          const oldImageName = existingImageUrl
            .split(`${STORAGE_BUCKETS.EVENTS}/`)
            .pop();
          if (oldImageName) {
            await supabase.storage
              .from(STORAGE_BUCKETS.EVENTS)
              .remove([oldImageName]);
          }
        } catch (storageError: any) {
          console.warn(
            "Failed to delete removed event image:",
            storageError.message
          );
        }
        finalImageUrl = null;
      }

      const { error: updateError } = await supabase
        .from("events")
        .update({
          title: formData.title,
          description: formData.description,
          event_date: new Date(formData.eventDate).toISOString(),
          location: formData.location || null,
          image_url: finalImageUrl,
        })
        .eq("id", eventId);

      if (updateError) throw updateError;

      toast({
        title: "Event Updated",
        description: "The event has been updated successfully.",
      });
      router.push("/admin/events");
      router.refresh(); // To reflect changes on the list page
    } catch (error: any) {
      toast({
        title: "Error Updating Event",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading event details...</span>
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
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Event</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date and Time *</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-upload">Event Image</Label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[150px]">
                {imagePreview ? (
                  <div className="relative w-full max-w-md mx-auto">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="w-full h-auto max-h-64 object-contain rounded-md"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        // Clear the file input
                        const fileInput = document.getElementById(
                          "image-upload"
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.value = "";
                      }}
                    >
                      {imageFile ? "Cancel Change" : "Remove/Change"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <Label
                      htmlFor="image-upload"
                      className="mt-2 cursor-pointer text-sm text-primary hover:underline"
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
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isLoading || isFetching}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLoading ? "Updating..." : "Update Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
