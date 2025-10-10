import type React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getAdminUser() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (roleError || !userData) {
      console.error("Error fetching user role:", roleError);
      return null;
    }

    if (
      typeof userData.role !== "string" ||
      userData.role.toUpperCase() !== "ADMIN"
    ) {
      return null;
    }

    return {
      ...session.user,
      role: userData.role,
    };
  } catch (error) {
    console.error("Error in getAdminUser:", error);
    return null;
  }
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAdminUser();

  console.log("user-->", user);

  if (!user) {
    // Redirect to login instead of showing 404
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
