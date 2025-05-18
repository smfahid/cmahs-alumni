import type React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";

async function getUser() {
  const cookieStore = cookies();
  const supabase = getSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!userData || userData.role !== "admin") {
    return null;
  }

  return {
    ...session.user,
    role: userData.role,
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // if (!user) {
  //   redirect("/login")
  // }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
