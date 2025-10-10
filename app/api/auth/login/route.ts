import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/mobile and password are required" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    let emailToAuth = identifier;

    // Check if the identifier is likely a phone number (e.g., doesn't contain '@')
    if (!identifier.includes("@")) {
      // Assume it's a phone number, try to get email from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("phone", identifier)
        .single();

      if (userError || !userData?.email) {
        return NextResponse.json(
          { error: "Invalid login credentials" },
          { status: 401 }
        );
      }
      emailToAuth = userData.email;
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToAuth,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Invalid login credentials" },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    // Get user role to determine admin status
    const { data: roleData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const isAdmin = roleData?.role?.toString().toUpperCase() === "ADMIN";

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        phone: data.user.phone,
        created_at: data.user.created_at,
      },
      session: data.session,
      isAdmin,
      message: "Login successful",
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
