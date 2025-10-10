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

    // Get user profile data (role, name, and image)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, first_name, last_name, profile_image_url")
      .eq("id", session.user.id)
      .single();

    if (userError) {
      console.error("User data fetch error:", userError);
      // Don't fail the request if user fetch fails, just use basic data
    }

    const isAdmin = userData?.role?.toString().toUpperCase() === "ADMIN";

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        phone: session.user.phone,
        created_at: session.user.created_at,
        first_name: userData?.first_name || null,
        last_name: userData?.last_name || null,
        profile_image_url: userData?.profile_image_url || null,
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
