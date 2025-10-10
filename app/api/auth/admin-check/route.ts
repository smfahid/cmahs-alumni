import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.json(
        { error: "Failed to get session" },
        { status: 500 }
      );
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user role to determine admin status
    const { data: roleData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (roleError) {
      console.error("Role fetch error:", roleError);
      return NextResponse.json(
        { error: "Failed to fetch user role" },
        { status: 500 }
      );
    }

    const isAdmin = roleData?.role?.toString().toUpperCase() === "ADMIN";

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: roleData.role,
      },
    });
  } catch (error: any) {
    console.error("Admin check API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
