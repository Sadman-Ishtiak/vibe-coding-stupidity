# 🧪 OTP System - Quick Testing Guide

## 🚀 Quick Start

### 1. Start the Application

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

---

## ✅ Test Scenarios

### Scenario 1: New Candidate Sign Up with OTP
1. Navigate to `/sign-up`
2. Fill in the form:
   - Username: `john_doe`
   - Email: `john@example.com`
   - Password: `Password123`
   - Account Type: **Candidate**
3. Click **Sign Up**
4. **Check terminal** - you'll see the OTP in console logs
5. Enter the 6-digit OTP in the input fields
6. Click **Verify OTP**
7. Redirected to `/sign-in` with success message
8. Login with the same credentials → Success!

---

### Scenario 2: New Company Sign Up with OTP
1. Navigate to `/sign-up`
2. Fill in the form:
   - Username: `Tech Corp`
   - Email: `recruiter@techcorp.com`
   - Password: `SecurePass123`
   - Account Type: **Company/Recruiter**
3. Click **Sign Up**
4. **Check terminal** for OTP
5. Enter OTP → Verify
6. Login as company → Success!

---

### Scenario 3: Login with Unverified Email
1. Create a new account (Steps 1-3 from Scenario 1)
2. **DO NOT verify OTP** - close the page
3. Try to login at `/sign-in` with the credentials
4. You'll see error: "Email not verified"
5. **OTP is automatically resent**
6. Redirected to `/verify-email`
7. **Check terminal** for new OTP
8. Enter OTP → Verify
9. Try login again → Success!

---

### Scenario 4: Password Reset Flow
1. Navigate to `/reset-password`
2. Enter email: `john@example.com`
3. Click **Send Request**
4. **Check terminal** for OTP
5. Redirected to `/verify-email`
6. Enter the 6-digit OTP
7. Click **Verify OTP**
8. Redirected to `/new-password`
9. Enter new password: `NewPassword123`
10. Confirm password
11. Click **Reset Password**
12. **Auto-login** → Redirected to home

---

### Scenario 5: OTP Resend Feature
1. Start any OTP flow (signup or reset)
2. On OTP verification page, wait for 60 seconds
3. **Resend OTP** button becomes active
4. Click **Resend OTP**
5. **Check terminal** for new OTP
6. Old OTP is invalidated
7. Enter new OTP → Verify

---

### Scenario 6: Invalid OTP Attempts
1. Start any OTP flow
2. Enter **wrong OTP**: `123456`
3. Error: "Invalid OTP. 4 attempts remaining."
4. Try 4 more wrong OTPs
5. After 5 failed attempts: "Maximum verification attempts exceeded"
6. Request new OTP via Resend

---

### Scenario 7: Expired OTP
1. Start any OTP flow
2. **Wait 11 minutes** (OTP expires in 10 min)
3. Enter the original OTP
4. Error: "OTP has expired. Please request a new one."
5. Click **Resend OTP**
6. Enter new OTP → Success

---

### Scenario 8: OTP Paste Feature
1. Start any OTP flow
2. **Copy** the 6-digit OTP from terminal: `456789`
3. Click on first OTP input field
4. **Paste** (Ctrl+V / Cmd+V)
5. All 6 digits fill automatically
6. Auto-verify triggered

---

## 🔍 Where to Find OTP in Development

**Check your server terminal for:**
```
================================
📧 OTP EMAIL
================================
To: john@example.com
Purpose: signup
OTP: 456789
Expires in: 10 minutes
================================
```

---

## 🐛 Troubleshooting

### OTP Not Showing in Console?
- Check server terminal (not client)
- Ensure server is running
- Check `NODE_ENV=development` in `.env`

### Cannot Login After Verification?
- Ensure you clicked "Verify OTP" successfully
- Check for success message
- Try refreshing and logging in again

### "Email already registered" Error?
- Email is already in database
- Use different email or clear database

### Rate Limit Error?
- Too many OTP requests
- Wait 15 minutes
- Or restart server to clear rate limits

---

## 📊 Database Verification

Check if email is verified in MongoDB:

```javascript
// User model
db.users.findOne({ email: "john@example.com" })
// Check: isEmailVerified: true

// Company model  
db.companies.findOne({ email: "recruiter@techcorp.com" })
// Check: isEmailVerified: true
```

---

## ✨ Success Indicators

- ✅ OTP appears in server console
- ✅ OTP verification succeeds
- ✅ Redirect to correct page
- ✅ Login works after verification
- ✅ Cannot login before verification
- ✅ Resend OTP works
- ✅ Invalid OTP shows error
- ✅ Auto-login after password reset

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Configure email service (nodemailer)
- [ ] Test email delivery
- [ ] Update `CLIENT_URL` in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Test all flows end-to-end
- [ ] Monitor rate limits
- [ ] Check error handling

---

**Happy Testing! 🚀**
