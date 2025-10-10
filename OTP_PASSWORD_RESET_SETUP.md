# OTP-Based Password Reset Setup Guide

This guide will help you set up the OTP-based password reset system for the CMAHS Alumni application. The system sends OTPs to both email and phone numbers for password recovery.

## Table of Contents

1. [Database Setup](#database-setup)
2. [Email Configuration (Gmail SMTP - FREE)](#email-configuration)
3. [SMS Configuration (Choose One)](#sms-configuration)
4. [Environment Variables](#environment-variables)
5. [Testing the System](#testing-the-system)
6. [Troubleshooting](#troubleshooting)

---

## Database Setup

### Step 1: Run the SQL Migration

Execute the `OTP_SETUP.sql` file in your Supabase SQL editor:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `OTP_SETUP.sql`
4. Click "Run" to execute

This will create:

- `password_reset_otps` table
- Necessary indexes for performance
- Row Level Security (RLS) policies
- Cleanup function for expired OTPs

### Step 2: Set up a Cron Job (Optional but Recommended)

To automatically clean up expired OTPs, set up a PostgreSQL cron job:

```sql
-- Enable pg_cron extension (one-time setup)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup to run every hour
SELECT cron.schedule(
  'cleanup-expired-otps',
  '0 * * * *', -- Every hour at minute 0
  $$SELECT cleanup_expired_otps()$$
);
```

Or you can manually run the cleanup:

```sql
SELECT cleanup_expired_otps();
```

---

## Email Configuration (Gmail SMTP - FREE)

### Why Gmail SMTP?

- **100% FREE** for sending emails
- Reliable and fast delivery
- No credit card required
- Easy to set up

### Setup Instructions:

#### Step 1: Create or Use a Gmail Account

Use your existing Gmail account or create a new one specifically for the app.

#### Step 2: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"

#### Step 3: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "CMAHS Alumni" as the name
4. Click "Generate"
5. **Copy the 16-character password** (you won't see it again!)

#### Step 4: Add to Environment Variables

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### Email Sending Limits:

- **Gmail Free Account**: 500 emails per day
- **Google Workspace**: 2,000 emails per day

This is more than sufficient for most alumni associations!

---

## SMS Configuration (Choose One)

### Option 1: Twilio (Recommended - Has Free Trial)

**Pros:**

- $15.50 free trial credit
- Global coverage
- Reliable delivery
- Easy to use API

**Cons:**

- Paid service after trial credits
- ~$0.0075 per SMS (very cheap)

**Setup:**

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get your Account SID, Auth Token, and Phone Number from the console
3. Add to environment variables:

```env
SMS_SERVICE=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

---

### Option 2: 2Factor.in (India - Free Trial)

**Pros:**

- Free trial with 100 SMS
- Good for India
- Simple API

**Cons:**

- Limited to India
- Paid after trial

**Setup:**

1. Sign up at [2Factor.in](https://2factor.in/)
2. Get your API key
3. Add to environment variables:

```env
SMS_SERVICE=2factor
TWOFACTOR_API_KEY=your_api_key
```

---

### Option 3: Fast2SMS (India Only)

**Pros:**

- Free credits on signup
- India-focused
- Promotional credits available

**Cons:**

- India only
- Varying reliability

**Setup:**

1. Sign up at [Fast2SMS](https://www.fast2sms.com/)
2. Get your API key from the dashboard
3. Add to environment variables:

```env
SMS_SERVICE=fast2sms
FAST2SMS_API_KEY=your_api_key
```

---

### Option 4: MSG91 (India - Free Trial)

**Pros:**

- 100 free SMS on signup
- Good for India
- OTP template support

**Cons:**

- Requires template setup
- Paid after trial

**Setup:**

1. Sign up at [MSG91](https://msg91.com/)
2. Create an OTP template in the dashboard
3. Get your Auth Key, Template ID, and Sender ID
4. Add to environment variables:

```env
SMS_SERVICE=msg91
MSG91_AUTH_KEY=your_auth_key
MSG91_TEMPLATE_ID=your_template_id
MSG91_SENDER_ID=CMAHS
```

---

### Option 5: No SMS (Email Only)

If you want to use email-only verification:

```env
SMS_SERVICE=none
```

The system will still work, but OTPs will only be sent via email.

---

## Environment Variables

Create or update your `.env.local` file with these variables:

```env
# Required: Email Configuration (FREE)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Optional: SMS Configuration (Choose one service or use 'none')
SMS_SERVICE=twilio  # Options: twilio, 2factor, fast2sms, msg91, none

# If using Twilio:
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# If using 2Factor.in:
TWOFACTOR_API_KEY=your_api_key

# If using Fast2SMS:
FAST2SMS_API_KEY=your_api_key

# If using MSG91:
MSG91_AUTH_KEY=your_auth_key
MSG91_TEMPLATE_ID=your_template_id
MSG91_SENDER_ID=CMAHS

# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Install Required Dependencies

The system uses `nodemailer` for email sending. Install it:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

---

## Testing the System

### Test 1: Send OTP

1. Go to `/forgot-password`
2. Enter your email or phone number
3. Click "Send OTP"
4. Check your email inbox (and spam folder)
5. Check your phone for SMS (if configured)

### Test 2: Verify OTP

1. You'll be redirected to `/reset-password`
2. Enter the 6-digit OTP from your email/SMS
3. Click "Verify OTP"

### Test 3: Reset Password

1. After OTP verification, enter your new password
2. Confirm the password
3. Click "Reset Password"
4. Try logging in with the new password

---

## Security Features

### ✅ Built-in Security:

1. **OTP Expiration**: OTPs expire after 10 minutes
2. **Rate Limiting**: Maximum 5 verification attempts per OTP
3. **One-Time Use**: Each OTP can only be used once
4. **Secure Storage**: OTPs are stored securely in the database
5. **Automatic Cleanup**: Expired OTPs are automatically deleted

### ⚠️ Additional Recommendations:

1. **Rate Limiting**: Consider adding rate limiting on the API endpoints to prevent abuse
2. **IP Blocking**: Block IPs that make too many requests
3. **Logging**: Log all OTP requests for security monitoring
4. **Notification**: Send alerts for suspicious activities

---

## Troubleshooting

### Email Not Sending

**Problem**: OTP email not received

**Solutions**:

1. Check spam/junk folder
2. Verify Gmail credentials in `.env.local`
3. Ensure 2FA is enabled on Gmail account
4. Check if App Password is correct (16 characters, no spaces)
5. Check server logs for error messages

### SMS Not Sending

**Problem**: OTP SMS not received

**Solutions**:

1. Verify SMS service credentials
2. Check if `SMS_SERVICE` is set correctly
3. Ensure phone number is in correct format (with country code)
4. Check SMS service account balance/credits
5. Verify phone number is stored in user's profile

### OTP Verification Failing

**Problem**: Valid OTP shows as invalid

**Solutions**:

1. Check if OTP has expired (10-minute limit)
2. Ensure you're using the most recent OTP
3. Verify the identifier (email/phone) matches what you entered
4. Check if maximum attempts (5) exceeded
5. Request a new OTP

### Database Errors

**Problem**: Database insertion/query errors

**Solutions**:

1. Verify `OTP_SETUP.sql` was executed successfully
2. Check RLS policies are properly configured
3. Ensure service role key is in environment variables
4. Check Supabase logs for detailed errors

---

## Cost Breakdown

### Completely FREE Setup:

- **Email (Gmail)**: FREE ✅
- **Database (Supabase)**: FREE tier available ✅
- **Hosting**: Vercel free tier ✅
- **Total**: $0/month

### With SMS (Recommended):

- **Email**: FREE ✅
- **SMS (Twilio)**: ~$0.0075 per SMS
  - 100 password resets/month = ~$0.75
  - 500 password resets/month = ~$3.75
- **Total**: < $5/month for most organizations

### Best Free Option:

Use **Email-only** OTP verification (set `SMS_SERVICE=none`) for a completely free solution!

---

## Flow Diagram

```
User Forgot Password
        ↓
Enter Email/Phone → Click "Send OTP"
        ↓
API: /api/auth/otp/send
        ↓
Generate 6-digit OTP
        ↓
Store in database (expires in 10 min)
        ↓
Send Email (Gmail SMTP) ──→ User's Inbox
        ↓
Send SMS (if configured) ──→ User's Phone
        ↓
User receives OTP
        ↓
Enter OTP → Click "Verify OTP"
        ↓
API: /api/auth/otp/verify
        ↓
Check OTP validity (not expired, not used, attempts < 5)
        ↓
Mark OTP as verified
        ↓
Enter New Password → Click "Reset Password"
        ↓
API: /api/auth/otp/reset-password
        ↓
Update password in Supabase Auth
        ↓
Delete used OTP
        ↓
Redirect to Login
```

---

## Support

If you encounter any issues:

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test each component separately (email, SMS, database)
4. Review Supabase logs for API errors

---

## API Endpoints

### POST `/api/auth/otp/send`

Send OTP to user's email and phone

**Request:**

```json
{
  "identifier": "user@example.com" // or phone number
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "channels": {
    "email": true,
    "sms": true
  },
  "email": "user@example.com",
  "phone": "******1234"
}
```

### POST `/api/auth/otp/verify`

Verify the OTP code

**Request:**

```json
{
  "identifier": "user@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "resetToken": "uuid-here",
  "email": "user@example.com"
}
```

### POST `/api/auth/otp/reset-password`

Reset password with verified token

**Request:**

```json
{
  "resetToken": "uuid-from-verify-step",
  "newPassword": "newSecurePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

---

## Next Steps

1. ✅ Run the database migration (`OTP_SETUP.sql`)
2. ✅ Set up Gmail SMTP (completely free!)
3. ✅ (Optional) Choose and configure an SMS service
4. ✅ Add environment variables to `.env.local`
5. ✅ Install nodemailer: `npm install nodemailer`
6. ✅ Test the forgot password flow
7. ✅ Monitor logs for any issues
8. 🎉 Enjoy your secure OTP-based password reset!

---

**Created for CMAHS Alumni**
_Last Updated: October 2025_
