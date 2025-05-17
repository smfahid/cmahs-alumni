"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { ArrowLeft, ImageIcon, Loader2, Gift } from "lucide-react";
import { ensureBucketExists, STORAGE_BUCKETS } from "@/lib/storage-utils";

interface FormData {
  name: string;
  amount: string;
  mobile_no: string;
  email: string;
  batch: string;
  medium: string;
  medium_tracker_code: string;
}

export default function CreateDonationPage() {
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = getBrowserClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        e.target.value = ""; // Reset file input
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
        title: "Missing Required Fields",
        description: "Please fill in Name and Amount.",
        variant: "destructive",
      });
      return;
    }
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await ensureBucketExists(supabase, STORAGE_BUCKETS.DONATIONS, {
        public: true,
      });
      let imageUrl: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const uniqueFileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        // Store images directly in the bucket root or a subfolder e.g., `images/${uniqueFileName}`
        const filePath = uniqueFileName;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from(STORAGE_BUCKETS.DONATIONS)
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKETS.DONATIONS)
          .getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("donations").insert({
        name: formData.name.trim(),
        amount: amountValue,
        image_url: imageUrl,
        mobile_no: formData.mobile_no.trim() || null,
        email: formData.email.trim() || null,
        batch: formData.batch.trim() || null,
        medium: formData.medium.trim() || null,
        medium_tracker_code: formData.medium_tracker_code.trim() || null,
      });

      if (insertError) throw insertError;

      toast({
        title: "Donation Added",
        description: "The donation has been successfully recorded.",
      });
      router.push("/admin/donations");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating donation:", error);
      toast({
        title: "Error Adding Donation",
        description: error.message || "An unexpected error occurred.",
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
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold flex items-center">
          <Gift className="h-8 w-8 mr-2" /> Add New Donation
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Details</CardTitle>
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
                      alt="Donation image preview"
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
                        const fileInput = document.getElementById(
                          "image-upload"
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.value = "";
                      }}
                    >
                      Change
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
                  placeholder="e.g., 1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_no">Mobile No (Optional)</Label>
                <Input
                  id="mobile_no"
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                  placeholder="e.g., 01xxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., donor@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch (Optional)</Label>
                <Input
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="e.g., HSC 2005"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">Medium (Optional)</Label>
                <Input
                  id="medium"
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  placeholder="e.g., Bank Transfer, bKash"
                />
              </div>
            </div>
            <div className="space-y-2">
              {" "}
              {/* Moved outside grid for full width */}
              <Label htmlFor="medium_tracker_code">
                Medium Tracker Code (Optional)
              </Label>
              <Input
                id="medium_tracker_code"
                name="medium_tracker_code"
                value={formData.medium_tracker_code}
                onChange={handleChange}
                placeholder="e.g., Transaction ID"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLoading ? "Adding Donation..." : "Add Donation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
