import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, PlusCircle, Gift } from "lucide-react";
import { DeleteDonationButton } from "./DeleteDonationButton"; // We'll create this next
import { format } from "date-fns";

export const revalidate = 0; // Or 'force-dynamic'

interface Donation {
  id: string;
  created_at: string;
  name: string;
  image_url?: string | null;
  amount: number;
  mobile_no?: string | null;
  email?: string | null;
  batch?: string | null;
  medium?: string | null;
  medium_tracker_code?: string | null;
}

async function getDonations(): Promise<Donation[]> {
  const supabase = getSupabase(); // Use your server-side Supabase client
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
  return data as Donation[];
}

export default async function AdminDonationsPage() {
  const donations = await getDonations();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Gift className="h-8 w-8 mr-2" /> Donations
        </h1>
        <Link href="/admin/donations/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Donation
          </Button>
        </Link>
      </div>

      {donations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No donations found. Add your first donation to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.id}>
              <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                {donation.image_url ? (
                  <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={donation.image_url}
                      alt={donation.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Gift className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{donation.name}</h3>
                  <p className="text-xl font-bold text-primary">
                    Amount: {donation.amount.toLocaleString()} tk
                  </p>
                  <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                    {donation.email && <p>Email: {donation.email}</p>}
                    {donation.mobile_no && <p>Mobile: {donation.mobile_no}</p>}
                    {donation.batch && <p>Batch: {donation.batch}</p>}
                    {donation.medium && (
                      <p>
                        Medium: {donation.medium}
                        {donation.medium_tracker_code
                          ? ` (ID: ${donation.medium_tracker_code})`
                          : ""}
                      </p>
                    )}
                    <p>
                      Date: {format(new Date(donation.created_at), "PPP p")}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0 flex-shrink-0 self-start md:self-center">
                  <Link href={`/admin/donations/edit/${donation.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <DeleteDonationButton
                    donationId={donation.id}
                    imageUrl={donation.image_url}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
