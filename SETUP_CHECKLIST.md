# 🔐 OTP Password Reset - Setup Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Setup (Already Done ✅)

- [x] Database migration file created (`OTP_SETUP.sql`)
- [x] API endpoints implemented
  - [x] `/api/auth/otp/send` - Send OTP
  - [x] `/api/auth/otp/verify` - Verify OTP
  - [x] `/api/auth/otp/reset-password` - Reset password
- [x] Frontend pages updated
  - [x] `/forgot-password` - Request OTP page
  - [x] `/reset-password` - Verify & reset page
- [x] Email template created (professional HTML)
- [x] SMS integrations implemented (4 providers)
- [x] Documentation written

## ✅ What You Need To Do

### 1. Database Setup

- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Copy entire content from `OTP_SETUP.sql`
- [ ] Paste and click "Run"
- [ ] Verify table `password_reset_otps` is created
- [ ] Check that RLS policies are active

**Verification:**

```sql
-- Run this to check if table exists
SELECT * FROM password_reset_otps LIMIT 1;
```

---

### 2. Gmail SMTP Configuration (FREE)

#### Step 2.1: Enable 2-Factor Authentication

- [ ] Go to https://myaccount.google.com/security
- [ ] Click "2-Step Verification"
- [ ] Follow the setup wizard
- [ ] Verify 2FA is active

#### Step 2.2: Create App Password

- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select "Mail" from first dropdown
- [ ] Select "Other (Custom name)" from second dropdown
- [ ] Type "CMAHS Alumni"
- [ ] Click "Generate"
- [ ] Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)
- [ ] Save it securely (you won't see it again!)

#### Step 2.3: Add to Environment Variables

- [ ] Open/create `.env.local` in project root
- [ ] Add these lines:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

- [ ] Replace with your actual email and app password
- [ ] Remove any spaces from app password

**Verification:**
Check that `.env.local` has both variables set correctly.

---

### 3. SMS Configuration (Optional)

**Choose ONE option or skip SMS entirely:**

#### Option A: No SMS (Recommended to Start)

- [ ] Add to `.env.local`:

```env
SMS_SERVICE=none
```

#### Option B: Twilio (Best for Production)

- [ ] Sign up at https://www.twilio.com/try-twilio
- [ ] Get $15.50 free trial credits
- [ ] Copy Account SID from dashboard
- [ ] Copy Auth Token from dashboard
- [ ] Get a phone number from Twilio
- [ ] Add to `.env.local`:

```env
SMS_SERVICE=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Option C: 2Factor.in (India Only)

- [ ] Sign up at https://2factor.in/
- [ ] Get 100 free SMS credits
- [ ] Copy API key from dashboard
- [ ] Add to `.env.local`:

```env
SMS_SERVICE=2factor
TWOFACTOR_API_KEY=your_api_key
```

#### Option D: Fast2SMS (India Only)

- [ ] Sign up at https://www.fast2sms.com/
- [ ] Get API key from dashboard
- [ ] Add to `.env.local`:

```env
SMS_SERVICE=fast2sms
FAST2SMS_API_KEY=your_api_key
```

#### Option E: MSG91 (India Only)

- [ ] Sign up at https://msg91.com/
- [ ] Get 100 free SMS credits
- [ ] Create an OTP template
- [ ] Get Auth Key, Template ID
- [ ] Add to `.env.local`:

```env
SMS_SERVICE=msg91
MSG91_AUTH_KEY=your_auth_key
MSG91_TEMPLATE_ID=your_template_id
MSG91_SENDER_ID=CMAHS
```

---

### 4. Install Dependencies

- [ ] Open terminal in project directory
- [ ] Run: `npm install nodemailer`
- [ ] Run: `npm install --save-dev @types/nodemailer`
- [ ] Verify in `package.json` that nodemailer is listed

**Verification:**

```bash
npm list nodemailer
# Should show: nodemailer@6.9.7
```

---

### 5. Environment Variables Check

Your `.env.local` should have AT MINIMUM:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Gmail SMTP (NEW - REQUIRED)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# SMS (NEW - OPTIONAL)
SMS_SERVICE=none
```

- [ ] All Supabase variables are set
- [ ] `GMAIL_USER` is set
- [ ] `GMAIL_APP_PASSWORD` is set (16 characters, no spaces)
- [ ] `SMS_SERVICE` is set (even if "none")

---

### 6. Test the System

#### Test 1: Send OTP

- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000/forgot-password
- [ ] Enter your email address
- [ ] Click "Send OTP"
- [ ] Verify success message appears
- [ ] Check your email inbox (and spam folder)
- [ ] Confirm OTP email received

#### Test 2: Verify OTP

- [ ] After sending OTP, you'll be redirected automatically
- [ ] OR go to http://localhost:3000/reset-password
- [ ] Enter your email
- [ ] Enter the 6-digit OTP from email
- [ ] Click "Verify OTP"
- [ ] Verify success message and move to next step

#### Test 3: Reset Password

- [ ] After OTP verification
- [ ] Enter new password (min 6 characters)
- [ ] Confirm new password
- [ ] Click "Reset Password"
- [ ] Verify success message
- [ ] Wait for auto-redirect to login

#### Test 4: Login with New Password

- [ ] Go to http://localhost:3000/login
- [ ] Enter your email
- [ ] Enter the NEW password you just set
- [ ] Click "Sign In"
- [ ] Verify successful login

---

### 7. Optional: Set Up Cron Job for Cleanup

In Supabase SQL Editor:

- [ ] Enable pg_cron extension:

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

- [ ] Schedule cleanup job:

```sql
SELECT cron.schedule(
  'cleanup-expired-otps',
  '0 * * * *',
  $$SELECT cleanup_expired_otps()$$
);
```

- [ ] Verify cron job is created:

```sql
SELECT * FROM cron.job;
```

**Alternative:** Manually clean up periodically:

```sql
SELECT cleanup_expired_otps();
```

---

## 🔍 Verification Checklist

Run through this to make sure everything works:

### Database

- [ ] Table `password_reset_otps` exists
- [ ] RLS policies are enabled
- [ ] Cleanup function works

### Email

- [ ] Test email sent successfully
- [ ] Email arrives within 5 seconds
- [ ] OTP is visible in email
- [ ] Email formatting looks good

### SMS (if configured)

- [ ] Test SMS sent successfully
- [ ] SMS arrives within 15 seconds
- [ ] OTP is correct in SMS

### Frontend

- [ ] Forgot password page loads
- [ ] Can enter email/phone
- [ ] Success message shows
- [ ] Redirect to verification works
- [ ] OTP input works (6 digits only)
- [ ] Can resend OTP
- [ ] Password reset works
- [ ] Redirect to login works

### Security

- [ ] OTPs expire after 10 minutes
- [ ] Max 5 attempts enforced
- [ ] Used OTPs can't be reused
- [ ] Invalid OTPs show error

---

## 🐛 Troubleshooting

### Email not sending?

- [ ] Check `.env.local` has `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- [ ] Verify 2FA is enabled on Gmail
- [ ] App password is 16 characters with no spaces
- [ ] Check spam folder
- [ ] Check server console for errors

### SMS not sending?

- [ ] Verify `SMS_SERVICE` is set correctly
- [ ] Check provider credentials
- [ ] Verify account has credits/balance
- [ ] Phone number includes country code
- [ ] Check server console for errors

### Database errors?

- [ ] Run `OTP_SETUP.sql` again
- [ ] Check Supabase connection
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] Check RLS policies are active

### Build errors?

- [ ] Run `npm install` again
- [ ] Check `package.json` has nodemailer
- [ ] Clear `.next` folder and rebuild
- [ ] Check for TypeScript errors

---

## 📊 Success Criteria

You know it's working when:

✅ Email OTP arrives within 5 seconds
✅ OTP code is 6 digits
✅ Can verify OTP successfully
✅ Can reset password
✅ Can login with new password
✅ Used OTPs can't be reused
✅ Expired OTPs show error
✅ Beautiful email template displays correctly

---

## 🎯 Recommended Next Steps

After basic setup works:

1. **Add Rate Limiting**

   - Limit OTP requests per IP
   - Prevent brute force attacks

2. **Set Up Monitoring**

   - Track email delivery rates
   - Monitor SMS costs
   - Log failed attempts

3. **Add Analytics**

   - Count OTP requests
   - Track success rates
   - Monitor user flow

4. **Security Enhancements**

   - Add CAPTCHA on forgot password
   - IP blocking for abuse
   - Email alerts for admins

5. **User Experience**
   - Auto-fill OTP from SMS (mobile)
   - Better error messages
   - Loading states
   - Success animations

---

## 📚 Documentation Reference

| Need Help With    | Read This                                                        | Time   |
| ----------------- | ---------------------------------------------------------------- | ------ |
| Quick setup       | [QUICK_START_OTP.md](./QUICK_START_OTP.md)                       | 5 min  |
| Detailed guide    | [OTP_PASSWORD_RESET_SETUP.md](./OTP_PASSWORD_RESET_SETUP.md)     | 20 min |
| Overview          | [README_OTP.md](./README_OTP.md)                                 | 10 min |
| Technical details | [OTP_IMPLEMENTATION_SUMMARY.md](./OTP_IMPLEMENTATION_SUMMARY.md) | 15 min |

---

## ✅ Final Checklist

Before going to production:

- [ ] Database migration completed
- [ ] Gmail SMTP configured and tested
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] All tests passed
- [ ] Email template looks good
- [ ] SMS working (if configured)
- [ ] Cron job set up (optional)
- [ ] Security features verified
- [ ] Documentation reviewed
- [ ] Team trained on the system
- [ ] Backup plan in place

---

## 🎉 You're Done!

Once all checkboxes are ticked, your OTP password reset system is:

- ✅ Fully functional
- ✅ Secure
- ✅ Production-ready
- ✅ Cost-effective

**Congratulations! 🚀**

---

**Questions?** Check the detailed documentation or review the troubleshooting guides.

**Ready to launch?** Make sure all items above are checked!

---

Last Updated: October 2025
Status: Ready for Production ✅
