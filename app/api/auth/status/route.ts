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
      return NextResponse.json({
        user: null,
        session: null,
        isAdmin: false,
        isAuthenticated: false,
      });
    }

    // Get user role to determine admin status
    const { data: roleData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (roleError) {
      console.error("Role fetch error:", roleError);
      // Don't fail the request if role fetch fails, just set isAdmin to false
    }

    const isAdmin = roleData?.role?.toString().toUpperCase() === "ADMIN";

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        phone: session.user.phone,
        created_at: session.user.created_at,
      },
      session: session,
      isAdmin,
      isAuthenticated: true,
    });
  } catch (error: any) {
    console.error("Auth status API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
