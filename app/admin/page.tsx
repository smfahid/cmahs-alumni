import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabase } from "@/lib/supabase";
import { Users, ImageIcon, FileText, Calendar, Gift } from "lucide-react";

async function getDashboardStats() {
  const supabase = getSupabase();

  // Get total members count
  const { count: totalMembers, error: membersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "member");

  // Get total events count
  const { count: totalEvents, error: eventsError } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  // Get total news count
  const { count: totalNews } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true });

  // Get total gallery images count
  const { count: totalImages } = await supabase
    .from("gallery")
    .select("*", { count: "exact", head: true });

  const { data: donationData, error: donationError } = await supabase
    .from("donations")
    .select("amount");

  if (membersError)
    console.error("Error fetching total members:", membersError.message);
  if (eventsError)
    console.error("Error fetching upcoming events:", eventsError.message);
  if (donationError)
    console.error("Error fetching donations sum:", donationError.message);

  const totalDonationAmount =
    donationData?.reduce(
      (sum: number, donation: { amount: number }) =>
        sum + (donation.amount || 0),
      0
    ) || 0;

  return {
    totalMembers: totalMembers || 0,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="mt-8">
        <Card>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
