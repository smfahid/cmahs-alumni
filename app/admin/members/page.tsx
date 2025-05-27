import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberApprovalButton } from "@/components/admin/member-approval-button";

async function getMembers() {
  const supabase = getSupabase();

  const { data: members } = await supabase
    .from("users")
    .select("*")
    .eq("role", "member")
    .order("created_at", { ascending: false });

  // Separate approved and pending members
  const approvedMembers = members?.filter((member) => member.is_approved) || [];
  const pendingMembers = members?.filter((member) => !member.is_approved) || [];

  return {
    approvedMembers,
    pendingMembers,
  };
}

export default async function AdminMembersPage() {
  const { approvedMembers, pendingMembers } = await getMembers();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Members</h1>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="pending">
            Pending Approval ({pendingMembers.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved Members ({approvedMembers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingMembers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No pending members to approve.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={
                            member.profile_image_url ||
                            "/placeholder.svg?height=48&width=48"
                          }
                          alt={`${member.first_name} ${member.last_name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {member.first_name} {member.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Batch:</span>{" "}
                        {member.batch || "N/A"}
                      </div>
                      <div>
                        <span className="text-gray-500">Blood Group:</span>{" "}
                        {member.blood_group || "N/A"}
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>{" "}
                        {member.location || "N/A"}
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>{" "}
                        {member.phone || "N/A"}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <Link href={`/admin/members/${member.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <MemberApprovalButton memberId={member.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedMembers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No approved members found.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={
                            member.profile_image_url ||
                            "/placeholder.svg?height=48&width=48"
                          }
                          alt={`${member.first_name} ${member.last_name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {member.first_name} {member.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Batch:</span>{" "}
                        {member.batch || "N/A"}
                      </div>
                      <div>
                        <span className="text-gray-500">Blood Group:</span>{" "}
                        {member.blood_group || "N/A"}
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>{" "}
                        {member.location || "N/A"}
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>{" "}
                        {member.phone || "N/A"}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link href={`/admin/members/${member.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
