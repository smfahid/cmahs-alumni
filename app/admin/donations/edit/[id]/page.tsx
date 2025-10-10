"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { ArrowLeft, ImageIcon, Loader2, Gift } from "lucide-react";
import { ensureBucketExists, STORAGE_BUCKETS } from "@/lib/storage-utils";

interface Donation {
  id: string;
  name: string;
  amount: number;
  image_url?: string | null;
  mobile_no?: string | null;
  email?: string | null;
  batch?: string | null;
  medium?: string | null;
  medium_tracker_code?: string | null;
}

interface FormData {
  name: string;
  amount: string;
  mobile_no: string;
  email: string;
  batch: string;
  medium: string;
  medium_tracker_code: string;
}

export default function EditDonationPage() {
  const router = useRouter();
  const params = useParams();
  const donationId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    amount: "",
    mobile_no: "",
    email: "",
    batch: "",
    medium: "",
    medium_tracker_code: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  const supabase = getBrowserClient();

  const fetchDonation = useCallback(async () => {
    if (!donationId) return;
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("id", donationId)
        .single();
      if (error) throw error;
      if (!data) throw new Error("Donation not found");

      const d = data as Donation;
      setFormData({
        name: d.name,
        amount: d.amount.toString(),
        mobile_no: d.mobile_no || "",
        email: d.email || "",
        batch: d.batch || "",
        medium: d.medium || "",
        medium_tracker_code: d.medium_tracker_code || "",
      });
      if (d.image_url) {
        setImagePreview(d.image_url);
        setExistingImageUrl(d.image_url);
      }
    } catch (error: any) {
      toast({
        title: "Error Fetching Donation",
        description: error.message,
        variant: "destructive",
      });
      router.push("/admin/donations");
    } finally {
      setIsFetching(false);
    }
  }, [donationId, router, supabase, toast]);

  useEffect(() => {
    fetchDonation();
  }, [fetchDonation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "Image too large",
          description: "Max 10MB.",
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
    if (!formData.name.trim() || !formData.amount.trim()) {
      toast({
        title: "Missing Fields",
        description: "Name and Amount are required.",
        variant: "destructive",
      });
      return;
    }
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid positive amount.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await ensureBucketExists(STORAGE_BUCKETS.DONATIONS);
      let finalImageUrl: string | null = existingImageUrl;

      if (imageFile) {
        // New image selected
        if (existingImageUrl) {
          // Delete old image
          try {
            const url = new URL(existingImageUrl);
            const pathSegments = url.pathname.split("/");
            const oldImagePath = pathSegments
              .slice(pathSegments.indexOf(STORAGE_BUCKETS.DONATIONS) + 1)
              .join("/");
            if (oldImagePath)
              await supabase.storage
                .from(STORAGE_BUCKETS.DONATIONS)
                .remove([oldImagePath]);
          } catch (err) {
            console.warn("Failed to delete old image:", err);
          }
        }
        const fileExt = imageFile.name.split(".").pop();
        const newFileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.DONATIONS)
          .upload(newFileName, imageFile);
        if (uploadError) throw uploadError;
        finalImageUrl = supabase.storage
          .from(STORAGE_BUCKETS.DONATIONS)
          .getPublicUrl(uploadData.path).data.publicUrl;
      } else if (imagePreview === null && existingImageUrl !== null) {
        // Image was removed
        try {
          const url = new URL(existingImageUrl);
          const pathSegments = url.pathname.split("/");
          const oldImagePath = pathSegments
            .slice(pathSegments.indexOf(STORAGE_BUCKETS.DONATIONS) + 1)
            .join("/");
          if (oldImagePath)
            await supabase.storage
              .from(STORAGE_BUCKETS.DONATIONS)
              .remove([oldImagePath]);
        } catch (err) {
          console.warn("Failed to delete old image on removal:", err);
        }
        finalImageUrl = null;
      }

      const { error: updateError } = await supabase
        .from("donations")
        .update({
          name: formData.name.trim(),
          amount: amountValue,
          image_url: finalImageUrl,
          mobile_no: formData.mobile_no.trim() || null,
          email: formData.email.trim() || null,
          batch: formData.batch.trim() || null,
          medium: formData.medium.trim() || null,
          medium_tracker_code: formData.medium_tracker_code.trim() || null,
        })
        .eq("id", donationId);
      if (updateError) throw updateError;

      toast({
        title: "Donation Updated",
        description: "Successfully updated.",
      });
      router.push("/admin/donations");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error Updating Donation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin" />{" "}
        <span className="ml-2">Loading...</span>
      </div>
    );

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
        <h1 className="text-3xl font-bold flex items-center">
          <Gift className="h-8 w-8 mr-2" /> Edit Donation
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Donation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Image (Optional)</Label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[150px]">
                {imagePreview ? (
                  <div className="relative w-full max-w-xs mx-auto">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
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
                        const el = document.getElementById(
                          "image-upload"
                        ) as HTMLInputElement;
                        if (el) el.value = "";
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="any"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_no">Mobile No</Label>
                <Input
                  id="mobile_no"
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medium_tracker_code">Tracker Code</Label>
              <Input
                id="medium_tracker_code"
                name="medium_tracker_code"
                value={formData.medium_tracker_code}
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || isFetching}
              className="w-full md:w-auto"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLoading ? "Updating..." : "Update Donation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
