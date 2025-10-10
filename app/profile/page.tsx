"use client";

import { useEffect, useState, useRef } from "react";
import { MainLayout } from "@/components/main-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { ImageCropDialog } from "@/components/ImageCropDialog";
import { ensureBucketExists, STORAGE_BUCKETS } from "@/lib/storage-utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Users table fields
  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    blood_group: "",
    gender: "",
    batch: "",
    location: "",
    nid_number: "",
  });

  // Member details table fields
  const [detailsForm, setDetailsForm] = useState({
    father_name: "",
    mother_name: "",
    institution: "",
    group: "",
    batch_hsc: "",
    address_line1: "",
    address_line2: "",
    city: "",
    district: "",
    postcode: "",
    country: "",
    permanent_address_line1: "",
    permanent_address_line2: "",
    permanent_city: "",
    permanent_district: "",
    permanent_postcode: "",
    permanent_country: "",
    designation: "",
    professional_info: "",
    profession: "",
    marital_status: "",
    spouse_name: "",
    number_of_children: "",
  });

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const supabase = getBrowserClient() as any;

        // Fetch users table data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (userError) {
          console.error("User data fetch error:", userError);
          throw userError;
        }

        // Fetch member_details table data (use maybeSingle to not error if not found)
        const { data: detailsData, error: detailsError } = await supabase
          .from("member_details")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (detailsError) {
          console.error("Member details fetch error:", detailsError);
        }

        setUserForm({
          first_name: userData?.first_name || "",
          last_name: userData?.last_name || "",
          email: userData?.email || "",
          phone: userData?.phone || "",
          blood_group: userData?.blood_group || "",
          gender: userData?.gender || "",
          batch: userData?.batch || "",
          location: userData?.location || "",
          nid_number: userData?.nid_number || "",
        });

        // Set profile image URL
        setProfileImageUrl(userData?.profile_image_url || null);

        if (detailsData) {
          setDetailsForm({
            father_name: detailsData?.father_name || "",
            mother_name: detailsData?.mother_name || "",
            institution: detailsData?.institution || "",
            group: detailsData?.group || "",
            batch_hsc: detailsData?.batch_hsc || "",
            address_line1: detailsData?.address_line1 || "",
            address_line2: detailsData?.address_line2 || "",
            city: detailsData?.city || "",
            district: detailsData?.district || "",
            postcode: detailsData?.postcode || "",
            country: detailsData?.country || "",
            permanent_address_line1: detailsData?.permanent_address_line1 || "",
            permanent_address_line2: detailsData?.permanent_address_line2 || "",
            permanent_city: detailsData?.permanent_city || "",
            permanent_district: detailsData?.permanent_district || "",
            permanent_postcode: detailsData?.permanent_postcode || "",
            permanent_country: detailsData?.permanent_country || "",
            designation: detailsData?.designation || "",
            professional_info: detailsData?.professional_info || "",
            profession: detailsData?.profession || "",
            marital_status: detailsData?.marital_status || "",
            spouse_name: detailsData?.spouse_name || "",
            number_of_children:
              detailsData?.number_of_children?.toString() || "",
          });
        }
      } catch (e: any) {
        console.error("Profile load error:", e);
        toast({
          title: "Failed to load profile",
          description: e.message || "",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [user, toast]);

  const onUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const onDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetailsForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectChange = (
    name: string,
    value: string,
    target: "user" | "details"
  ) => {
    if (target === "user") {
      setUserForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setDetailsForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const supabase = getBrowserClient();

      // Update users table
      const { error: userError } = await supabase
        .from("users")
        .update({
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          phone: userForm.phone,
          blood_group: userForm.blood_group,
          gender: userForm.gender,
          batch: userForm.batch,
          location: userForm.location,
          nid_number: userForm.nid_number,
        })
        .eq("id", user.id);
      if (userError) throw userError;

      // Update member_details table
      const { error: detailsError } = await supabase
        .from("member_details")
        .update({
          ...detailsForm,
          number_of_children: detailsForm.number_of_children
            ? parseInt(detailsForm.number_of_children)
            : null,
        })
        .eq("user_id", user.id);
      if (detailsError) throw detailsError;

      toast({ title: "Profile updated successfully" });
    } catch (e: any) {
      toast({
        title: "Update failed",
        description: e.message || "",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userForm.first_name) {
      const firstInitial = userForm.first_name.charAt(0).toUpperCase();
      if (userForm.last_name) {
        const lastInitial = userForm.last_name.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
      }
      return firstInitial;
    }
    if (userForm.email) {
      return userForm.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Handle file selection and show crop dialog
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit for original)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Create image URL for cropping
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setImageToCrop(imageUrl);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle crop completion
  const handleCropComplete = (croppedBlob: Blob) => {
    setCroppedImageBlob(croppedBlob);

    // Create preview URL from blob
    const previewUrl = URL.createObjectURL(croppedBlob);
    setImagePreview(previewUrl);

    toast({
      title: "Image cropped",
      description: "Click 'Upload' to save your profile picture.",
    });
  };

  // Handle crop dialog close
  const handleCropDialogClose = () => {
    setCropDialogOpen(false);
    setImageToCrop(null);
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!croppedImageBlob) return;

    setUploadingImage(true);

    try {
      const supabase = getBrowserClient();

      // Ensure the bucket exists
      const bucketExists = await ensureBucketExists(STORAGE_BUCKETS.MEMBERS);
      if (!bucketExists) {
        throw new Error(
          "Unable to access storage. Please contact administrator."
        );
      }

      // Create a unique filename
      const fileName = `${user?.id}.jpg.${Date.now()}`;
      const filePath = `profiles/${fileName}`;

      // Upload the cropped file
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.MEMBERS)
        .upload(filePath, croppedImageBlob, {
          cacheControl: "3600",
          upsert: true,
          contentType: "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKETS.MEMBERS).getPublicUrl(filePath);

      // Update the user's profile_image_url in the database
      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image_url: publicUrl })
        .eq("id", user?.id);

      if (updateError) {
        throw updateError;
      }

      // Clean up preview URL
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      // Update local state
      setProfileImageUrl(publicUrl);
      setImagePreview(null);
      setCroppedImageBlob(null);

      toast({
        title: "Profile image updated",
        description: "Your profile image has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description:
          error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Cancel image selection
  const cancelImageSelection = () => {
    // Clean up preview URL
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setCroppedImageBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle image removal
  const handleImageRemove = async () => {
    if (!profileImageUrl) return;

    setUploadingImage(true);

    try {
      const supabase = getBrowserClient();

      // Update the user's profile_image_url to null in the database
      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image_url: null })
        .eq("id", user?.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setProfileImageUrl(null);

      toast({
        title: "Profile image removed",
        description: "Your profile image has been removed.",
      });
    } catch (error: any) {
      console.error("Error removing image:", error);
      toast({
        title: "Remove failed",
        description:
          error.message || "Failed to remove image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-10 px-4">
          <p>Please log in to view your profile.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-semibold mb-8">Profile</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-8">
            {/* Profile Image Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">
                Profile Picture
              </h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        imagePreview ||
                        profileImageUrl ||
                        "/placeholder-user.jpg"
                      }
                      alt="Profile picture"
                    />
                    <AvatarFallback className="bg-primary text-white text-2xl font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {!imagePreview ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{profileImageUrl ? "Change" : "Upload"}</span>
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          className="flex items-center space-x-2"
                        >
                          <Upload className="h-4 w-4" />
                          <span>
                            {uploadingImage ? "Uploading..." : "Upload"}
                          </span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={cancelImageSelection}
                          disabled={uploadingImage}
                          className="flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </Button>
                      </>
                    )}
                    {profileImageUrl && !imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleImageRemove}
                        disabled={uploadingImage}
                        className="flex items-center space-x-2 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                        <span>Remove</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    JPG, PNG or GIF. Max size 10MB.
                  </p>
                  {imagePreview && (
                    <p className="text-xs text-green-600">
                      Preview ready. Click "Upload" to save or "Cancel" to
                      discard.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={onSave} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={userForm.first_name}
                      onChange={onUserChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={userForm.last_name}
                      onChange={onUserChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email (read-only)</Label>
                    <Input
                      id="email"
                      name="email"
                      value={userForm.email}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={userForm.phone}
                      onChange={onUserChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="father_name">Father's name</Label>
                    <Input
                      id="father_name"
                      name="father_name"
                      value={detailsForm.father_name}
                      onChange={onDetailsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother_name">Mother's name</Label>
                    <Input
                      id="mother_name"
                      name="mother_name"
                      value={detailsForm.mother_name}
                      onChange={onDetailsChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={userForm.gender}
                      onValueChange={(val) =>
                        onSelectChange("gender", val, "user")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="blood_group">Blood group</Label>
                    <Select
                      value={userForm.blood_group}
                      onValueChange={(val) =>
                        onSelectChange("blood_group", val, "user")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="nid_number">NID number</Label>
                  <Input
                    id="nid_number"
                    name="nid_number"
                    value={userForm.nid_number}
                    onChange={onUserChange}
                  />
                </div>
              </div>

              {/* Institution Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">
                  Institution Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={detailsForm.institution}
                      onChange={onDetailsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="group">Group</Label>
                    <Input
                      id="group"
                      name="group"
                      value={detailsForm.group}
                      onChange={onDetailsChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="batch_hsc">Batch (SSC)</Label>
                    <Input
                      id="batch_hsc"
                      name="batch_hsc"
                      value={detailsForm.batch_hsc}
                      onChange={onDetailsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="batch">Batch (stored in users)</Label>
                    <Input
                      id="batch"
                      name="batch"
                      value={userForm.batch}
                      onChange={onUserChange}
                    />
                  </div>
                </div>
              </div>

              {/* Current Address */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">
                  Current Address
                </h2>
                <div>
                  <Label htmlFor="address_line1">Address line 1</Label>
                  <Input
                    id="address_line1"
                    name="address_line1"
                    value={detailsForm.address_line1}
                    onChange={onDetailsChange}
                  />
                </div>
                <div>
                  <Label htmlFor="address_line2">Address line 2</Label>
                  <Input
                    id="address_line2"
                    name="address_line2"
                    value={detailsForm.address_line2}
                    onChange={onDetailsChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City/Upazila</Label>
                    <Input
                      id="city"
                      name="city"
                      value={detailsForm.city}
                      onChange={onDetailsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      name="district"
                      value={detailsForm.district}
                      onChange={onDetailsChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      value={detailsForm.postcode}
                      onChange={onDetailsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={detailsForm.country}
                      onChange={onDetailsChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location (users table)</Label>
                  <Input
                    id="location"
                    name="location"
                    value={userForm.location}
                    onChange={onUserChange}
                  />
                </div>
              </div>

              {/* Permanent Address */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">
                  Permanent Address
                </h2>
                <div>
                  <Label htmlFor="permanent_address_line1">
                    Address line 1
                  </Label>
                  <Input
                    id="permanent_address_line1"
                    name="permanent_address_line1"
                    value={detailsForm.permanent_address_line1}
                    onChange={onDetailsChange}
                  />
                </div>
                <div>
                  <Label htmlFor="permanent_address_line2">
                    Address line 2
                  </Label>
                  <Input
                    id="permanent_address_line2"
                    name="permanent_address_line2"
                    value={detailsForm.permanent_address_line2}
                    onChange={onDetailsChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="permanent_city">City/Upazila</Label>
                    <Input
                      id="permanent_city"
                      name="permanent_city"
                      value={detailsForm.permanent_city}
                      onChange={onDetailsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="permanent_district">District</Label>
                    <Input
                      id="permanent_district"
                      name="permanent_district"
                      value={detailsForm.permanent_district}
                      onChange={onDetailsChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="permanent_postcode">Postcode</Label>
                    <Input
                      id="permanent_postcode"
                      name="permanent_postcode"
                      value={detailsForm.permanent_postcode}
                      onChange={onDetailsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="permanent_country">Country</Label>
                    <Input
                      id="permanent_country"
                      name="permanent_country"
                      value={detailsForm.permanent_country}
                      onChange={onDetailsChange}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">
                  Professional Information
                </h2>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    name="designation"
                    value={detailsForm.designation}
                    onChange={onDetailsChange}
                  />
                </div>
                <div>
                  <Label htmlFor="professional_info">Professional info</Label>
                  <Textarea
                    id="professional_info"
                    name="professional_info"
                    value={detailsForm.professional_info}
                    onChange={onDetailsChange}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    name="profession"
                    value={detailsForm.profession}
                    onChange={onDetailsChange}
                  />
                </div>
                <div>
                  <Label htmlFor="marital_status">Marital status</Label>
                  <Select
                    value={detailsForm.marital_status}
                    onValueChange={(val) =>
                      onSelectChange("marital_status", val, "details")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(detailsForm.marital_status === "Married" ||
                  detailsForm.marital_status === "Widowed") && (
                  <>
                    <div>
                      <Label htmlFor="spouse_name">Spouse name</Label>
                      <Input
                        id="spouse_name"
                        name="spouse_name"
                        value={detailsForm.spouse_name}
                        onChange={onDetailsChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="number_of_children">
                        Number of children
                      </Label>
                      <Input
                        id="number_of_children"
                        name="number_of_children"
                        type="number"
                        value={detailsForm.number_of_children}
                        onChange={onDetailsChange}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={saving} size="lg">
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Image Crop Dialog */}
      {imageToCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          imageSrc={imageToCrop}
          onClose={handleCropDialogClose}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
          circularCrop={true}
        />
      )}
    </MainLayout>
  );
}
