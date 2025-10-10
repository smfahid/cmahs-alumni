import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { identifier, otp } = await request.json();

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: "Email/phone and OTP are required" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Determine if identifier is email or phone
    const isEmail = identifier.includes("@");

    // Find the OTP record
    let otpQuery = supabase
      .from("password_reset_otps")
      .select("*")
      .eq("otp_code", otp)
      .eq("is_verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (isEmail) {
      otpQuery = otpQuery.eq("email", identifier);
    } else {
      otpQuery = otpQuery.eq("phone", identifier);
    }

    const { data: otpData, error: otpError } = await otpQuery.limit(1).single();

    if (otpError || !otpData) {
      // Check if OTP exists but is expired or already verified
      let expiredQuery = supabase
        .from("password_reset_otps")
        .select("*")
        .eq("otp_code", otp)
        .order("created_at", { ascending: false });

      if (isEmail) {
        expiredQuery = expiredQuery.eq("email", identifier);
      } else {
        expiredQuery = expiredQuery.eq("phone", identifier);
      }

      const { data: expiredOtp } = await expiredQuery.limit(1).single();

      if (expiredOtp) {
        if (expiredOtp.is_verified) {
          return NextResponse.json(
            { error: "OTP has already been used" },
            { status: 400 }
          );
        }
        if (new Date(expiredOtp.expires_at) < new Date()) {
          return NextResponse.json(
            { error: "OTP has expired. Please request a new one." },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpData.attempts >= otpData.max_attempts) {
      return NextResponse.json(
        {
          error:
            "Maximum verification attempts exceeded. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from("password_reset_otps")
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        attempts: otpData.attempts + 1,
      })
      .eq("id", otpData.id);

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      return NextResponse.json(
        { error: "Failed to verify OTP" },
        { status: 500 }
      );
    }

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("id", otpData.user_id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      resetToken: otpData.id, // Use OTP ID as reset token
      email: userData.email,
    });
  } catch (error: any) {
    console.error("Error in OTP verification:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
