"use client";

import type React from "react";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { getBrowserClient } from "@/lib/supabase";
import { Upload } from "lucide-react";
import { ensureBucketExists, STORAGE_BUCKETS } from "@/lib/storage-utils";

export default function MembershipPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1800 + 1 }, (_, i) =>
    (1800 + i).toString()
  );

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    altMobile: "",
    birthday: "",
    gender: "",
    bloodGroup: "",
    fatherName: "",
    motherName: "",

    // Institution Information
    institution: "Char Mehar Azizia High School",
    degree: "",
    department: "",
    passingYear: "",
    batchHSC: "",
    hall: "",

    // Address
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    postcode: "",
    country: "",

    // Professional Information
    designation: "",
    professionalInfo: "",

    // Portal Access
    password: "",
    confirmPassword: "",

    // Agreement
    agreement: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("formData_1->", formData);
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreement) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getBrowserClient();

      console.log("formData_2->", formData);

      // if (formData.mobile) {
      //   const { data: existingUser, error: mobileCheckError } = await supabase
      //     .from("users")
      //     .select("id")
      //     .eq("phone", formData.mobile) // Ensure 'phone' is the correct column name
      //     .maybeSingle(); // Use maybeSingle to not throw error if no user found

      //   if (mobileCheckError) {
      //     // Don't throw, but log and potentially inform user of a system issue
      //     console.error("Error checking mobile number:", mobileCheckError);
      //     // Optionally, you could inform the user that there was an issue checking,
      //     // but for now, we'll proceed cautiously.
      //   }

      //   if (existingUser) {
      //     toast({
      //       title: "Mobile Number Exists",
      //       description:
      //         "This mobile number is already registered. Please use a different one or try logging in.",
      //       variant: "destructive",
      //     });
      //     setIsLoading(false);
      //     return;
      //   }
      // }

      // First, create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      console.log("authData->", authData);

      if (authError) {
        // Handle rate limiting error specifically
        if (authError.message.includes("For security purposes")) {
          toast({
            title: "Registration Rate Limited",
            description:
              "Please wait a minute before trying again. This is a security measure.",
            variant: "destructive",
          });
        } else {
          throw authError;
        }
        setIsLoading(false);
        return;
      }

      let profileImagePath = "";

      // Upload profile image if exists
      if (profileImage && authData.user) {
        // Ensure the bucket exists before uploading
        const bucketExists = await ensureBucketExists(STORAGE_BUCKETS.MEMBERS);

        if (!bucketExists) {
          throw new Error(
            "Unable to access storage. Please contact the administrator."
          );
        }

        const fileExt = profileImage.name.split(".").pop();
        const fileName = `${authData.user.id}.${fileExt}.${Date.now()}`;
        const filePath = `profiles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.MEMBERS)
          .upload(filePath, profileImage);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKETS.MEMBERS)
          .getPublicUrl(filePath);

        profileImagePath = urlData.publicUrl;
      }

      if (authData.user) {
        // Create user record - removed password field
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: formData.email,
          phone: formData.mobile,
          first_name: formData.firstName,
          last_name: formData.lastName,
          profile_image_url: profileImagePath,
          blood_group: formData.bloodGroup,
          gender: formData.gender,
          birthday: formData.birthday,
          batch: formData.batchHSC,
          location: formData.city,
          role: "member",
          is_approved: false,
        });

        if (userError) throw userError;

        // Create member details record
        const { error: detailsError } = await supabase
          .from("member_details")
          .insert({
            user_id: authData.user.id,
            father_name: formData.fatherName,
            mother_name: formData.motherName,
            institution: formData.institution,
            degree: formData.degree,
            department: formData.department,
            passing_year: formData.passingYear,
            batch_hsc: formData.batchHSC,
            hall: formData.hall,
            address_line1: formData.addressLine1,
            address_line2: formData.addressLine2,
            city: formData.city,
            district: formData.district,
            postcode: formData.postcode,
            country: formData.country,
            designation: formData.designation,
            professional_info: formData.professionalInfo,
          });

        if (detailsError) throw detailsError;
      }

      toast({
        title: "Registration Successful",
        description:
          "Your membership application has been submitted and is pending approval.",
      });

      // Sign out the user since they need approval
      await supabase.auth.signOut();

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        altMobile: "",
        birthday: "",
        gender: "",
        bloodGroup: "",
        fatherName: "",
        motherName: "",
        institution: "Char Mehar Azizia High School",
        degree: "",
        department: "",
        passingYear: "",
        batchHSC: "",
        hall: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        district: "",
        postcode: "",
        country: "",
        designation: "",
        professionalInfo: "",
        password: "",
        confirmPassword: "",
        agreement: false,
      });
      setProfileImage(null);
      setProfileImageUrl("");
      setStep(1);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 sm:p-10">
              <h1 className="text-3xl font-bold text-center mb-8">
                Member Registration
              </h1>

              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`flex flex-col items-center ${
                        s < step
                          ? "text-primary"
                          : s === step
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          s < step
                            ? "bg-primary text-white"
                            : s === step
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {s}
                      </div>
                      <span className="text-xs hidden sm:block">
                        {s === 1
                          ? "Personal"
                          : s === 2
                          ? "Institution"
                          : s === 3
                          ? "Professional"
                          : "Account"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 bg-primary rounded-full transition-all"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Form content remains the same */}
                {/* ... */}
                {/* I'm not changing the form UI, just the submission logic */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Personal Information
                    </h2>

                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {profileImageUrl ? (
                            <img
                              src={profileImageUrl || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <label
                          htmlFor="profile-image"
                          className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                        </label>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileImageChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="altMobile">Alternative Mobile</Label>
                        <Input
                          id="altMobile"
                          name="altMobile"
                          value={formData.altMobile}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="birthday">Birthday</Label>
                        <Input
                          id="birthday"
                          name="birthday"
                          type="date"
                          value={formData.birthday}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleSelectChange("gender", value)
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
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select
                          value={formData.bloodGroup}
                          onValueChange={(value) =>
                            handleSelectChange("bloodGroup", value)
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fatherName">Father's Name</Label>
                        <Input
                          id="fatherName"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="motherName">Mother's Name</Label>
                        <Input
                          id="motherName"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Institution Information
                    </h2>

                    <div>
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        disabled
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="degree">Degree</Label>
                        <Select
                          value={formData.degree}
                          onValueChange={(value) =>
                            handleSelectChange("degree", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SSC">SSC</SelectItem>
                            <SelectItem value="HSC">HSC</SelectItem>
                            <SelectItem value="BSc">BSc</SelectItem>
                            <SelectItem value="MSc">MSc</SelectItem>
                            <SelectItem value="Hons">Hons</SelectItem>
                            <SelectItem value="Masters">Masters</SelectItem>
                            <SelectItem value="MBA">MBA</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="batchHSC">Batch (SSC)</Label>
                        <Select
                          value={formData.batchHSC}
                          onValueChange={(value) =>
                            handleSelectChange("batchHSC", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select SSC Batch" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4 mt-8">
                      Current Address
                    </h2>

                    <div>
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input
                          id="postcode"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                      >
                        Previous
                      </Button>
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Professional Information
                    </h2>

                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="professionalInfo">
                        Professional Info
                      </Label>
                      <Textarea
                        id="professionalInfo"
                        name="professionalInfo"
                        value={formData.professionalInfo}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                      >
                        Previous
                      </Button>
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Account Information
                    </h2>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreement"
                        checked={formData.agreement}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("agreement", checked as boolean)
                        }
                      />
                      <Label htmlFor="agreement" className="text-sm">
                        I hereby declare that, as a Life Member/Associate Life
                        Member, I shall abide by the rules and regulations of
                        Char Mehar Azizia High School Alumni and support its
                        activities that will help achieve its objectives.
                      </Label>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                      >
                        Previous
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
