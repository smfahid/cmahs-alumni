import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabase } from "@/lib/supabase";
import {
  Users,
  ImageIcon,
  FileText,
  Calendar,
  UserCheck,
  UserX,
  Gift,
} from "lucide-react";

async function getDashboardStats() {
  const supabase = getSupabase();

  // Get total members count
  const { count: totalMembers, error: membersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "member");

  // Get pending members count
  const { count: pendingMembers, error: pendingError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "member")
    .eq("is_approved", false);

  // Get total events count
  const { count: totalEvents, error: eventsError } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  // Get total news count
  const { count: totalNews, error: newsError } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true });

  // Get total gallery images count
  const { count: totalImages, error: imagesError } = await supabase
    .from("gallery")
    .select("*", { count: "exact", head: true });

  const { data: donationData, error: donationError } = await supabase
    .from("donations")
    .select("amount");

  if (membersError)
    console.error("Error fetching total members:", membersError.message);
  if (pendingError)
    console.error("Error fetching pending members:", pendingError.message);
  if (eventsError)
    console.error("Error fetching upcoming events:", eventsError.message);
  if (donationError)
    console.error("Error fetching donations sum:", donationError.message);

  const totalDonationAmount =
    donationData?.reduce((sum, donation) => sum + (donation.amount || 0), 0) ||
    0;

  return {
    totalMembers: totalMembers || 0,
    pendingMembers: pendingMembers || 0,
    approvedMembers: (totalMembers || 0) - (pendingMembers || 0),
    totalEvents: totalEvents || 0,
    totalNews: totalNews || 0,
    totalImages: totalImages || 0,
    totalDonationAmount: totalDonationAmount || 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-gray-500">All registered members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Members
            </CardTitle>
            <UserCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedMembers}</div>
            <p className="text-xs text-gray-500">
              Members with approved status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <UserX className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingMembers}</div>
            <p className="text-xs text-gray-500">
              Members waiting for approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-gray-500">Events created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total News</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNews}</div>
            <p className="text-xs text-gray-500">News articles published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Gallery Images
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImages}</div>
            <p className="text-xs text-gray-500">Images in gallery</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Member Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {/* This would typically be a table or list of recent members */}
            <p className="text-gray-500">
              View all members in the Members section
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {/* This would typically be a list of upcoming events */}
            <p className="text-gray-500">
              View all events in the Events section
            </p>
          </CardContent>
        </Card>
        <Card>
          {" "}
          {/* New Donation Stats Card */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <Gift className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalDonationAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              tk
            </div>
            {/* <p className="text-xs text-muted-foreground">Across all campaigns</p> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
