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
      <div className="container mx-auto py-8 px-4 md:px-0">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Support Our Cause
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your generous contributions empower us to continue our mission and
            make a difference. Below are the ways you can donate. After
            donating, please provide proof so we can acknowledge your support.
          </p>
        </header>

        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary">
              <Gift className="h-7 w-7 mr-3" />
              How to Donate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {donationMethods.map((method) => (
              <div
                key={method.name}
                className="p-4 border rounded-lg bg-slate-50 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {method.name}
                </h3>
                {method.type === "number" && method.number && (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-700 font-mono">
                      {method.number}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(method.number!, method.name)}
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy Number
                    </Button>
                  </div>
                )}
                {method.type === "bank" && method.lines && (
                  <div className="relative text-gray-700 text-sm space-y-1 font-mono">
                    {method.lines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => {
                        const fullText = [
                          method.name,
                          ...(method.lines || []),
                        ].join("\n");
                        handleCopy(fullText, `${method.name} details`);
                      }}
                    >
                      <Copy className="h-3 w-3 " /> Copy Info
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
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <UploadCloud className="h-5 w-5 mr-2" /> Provide Donation Proof
            </Button>
          )}
        </div>

        {showProofForm && (
          <Card className="shadow-xl transition-all duration-500 ease-in-out transform animate-fadeIn">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Submit Your Donation Proof
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details of your contribution.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProofForm(false)}
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProof} className="space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label htmlFor="image-upload-proof">
                    Proof Image (Optional)
                  </Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[150px] hover:border-primary transition-colors">
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
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-xs"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            const fileInput = document.getElementById(
                              "image-upload-proof"
                            ) as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                          }}
                        >
                          Change Image
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount Donated (BDT) *</Label>
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
                    <Label htmlFor="mobile_no">Mobile No *</Label>
                    <Input
                      id="mobile_no"
                      name="mobile_no"
                      value={formData.mobile_no}
                      onChange={handleChange}
                      placeholder="e.g., 01xxxxxxxxx"
                      required
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
                    <Label htmlFor="batch">SSC Batch *</Label>
                    <Input
                      id="batch"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      placeholder="e.g., SSC 2005, Supporter"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium">Donation Medium (Optional)</Label>
                    <Input
                      id="medium"
                      name="medium"
                      value={formData.medium}
                      onChange={handleChange}
                      placeholder="e.g., Bkash, Bank Transfer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium_tracker_code">
                    Transaction ID / Reference (Optional)
                  </Label>
                  <Input
                    id="medium_tracker_code"
                    name="medium_tracker_code"
                    value={formData.medium_tracker_code}
                    onChange={handleChange}
                    placeholder="e.g., TrxID123ABC, Bank Ref No."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {isLoading ? "Submitting Proof..." : "Submit Donation Proof"}
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
