"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getSupabase } from "@/lib/supabase";
import { ensureBucketExists, STORAGE_BUCKETS } from "@/lib/storage-utils";
import { Gift, Copy, UploadCloud, X, ImageIcon, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/main-layout";

interface FormData {
  name: string;
  amount: string;
  mobile_no: string;
  email: string;
  batch: string;
  medium: string;
  medium_tracker_code: string;
}

const initialFormData: FormData = {
  name: "",
  amount: "",
  mobile_no: "",
  email: "",
  batch: "",
  medium: "",
  medium_tracker_code: "",
};

interface DonationMethod {
  name: string;
  type: "number" | "bank";
  number?: string;
  lines?: string[];
  icon?: React.ElementType;
}

export default function DonationPage() {
  const [showProofForm, setShowProofForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = getSupabase();

  const donationMethods: DonationMethod[] = [
    { name: "Bkash/Nagad/Rocket/Upay", number: "01936190461", type: "number" },
    { name: "Bkash/Nagad/Rocket/Upay", number: "01764440404", type: "number" },
    {
      name: "MD.RIFAT ALAM MOHIM",
      type: "bank",
      lines: [
        "A/c # 2120219020955",
        "Prime Bank Limited",
        "Agrabad Branch",
        "Routing # 170150130",
        "Swift Code - PRBLBDDH015",
        "+8801936190461",
      ],
    },
    {
      name: "SHAHIDUL ISLAM",
      type: "bank",
      lines: [
        "A/c # 1515104930493001",
        "Brac Bank Ltd",
        "Tongee Branch, Gazipur",
        "Routing # 060331630",
        "Swift Code - BRAKBDDH",
        "+8801764440404",
      ],
    },
  ];

  const handleCopy = async (textToCopy: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied to clipboard!",
        description: `${fieldName} (${textToCopy}) copied.`,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Copy Failed",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

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

  const handleSubmitProof = async (e: React.FormEvent) => {
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
      await ensureBucketExists(STORAGE_BUCKETS.DONATIONS);
      let imageUrl: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const uniqueFileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
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
        title: "Proof Submitted Successfully!",
        description:
          "Thank you for your contribution. Your proof has been recorded.",
      });
      setFormData(initialFormData);
      setImageFile(null);
      setImagePreview(null);
      const fileInput = document.getElementById(
        "image-upload-proof"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setShowProofForm(false);
    } catch (error: any) {
      console.error("Error submitting donation proof:", error);
      toast({
        title: "Error Submitting Proof",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white via-primary-50/20 to-white min-h-screen">
        {/* Header Section */}
        <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
                Support Our Mission
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Your generous contributions empower us to continue our mission and
                make a lasting difference in our community.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <Card className="mb-12 shadow-card border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary-50/50 to-white p-8 sm:p-10">
              <CardTitle className="text-2xl sm:text-3xl flex items-center text-foreground font-semibold tracking-tight">
                <Gift className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-primary" />
                Donation Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8 sm:p-10">
            {donationMethods.map((method, index) => (
              <div
                key={method.name}
                className="p-6 border-2 border-border/50 rounded-2xl bg-white hover:shadow-card hover:border-primary/30 transition-all duration-200 group"
              >
                <h3 className="text-xl font-semibold mb-4 text-foreground tracking-tight">
                  {method.name}
                </h3>
                {method.type === "number" && method.number && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-lg text-foreground font-mono bg-muted px-4 py-3 rounded-xl">
                      {method.number}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(method.number!, method.name)}
                      className="rounded-xl border-2 h-10 px-4 text-[15px] hover:bg-primary-50 hover:border-primary/30 active:scale-95"
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy Number
                    </Button>
                  </div>
                )}
                {method.type === "bank" && method.lines && (
                  <div className="relative bg-muted/50 p-5 rounded-xl">
                    <div className="text-foreground/80 text-sm space-y-1.5 font-mono">
                      {method.lines.map((line, idx) => (
                        <p key={idx} className="leading-relaxed">{line}</p>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 rounded-xl border-2 h-10 px-4 text-[15px] hover:bg-primary-50 hover:border-primary/30 active:scale-95"
                      onClick={() => {
                        const fullText = [
                          method.name,
                          ...(method.lines || []),
                        ].join("\n");
                        handleCopy(fullText, `${method.name} details`);
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center mb-12">
          {!showProofForm && (
            <Button
              size="lg"
              onClick={() => setShowProofForm(true)}
              className="bg-primary hover:bg-primary-600 text-white rounded-xl h-14 px-8 text-base font-medium shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <UploadCloud className="h-5 w-5 mr-2" /> Submit Donation Proof
            </Button>
          )}
        </div>

        {showProofForm && (
          <Card className="shadow-card transition-all duration-500 ease-in-out transform animate-fadeIn border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-br from-primary-50/30 to-white p-8 sm:p-10">
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Submit Donation Proof
                </CardTitle>
                <p className="text-[15px] text-muted-foreground mt-2">
                  Fill in the details of your contribution
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProofForm(false)}
                aria-label="Close form"
                className="rounded-xl hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-8 sm:p-10">
              <form onSubmit={handleSubmitProof} className="space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-3">
                  <Label htmlFor="image-upload-proof" className="text-[15px] font-medium">
                    Proof Image (Optional)
                  </Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-border rounded-2xl p-8 min-h-[180px] hover:border-primary/50 transition-colors bg-muted/20">
                    {imagePreview ? (
                      <div className="relative w-full max-w-xs mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Donation proof preview"
                          width={200}
                          height={200}
                          className="w-full h-auto max-h-64 object-contain rounded-md shadow-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-xs rounded-lg border-2 active:scale-95"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            const fileInput = document.getElementById(
                              "image-upload-proof"
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
                          htmlFor="image-upload-proof"
                          className="mt-2 cursor-pointer text-sm text-primary hover:underline font-medium"
                        >
                          Select Image to Upload
                        </Label>
                        <Input
                          id="image-upload-proof"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[15px] font-medium">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Jane Doe"
                      className="h-12 rounded-xl border-2 text-[15px] focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-[15px] font-medium">Amount Donated (BDT) *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="any"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 1000"
                      className="h-12 rounded-xl border-2 text-[15px] focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile_no" className="text-[15px] font-medium">Mobile No *</Label>
                    <Input
                      id="mobile_no"
                      name="mobile_no"
                      value={formData.mobile_no}
                      onChange={handleChange}
                      placeholder="e.g., 01xxxxxxxxx"
                      required
                      className="h-12 rounded-xl border-2 text-[15px] focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[15px] font-medium">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., donor@example.com"
                      className="h-12 rounded-xl border-2 text-[15px] focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch" className="text-[15px] font-medium">SSC Batch *</Label>
                    <Input
                      id="batch"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      placeholder="e.g., SSC 2005, Supporter"
                      required
                      className="h-12 rounded-xl border-2 text-[15px] focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium" className="text-[15px] font-medium">Donation Medium (Optional)</Label>
                    <Input
                      id="medium"
                      name="medium"
                      value={formData.medium}
                      onChange={handleChange}
                      placeholder="e.g., Bkash, Bank Transfer"
                      className="h-12 rounded-xl border-2 text-[15px] focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium_tracker_code" className="text-[15px] font-medium">
                    Transaction ID / Reference (Optional)
                  </Label>
                  <Input
                    id="medium_tracker_code"
                    name="medium_tracker_code"
                    value={formData.medium_tracker_code}
                    onChange={handleChange}
                    placeholder="e.g., TrxID123ABC, Bank Ref No."
                    className="h-12 rounded-xl border-2 text-[15px] focus:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-600 text-white rounded-xl h-12 px-8 text-[15px] font-medium shadow-sm hover:shadow-md active:scale-95 transition-all"
                >
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {isLoading ? "Submitting..." : "Submit Donation Proof"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    </MainLayout>
  );
}
