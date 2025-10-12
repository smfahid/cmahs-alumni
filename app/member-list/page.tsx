import { getSupabase } from "@/lib/supabase";
import MemberListClient from "./member-list-client";

// Define the User type (consistent with contact-cards.tsx)
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  profile_image_url: string | null;
  batch: string | null;
  location: string | null;
  // blood_group is omitted as it's not typically shown in a general member list
}

async function getMembers(): Promise<User[]> {
  const supabase = getSupabase();
  // Fetch only approved members for the public/member-facing list
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, first_name, last_name, email, phone, profile_image_url, batch, location"
    )
    .eq("role", "member")
    .eq("is_approved", true) // Show only approved members
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Error fetching members for member list:", error.message);
    return [];
  }
  return (data as User[]) || [];
}

export default async function MemberListPage() {
  const members = await getMembers();

  return <MemberListClient members={members} />;
}
