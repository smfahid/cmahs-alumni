import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

type MemberDetailsPageProps = {
  params: {
    id: string;
  };
};

async function getMemberById(memberId: string) {
  const supabase = getSupabase();
  const { data: member, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", memberId)
    .single();

  if (error || !member) {
    return null;
  }
  return member;
}

export default async function MemberDetailsPage({
  params,
}: MemberDetailsPageProps) {
  const member = await getMemberById(params.id);

  if (!member) {
    notFound(); // Or display a "Member not found" message
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/admin/members">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members List
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative h-32 w-32 rounded-full overflow-hidden">
              <Image
                src={
                  member.profile_image_url ||
                  "/placeholder.svg?height=128&width=128"
                }
                alt={`${member.first_name} ${member.last_name}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {member.first_name} {member.last_name}
              </CardTitle>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Role:</span>{" "}
              {member.role || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>{" "}
              {member.is_approved ? "Approved" : "Pending Approval"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Batch:</span>{" "}
              {member.batch || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Blood Group:</span>{" "}
              {member.blood_group || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Location:</span>{" "}
              {member.location || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Phone:</span>{" "}
              {member.phone || "N/A"}
            </div>

            <div className="md:col-span-2 mt-4 mb-2 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Personal Details
              </h3>
            </div>
            <div>
              <span className="font-medium text-gray-600">Father's Name:</span>{" "}
              {member.father_name || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Mother's Name:</span>{" "}
              {member.mother_name || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Marital Status:</span>{" "}
              {member.marital_status || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Spouse's Name:</span>{" "}
              {member.spouse_name || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Number of Children:
              </span>{" "}
              {member.number_of_children ?? "N/A"}
            </div>

            <div className="md:col-span-2 mt-4 mb-2 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Educational & Professional
              </h3>
            </div>
            <div>
              <span className="font-medium text-gray-600">Institution:</span>{" "}
              {member.institution || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Batch (HSC):</span>{" "}
              {member.batch_hsc || "N/A"}
            </div>
            {member.group && (
              <div>
                <span className="font-medium text-gray-600">Group:</span>{" "}
                {member.group}
              </div>
            )}
            <div>
              <span className="font-medium text-gray-600">Designation:</span>{" "}
              {member.designation || "N/A"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Profession:</span>{" "}
              {member.profession || "N/A"}
            </div>

            <div className="md:col-span-2 mt-4 mb-2 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Current Address
              </h3>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">
                  Address Line 1:
                </span>{" "}
                {member.address_line1 || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Address Line 2:
                </span>{" "}
                {member.address_line2 || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">City:</span>{" "}
                {member.city || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">District:</span>{" "}
                {member.district || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">Postcode:</span>{" "}
                {member.postcode || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">Country:</span>{" "}
                {member.country || "N/A"}
              </div>
            </div>

            <div className="md:col-span-2 mt-4 mb-2 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Permanent Address
              </h3>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">
                  Address Line 1:
                </span>{" "}
                {member.permanent_address_line1 || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Address Line 2:
                </span>{" "}
                {member.permanent_address_line2 || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">City:</span>{" "}
                {member.permanent_city || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">District:</span>{" "}
                {member.permanent_district || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">Postcode:</span>{" "}
                {member.permanent_postcode || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">Country:</span>{" "}
                {member.permanent_country || "N/A"}
              </div>
            </div>

            <div className="md:col-span-2 mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Professional Info
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap">
                {member.professional_info || "N/A"}
              </p>
            </div>

            <div className="md:col-span-2 mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Joined:</span>{" "}
                {member.created_at
                  ? new Date(member.created_at).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-600">Last Updated:</span>{" "}
                {member.updated_at
                  ? new Date(member.updated_at).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
            {/* Add any other fields you want to display */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
