# 📧 Email OTP Setup Guide

## ✅ Fix Applied
The OTP service has been updated to use **real Gmail SMTP** instead of test emails.

## 🔧 Setup Instructions

### Step 1: Get Gmail App Password

1. **Go to your Google Account**: [https://myaccount.google.com](https://myaccount.google.com)
2. **Security** → **2-Step Verification** (enable if not already)
3. **Security** → **App passwords**
4. **Generate new app password**:
   - App: Mail
   - Device: Other (Custom name) → "InternNova"
5. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Edit `/home/khan/Downloads/Project/InterNova/server/.env`:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Replace:**
- `your-actual-email@gmail.com` → Your Gmail address
- `abcdefghijklmnop` → Your 16-char app password (no spaces)

### Step 3: Restart Server

```bash
cd server
npm start
```

## ✅ Testing

1. Try signing up with your real email
2. Check your inbox for OTP
3. OTP should arrive within seconds

## 🔍 Troubleshooting

**"Invalid credentials" error?**
- Make sure 2-Step Verification is enabled
- Use App Password, NOT your regular Gmail password
- Remove spaces from app password

**Not receiving emails?**
- Check spam folder
- Verify EMAIL_USER and EMAIL_PASS in .env
- Restart the server after changing .env

**Still having issues?**
- Check server console for error messages
- Ensure Gmail account allows "Less secure app access" (if using old account)

## 📝 Alternative: Using Other Email Services

### Outlook/Hotmail
```js
service: 'hotmail'
```

### Yahoo
```js
service: 'yahoo'
```

### Custom SMTP
```js
host: 'smtp.yourservice.com',
port: 587,
secure: false
```
