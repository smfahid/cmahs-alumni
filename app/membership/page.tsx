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

const BANGLADESHI_DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barisal",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chapai Nawabganj",
  "Chattogram",
  "Chuadanga",
  "Comilla",
  "Cox's Bazar",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

const PROFESSIONS = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Businessman",
  "Lawyer",
  "Farmer",
  "Government Service",
  "Private Service",
  "Student",
  "Homemaker",
  "Other",
];

const MARITAL_STATUS_OPTIONS = ["Single", "Married", "Divorced", "Widowed"];

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function MembershipPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1976 + 1 }, (_, i) =>
    (1976 + i).toString()
  ).reverse();

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
    nidNumber: "",

    // Institution Information
    institution: "Char Mehar Azizia High School",
    group: "",
    batchHSC: "",

    // Current Address
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    postcode: "",
    country: "Bangladesh",

    // Permanent Address
    permanentAddressLine1: "",
    permanentAddressLine2: "",
    permanentCity: "",
    permanentDistrict: "",
    permanentPostcode: "",
    permanentCountry: "",

    // Professional Information
    designation: "",
    professionalInfo: "",
    profession: "",
    maritalStatus: "",
    spouseName: "",
    numberOfChildren: "",
    others: "",
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
        // Create user record and auto-approve for immediate access
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: formData.email,
          phone: formData.mobile,
          first_name: formData.firstName,
          last_name: formData.lastName,
          profile_image_url: profileImagePath,
          blood_group: formData.bloodGroup,
          gender: formData.gender,
          batch: formData.batchHSC,
          location: formData.city,
          role: "member",
          is_approved: true,
          nid_number: formData.nidNumber,
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
            group: formData.group,
            batch_hsc: formData.batchHSC,
            address_line1: formData.addressLine1,
            address_line2: formData.addressLine2,
            city: formData.city,
            district: formData.district,
            postcode: formData.postcode,
            country: formData.country,
            permanent_address_line1: formData.permanentAddressLine1,
            permanent_address_line2: formData.permanentAddressLine2,
            permanent_city: formData.permanentCity,
            permanent_district: formData.permanentDistrict,
            permanent_postcode: formData.permanentPostcode,
            permanent_country: formData.permanentCountry,
            designation: formData.designation,
            professional_info: formData.professionalInfo,
            profession: formData.profession,
            marital_status: formData.maritalStatus,
            spouse_name:
              (formData.maritalStatus === "Married" ||
                formData.maritalStatus === "Widowed") &&
              formData.spouseName
                ? formData.spouseName
                : null,
            number_of_children:
              (formData.maritalStatus === "Married" ||
                formData.maritalStatus === "Widowed") &&
              formData.numberOfChildren
                ? parseInt(formData.numberOfChildren)
                : null,
          });

        if (detailsError) throw detailsError;
      }

      toast({
        title: "Registration Successful",
        description:
          "Your account is ready. You can now log in using your credentials.",
      });

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
        nidNumber: "",
        institution: "Char Mehar Azizia High School",
        group: "",
        batchHSC: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        district: "",
        postcode: "",
        country: "Bangladesh",
        permanentAddressLine1: "",
        permanentAddressLine2: "",
        permanentCity: "",
        permanentDistrict: "",
        permanentPostcode: "",
        permanentCountry: "",
        designation: "",
        professionalInfo: "",
        profession: "",
        maritalStatus: "",
        spouseName: "",
        numberOfChildren: "",
        others: "",
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

  const validateStep = (currentStep: number): boolean => {
    // Define strictly required fields for progressing to the next step
    const strictlyRequiredFields: {
      [key: number]: Array<keyof typeof formData | "profileImage">;
    } = {
      1: [
        "firstName",
        "lastName",
        "mobile",
        // "nidNumber", // NID
        "gender",
      ],
      2: [
        "batchHSC", // Batch
        // "addressLine1", // No longer required for step progression
        // "city", // No longer required for step progression
      ],
      // Step 3 and 4 do not have specific fields required to *proceed* to them,
      // but fields within them (like password or agreement) are validated on final submit.
    };

    const fieldsToValidate = strictlyRequiredFields[currentStep];
    if (!fieldsToValidate || fieldsToValidate.length === 0) {
      return true; // No strict progression validation defined for this step or no fields to validate
    }

    for (const field of fieldsToValidate) {
      if (field === "profileImage") {
        if (!profileImage) {
          toast({
            title: "Missing Information",
            description: "Please upload a profile image to proceed.",
            variant: "destructive",
          });
          return false;
        }
      } else if (!formData[field as keyof typeof formData]) {
        // Create a more readable field name for the toast message
        const fieldName = field
          .replace(/([A-Z])/g, " $1") // Add space before capital letters
          .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

        toast({
          title: "Missing Information",
          description: `Please fill in the "${fieldName}" field to proceed.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      return;
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white via-primary-50/20 to-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-border/50">
            <div className="p-6 sm:p-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center mb-4 text-foreground">
                Join Our Community
              </h1>
              <p className="text-center text-muted-foreground mb-10 text-[15px] sm:text-base">
                Complete your membership registration in a few simple steps
              </p>

              {/* Apple-style Step Indicator */}
              <div className="mb-10">
                <div className="flex justify-between items-center relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${((step - 1) / 3) * 100}%` }}
                    />
                  </div>

                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className="flex flex-col items-center relative"
                    >
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                          s <= step
                            ? "bg-primary text-white shadow-md scale-110"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="font-medium">{s}</span>
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium transition-colors ${
                          s <= step
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {s === 1
                          ? "Personal"
                          : s === 2
                          ? "Address"
                          : s === 3
                          ? "Professional"
                          : "Account"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Form content remains the same */}
                {/* ... */}
                {/* I'm not changing the form UI, just the submission logic */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Personal Information 1
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
                        <Label htmlFor="firstName">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mobile">
                          Mobile <span className="text-red-500">*</span>
                        </Label>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nidNumber">NID Number</Label>
                        <Input
                          id="nidNumber"
                          name="nidNumber"
                          value={formData.nidNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gender">
                          Gender <span className="text-red-500">*</span>
                        </Label>
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

                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="rounded-xl h-12 px-8 text-[15px] font-medium shadow-sm hover:shadow-md active:scale-95 transition-all"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Personal Information 2
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
                        <Label htmlFor="group">Group</Label>
                        <Select
                          value={formData.group}
                          onValueChange={(value) =>
                            handleSelectChange("group", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Commerce">Commerce</SelectItem>
                            <SelectItem value="Arts">Arts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="batchHSC">
                          Batch (SSC) <span className="text-red-500">*</span>
                        </Label>
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
                      <Label htmlFor="addressLine1">
                        Address Line 1 (Home/Village/Road)
                      </Label>
                      <Input
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressLine2">
                        Address Line 2 (Post Office)
                      </Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Upazila/Thana</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
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
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            handleSelectChange("country", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((countryName) => (
                              <SelectItem key={countryName} value={countryName}>
                                {countryName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4 mt-8">
                      Permanent Address
                    </h2>

                    <div>
                      <Label htmlFor="permanentAddressLine1">
                        Address Line 1 (Home/Village/Road)
                      </Label>
                      <Input
                        id="permanentAddressLine1"
                        name="permanentAddressLine1"
                        value={formData.permanentAddressLine1}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="permanentAddressLine2">
                        Address Line 2 (Post Office)
                      </Label>
                      <Input
                        id="permanentAddressLine2"
                        name="permanentAddressLine2"
                        value={formData.permanentAddressLine2}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="permanentCity">Upazila/Thana</Label>
                        <Input
                          id="permanentCity"
                          name="permanentCity"
                          value={formData.permanentCity}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="permanentDistrict">District</Label>
                        <Select
                          value={formData.permanentDistrict}
                          onValueChange={(value) =>
                            handleSelectChange("permanentDistrict", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {BANGLADESHI_DISTRICTS.map((dist) => (
                              <SelectItem key={dist} value={dist}>
                                {dist}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="permanentPostcode">Postcode</Label>
                        <Input
                          id="permanentPostcode"
                          name="permanentPostcode"
                          value={formData.permanentPostcode}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="permanentCountry">Country</Label>
                        <Select
                          value={formData.permanentCountry}
                          onValueChange={(value) =>
                            handleSelectChange("permanentCountry", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((countryName) => (
                              <SelectItem key={countryName} value={countryName}>
                                {countryName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-between gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="rounded-xl h-12 px-8 text-[15px] font-medium border-2 hover:bg-muted active:scale-95 transition-all"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="rounded-xl h-12 px-8 text-[15px] font-medium shadow-sm hover:shadow-md active:scale-95 transition-all"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Personal Information 3
                    </h2>

                    <div>
                      <Label htmlFor="professionalInfo">
                        Professional Info (Organization's
                        name/Designation/Office address)
                      </Label>
                      <Textarea
                        id="professionalInfo"
                        name="professionalInfo"
                        value={formData.professionalInfo}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select
                        value={formData.maritalStatus}
                        onValueChange={(value) =>
                          handleSelectChange("maritalStatus", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          {MARITAL_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(formData.maritalStatus === "Married" ||
                      formData.maritalStatus === "Widowed") && (
                      <>
                        <div>
                          <Label htmlFor="spouseName">Spouse Name</Label>
                          <Input
                            id="spouseName"
                            name="spouseName"
                            value={formData.spouseName}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="numberOfChildren">
                            Number of Children
                          </Label>
                          <Input
                            id="numberOfChildren"
                            name="numberOfChildren"
                            type="number"
                            value={formData.numberOfChildren}
                            onChange={handleChange}
                            min="0"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="others">
                        Others (Educaltional Achievement/ Expertise/ Experience
                        etc)
                      </Label>
                      <Input
                        id="others"
                        name="others"
                        value={formData.others}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex justify-between gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="rounded-xl h-12 px-8 text-[15px] font-medium border-2 hover:bg-muted active:scale-95 transition-all"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="rounded-xl h-12 px-8 text-[15px] font-medium shadow-sm hover:shadow-md active:scale-95 transition-all"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Personal Information 4
                    </h2>

                    <div>
                      <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </Label>
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
                      <Label htmlFor="confirmPassword">
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
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
                        activities that will help achieve its objectives.{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                    </div>

                    <div className="flex justify-between gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="rounded-xl h-12 px-8 text-[15px] font-medium border-2 hover:bg-muted active:scale-95 transition-all"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-xl h-12 px-8 text-[15px] font-medium shadow-sm hover:shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading
                          ? "Creating Account..."
                          : "Complete Registration"}
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
