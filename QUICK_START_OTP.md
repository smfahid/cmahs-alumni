# Quick Start Guide - OTP Password Reset

Get your OTP-based password reset system running in 15 minutes!

## ⚡ Quick Setup (3 Steps)

### Step 1: Database Setup (5 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire content from `OTP_SETUP.sql`
3. Click "Run"
4. ✅ Done! Your database is ready.

### Step 2: Email Setup - Gmail SMTP (5 minutes - FREE)

1. **Enable 2FA on Gmail**

   - Go to: https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. **Create App Password**

   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other" → Enter "CMAHS Alumni"
   - Click "Generate"
   - Copy the 16-character password

3. **Add to .env.local**
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
   ```

### Step 3: Install & Run (5 minutes)

```bash
# Install nodemailer
npm install nodemailer
npm install --save-dev @types/nodemailer

# Start the app
npm run dev
```

## 🎉 That's It!

Your OTP system is now working with:

- ✅ Email OTP (FREE via Gmail)
- ✅ 10-minute OTP expiration
- ✅ Secure password reset

**Test it now:**

1. Go to: http://localhost:3000/forgot-password
2. Enter your email
3. Check your inbox for the OTP
4. Complete the password reset!

---

## 📱 Optional: Add SMS (5 more minutes)

If you want SMS OTP as well:

### For Free Trial SMS:

**Twilio** (Best option - $15.50 free credit):

```env
SMS_SERVICE=twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

**For India Only:**

```env
SMS_SERVICE=2factor
TWOFACTOR_API_KEY=your_key
```

**Don't want SMS?**

```env
SMS_SERVICE=none
```

---

## 🚨 Troubleshooting

### Email not sending?

1. Check spam folder
2. Verify Gmail credentials
3. Make sure 2FA is enabled
4. Use App Password (not your regular password)

### "Missing environment variable" error?

Create `.env.local` file in project root with:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
SMS_SERVICE=none
```

---

## 📚 Need More Details?

See `OTP_PASSWORD_RESET_SETUP.md` for:

- Different SMS providers
- Security best practices
- API documentation
- Advanced configuration

---

## 🎯 What Works Now

✅ User enters email/phone on forgot password page
✅ System sends 6-digit OTP to email (and SMS if configured)
✅ Beautiful email template with security warnings
✅ OTP expires after 10 minutes
✅ Max 5 verification attempts
✅ Secure password reset after OTP verification
✅ Automatic redirect to login after success

---

## 💰 Cost

**Email-only setup**: $0/month (100% FREE)
**With SMS (optional)**: ~$1-5/month depending on usage

---

**You're all set! 🚀**

Questions? Check the detailed guide in `OTP_PASSWORD_RESET_SETUP.md`
