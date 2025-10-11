import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email using Gmail SMTP
async function sendEmailOTP(email: string, otp: string, userName: string) {
  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
      },
    });

    const mailOptions = {
      from: `"CMAHS Alumni" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - CMAHS Alumni",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">CMAHS Alumni</h1>
              <p style="margin: 10px 0 0 0;">Password Reset Request</p>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>We received a request to reset your password. Use the OTP below to proceed:</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Never share this OTP with anyone</li>
                  <li>CMAHS Alumni staff will never ask for your OTP</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>

              <p>This OTP will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
              
              <p>Best regards,<br>CMAHS Alumni Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} CMAHS Alumni. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email OTP:", error);
    return { success: false, error: error };
  }
}

// Send OTP via SMS
// For free SMS, you'll need to integrate with services like:
// - Twilio (has free trial credits)
// - 2Factor.in (for India)
// - Fast2SMS (for India)
// - MSG91 (for India)
async function sendSMSOTP(phone: string, otp: string) {
  try {
    // Check which SMS service is configured
    const smsService = process.env.SMS_SERVICE || "none";

    switch (smsService.toLowerCase()) {
      case "twilio":
        return await sendTwilioSMS(phone, otp);
      case "2factor":
        return await send2FactorSMS(phone, otp);
      case "fast2sms":
        return await sendFast2SMS(phone, otp);
      case "msg91":
        return await sendMSG91SMS(phone, otp);
      default:
        console.log("No SMS service configured. SMS sending skipped.");
        return { success: false, error: "SMS service not configured" };
    }
  } catch (error) {
    console.error("Error sending SMS OTP:", error);
    return { success: false, error: error };
  }
}

// Twilio SMS implementation
async function sendTwilioSMS(phone: string, otp: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, error: "Twilio credentials not configured" };
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      },
      body: new URLSearchParams({
        To: phone,
        From: fromNumber,
        Body: `Your CMAHS Alumni password reset OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true };
}

// 2Factor.in SMS implementation (India)
async function send2FactorSMS(phone: string, otp: string) {
  const apiKey = process.env.TWOFACTOR_API_KEY;

  if (!apiKey) {
    return { success: false, error: "2Factor API key not configured" };
  }

  const response = await fetch(
    `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/OTP1`,
    {
      method: "GET",
    }
  );

  const result = await response.json();

  if (result.Status !== "Success") {
    return { success: false, error: result.Details };
  }

  return { success: true };
}

// Fast2SMS implementation (India)
async function sendFast2SMS(phone: string, otp: string) {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    return { success: false, error: "Fast2SMS API key not configured" };
  }

  const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "otp",
      variables_values: otp,
      flash: 0,
      numbers: phone,
    }),
  });

  const result = await response.json();

  if (!result.return) {
    return { success: false, error: result.message };
  }

  return { success: true };
}

// MSG91 SMS implementation (India)
async function sendMSG91SMS(phone: string, otp: string) {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  const senderId = process.env.MSG91_SENDER_ID || "CMAHS";

  if (!authKey || !templateId) {
    return { success: false, error: "MSG91 credentials not configured" };
  }

  const response = await fetch("https://api.msg91.com/api/v5/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authkey: authKey,
    },
    body: JSON.stringify({
      template_id: templateId,
      mobile: phone,
      authkey: authKey,
      otp: otp,
      sender: senderId,
    }),
  });

  const result = await response.json();

  if (result.type !== "success") {
    return { success: false, error: result.message };
  }

  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Determine if identifier is email or phone
    const isEmail = identifier.includes("@");
    let userData;

    if (isEmail) {
      // Look up user by email
      const { data, error } = await supabase
        .from("users")
        .select("id, email, phone, first_name, last_name")
        .eq("email", identifier)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "No account found with this email" },
          { status: 404 }
        );
      }
      userData = data;
    } else {
      // Look up user by phone
      const { data, error } = await supabase
        .from("users")
        .select("id, email, phone, first_name, last_name")
        .eq("phone", identifier)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "No account found with this email address" },
          { status: 404 }
        );
      }
      userData = data;
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const { error: otpError } = await supabase
      .from("password_reset_otps")
      .insert({
        user_id: userData.id,
        email: userData.email,
        phone: userData.phone,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        is_verified: false,
        attempts: 0,
      });

    if (otpError) {
      console.error("Error storing OTP:", otpError);
      return NextResponse.json(
        { error: "Failed to generate OTP" },
        { status: 500 }
      );
    }

    // Send OTP via email
    const emailResult = await sendEmailOTP(
      userData.email,
      otp,
      `${userData.first_name} ${userData.last_name}`
    );

    // Send OTP via SMS if phone number exists
    let smsResult = { success: false };
    if (userData.phone) {
      smsResult = await sendSMSOTP(userData.phone, otp);
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      channels: {
        email: emailResult.success,
        sms: smsResult.success,
      },
      email: userData.email,
      phone: userData.phone ? `******${userData.phone.slice(-4)}` : null,
    });
  } catch (error: any) {
    console.error("Error in OTP send:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
