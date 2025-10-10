import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Global sign out to revoke refresh tokens and remove session everywhere
    const { error } = await supabase.auth.signOut({
      scope: "global",
    });

    if (error) {
      console.error("Logout API error:", error);
      return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Logout successful",
    });
  } catch (error: any) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
