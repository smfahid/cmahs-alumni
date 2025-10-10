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

    if (sessionError || !session?.user) {
      return NextResponse.json({
        authenticated: false,
        error: sessionError?.message || "No session found",
      });
    }

    // Get user role
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const isAdmin = userData?.role?.toString().toUpperCase() === "ADMIN";

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: userData?.role || "No role found",
        isAdmin,
      },
      roleError: roleError?.message || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
