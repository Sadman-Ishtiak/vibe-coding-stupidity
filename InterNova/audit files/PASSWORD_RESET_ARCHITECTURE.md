# Password Reset Flow - Visual Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PASSWORD RESET SYSTEM                        │
│                        InternNova Job Portal                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐         ┌────────────────────────────────┐
│   FRONTEND (React)      │         │   BACKEND (Node.js/Express)     │
│   Port: 5173            │         │   Port: 5000                    │
└─────────────────────────┘         └────────────────────────────────┘
          │                                      │
          │                                      │
    ┌─────▼─────┐                          ┌────▼────┐
    │ Pages     │                          │ Routes  │
    ├───────────┤                          ├─────────┤
    │ • Reset   │                          │ /forgot │
    │   Password│◄────HTTP POST────────────┤ -pass   │
    │ • New     │                          │ /reset  │
    │   Password│◄────HTTP POST────────────┤ -pass   │
    └───────────┘                          └─────────┘
          │                                      │
          │                                ┌─────▼─────┐
    ┌─────▼─────┐                          │Controllers│
    │ Services  │                          ├───────────┤
    ├───────────┤                          │ • forgot  │
    │ auth      │                          │   Password│
    │ .service  │                          │ • reset   │
    │           │                          │   Password│
    └───────────┘                          └─────┬─────┘
                                                 │
                                           ┌─────▼─────┐
                                           │ Security  │
                                           ├───────────┤
                                           │ • Token   │
                                           │   Gen     │
                                           │ • Hashing │
                                           │ • Rate    │
                                           │   Limit   │
                                           └─────┬─────┘
                                                 │
                                           ┌─────▼─────┐
                                           │ Database  │
                                           ├───────────┤
                                           │ MongoDB   │
                                           │ User Model│
                                           └───────────┘
```

---

## 📧 Email Flow (Development Mode)

```
┌──────────────────────────────────────────────────────────────┐
│                   EMAIL FLOW (DEV MODE)                      │
└──────────────────────────────────────────────────────────────┘

User submits email
       │
       ▼
Backend validates email
       │
       ├──► Email exists? ───┐
       │                     │
       │                     ▼
       │              Generate Token
       │                     │
       │                     ▼
       │              Hash Token (SHA256)
       │                     │
       │                     ▼
       │              Save to Database
       │                     │
       │                     ▼
       │              Log Email to Console
       │                     │
       └─────────────────────┤
                             ▼
              Return Generic Success Message
                  (same for all cases)
                             │
                             ▼
              User checks terminal for link
                             │
                             ▼
              Clicks link → New Password Page
```

---

## 🔐 Token Security Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   TOKEN SECURITY FLOW                        │
└──────────────────────────────────────────────────────────────┘

1. TOKEN GENERATION
   ┌─────────────────────────┐
   │ crypto.randomBytes(32)  │
   └────────┬────────────────┘
            │
            ▼
   ┌─────────────────────────┐
   │ Convert to Hex (64 char)│
   └────────┬────────────────┘
            │
            ▼
   Plain Token: abc123def456...xyz789
            │
            ├──► Sent in Email
            │
            ▼

2. TOKEN STORAGE
   ┌─────────────────────────┐
   │ SHA256 Hash             │
   └────────┬────────────────┘
            │
            ▼
   Hashed: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            │
            ▼
   ┌─────────────────────────┐
   │ Save to Database        │
   │ + Expiration (30 min)   │
   └─────────────────────────┘

3. TOKEN VALIDATION
   User clicks link with token
            │
            ▼
   ┌─────────────────────────┐
   │ Extract token from URL  │
   └────────┬────────────────┘
            │
            ▼
   ┌─────────────────────────┐
   │ Hash incoming token     │
   └────────┬────────────────┘
            │
            ▼
   ┌─────────────────────────┐
   │ Compare with DB hash    │
   │ Check expiration        │
   └────────┬────────────────┘
            │
            ├──► Match? ──► Allow Reset
            │
            └──► No Match ──► Reject

4. TOKEN CLEANUP
   After successful reset
            │
            ▼
   ┌─────────────────────────┐
   │ Clear token from DB     │
   │ Clear expiration        │
   └─────────────────────────┘
            │
            ▼
   Token can't be reused ✅
```

---

## 🛡️ Security Layers

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└──────────────────────────────────────────────────────────────┘

Layer 1: INPUT VALIDATION
├─ Email format validation
├─ Password strength requirements
└─ Token format validation

Layer 2: RATE LIMITING
├─ 5 requests / 15 min (forgot password)
├─ 10 requests / 15 min (reset password)
└─ IP-based tracking

Layer 3: AUTHENTICATION
├─ Token hashing (SHA256)
├─ Password hashing (Bcrypt)
└─ JWT for session management

Layer 4: AUTHORIZATION
├─ Token ownership validation
├─ Expiration enforcement (30 min)
└─ One-time use enforcement

Layer 5: DATA PROTECTION
├─ No email enumeration
├─ Generic error messages
├─ Timing attack prevention
└─ Secure logging (no sensitive data)

Layer 6: TRANSPORT SECURITY
├─ HTTPS ready (secure cookies)
├─ CORS protection
└─ httpOnly cookies
```

---

## 🔄 Complete User Journey

```
┌──────────────────────────────────────────────────────────────┐
│                  COMPLETE USER JOURNEY                       │
└──────────────────────────────────────────────────────────────┘

START: User forgot password
  │
  ▼
┌─────────────────────────────┐
│ 1. Click "Forgot Password"  │
│    on login page            │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 2. Navigate to              │
│    /reset-password          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 3. Enter email address      │
│    user@example.com         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 4. Click "Send Request"     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 5. See success message      │
│    "If an account exists..."│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 6. Backend processes        │
│    • Validates email        │
│    • Generates token        │
│    • Hashes & stores        │
│    • Logs email (dev)       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 7. Check terminal output    │
│    📧 PASSWORD RESET EMAIL  │
│    Link: .../reset/[token]  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 8. Copy token from link     │
│    (64-character hex)       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 9. Navigate to              │
│    /reset-password/[token]  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 10. Enter new password      │
│     • Min 8 characters      │
│     • Letters + numbers     │
│     • Confirm password      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 11. Click "Reset Password"  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 12. Backend validates       │
│     • Hash & find token     │
│     • Check expiration      │
│     • Hash new password     │
│     • Update database       │
│     • Clear token           │
│     • Generate JWT          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 13. Auto-login              │
│     • Save tokens           │
│     • Update auth context   │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 14. Redirect to dashboard   │
│     • Candidate → Profile   │
│     • Recruiter → Manage    │
└──────────┬──────────────────┘
           │
           ▼
END: Password reset complete! ✅
```

---

## 📊 Database Schema

```
┌──────────────────────────────────────────────────────────────┐
│                    USER MODEL (MongoDB)                      │
└──────────────────────────────────────────────────────────────┘

User Document
├─ _id: ObjectId
├─ username: String
├─ email: String (indexed, unique)
├─ password: String (bcrypt hash)
├─ role: String ['candidate', 'recruiter']
├─ profilePicture: String
├─ isVerified: Boolean
├─ refreshToken: String
├─ refreshTokenExpiry: Date
│
├─ resetPasswordToken: String         ◄─── NEW
│  │  • SHA256 hash of reset token
│  │  • 64 characters
│  │  • Null when not in use
│  └─ Example: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4..."
│
└─ resetPasswordExpires: Date          ◄─── NEW
   │  • Timestamp when token expires
   │  • Set to Date.now() + 30 minutes
   │  • Null when not in use
   └─ Example: 2026-01-12T10:30:00.000Z

Lifecycle:
  Normal State:
    resetPasswordToken: null
    resetPasswordExpires: null
  
  After Reset Request:
    resetPasswordToken: "e3b0c442..." (hashed)
    resetPasswordExpires: 2026-01-12T10:30:00Z
  
  After Successful Reset:
    resetPasswordToken: null
    resetPasswordExpires: null
```

---

## 🔍 Rate Limiting Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    RATE LIMITING SYSTEM                      │
└──────────────────────────────────────────────────────────────┘

In-Memory Store (Map)
└─ Key: IP + Endpoint
   └─ Value: { count, resetTime }

Example:
┌─────────────────────────────────────────────────────────────┐
│ Key: "192.168.1.100:/auth/forgot-password"                  │
│ Value: {                                                    │
│   count: 3,                                                 │
│   resetTime: 2026-01-12T10:45:00Z                          │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

Request Flow:
1. Request arrives
   │
   ▼
2. Check rate limit store
   │
   ├─► No entry? ──► Create entry, allow
   │
   ├─► Entry exists, window passed? ──► Reset counter, allow
   │
   ├─► Entry exists, under limit? ──► Increment, allow
   │
   └─► Entry exists, over limit? ──► Reject (429)

Cleanup:
• Every 10 minutes
• Remove expired entries
• Prevent memory leaks

Limits:
• /forgot-password: 5 requests / 15 minutes
• /reset-password: 10 requests / 15 minutes

Production Upgrade Path:
In-Memory → Redis
• Distributed across servers
• Persistent across restarts
• Better performance at scale
```

---

## 🎯 Error Handling Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING PATHS                      │
└──────────────────────────────────────────────────────────────┘

FORGOT PASSWORD ERRORS:

Invalid Email Format
  └─► 400: "Invalid email address"

Rate Limit Exceeded
  └─► 429: "Too many requests. Please try again later."

Server Error
  └─► 500: "Server error. Please try again later."

Email Doesn't Exist
  └─► 200: "If an account exists..." (SAME AS SUCCESS)

──────────────────────────────────────────────────────────────

RESET PASSWORD ERRORS:

Missing Token
  └─► 400: "Token and password are required"

Invalid Token Format
  └─► 400: "Token is required"

Token Not Found
  └─► 400: "Invalid or expired reset token"

Token Expired
  └─► 400: "Invalid or expired reset token"

Weak Password
  └─► 400: "Password must be at least 8 characters..."

Rate Limit Exceeded
  └─► 429: "Too many requests. Please try again later."

Server Error
  └─► 500: "Server error. Please try again later."

──────────────────────────────────────────────────────────────

FRONTEND ERROR HANDLING:

Network Error
  └─► "An error occurred. Please try again."

Rate Limit (429)
  └─► "Too many requests. Please try again later."

Validation Error
  └─► Show specific validation message

Success
  └─► Generic success message (no info leakage)
```

---

## 📁 File Structure

```
InterNova/
│
├── server/
│   ├── models/
│   │   └── User.js                    ✅ MODIFIED
│   │       └─ Added reset token fields
│   │
│   ├── controllers/
│   │   └── authController.js          ✅ MODIFIED
│   │       ├─ forgotPassword()
│   │       └─ resetPassword()
│   │
│   ├── routes/
│   │   └── authRoutes.js              ✅ MODIFIED
│   │       ├─ POST /forgot-password
│   │       └─ POST /reset-password
│   │
│   ├── middlewares/
│   │   └── rateLimitMiddleware.js     ✨ NEW
│   │       └─ rateLimit()
│   │
│   └── utils/
│       └── emailService.js            ✨ NEW
│           ├─ generateResetToken()
│           ├─ hashResetToken()
│           └─ sendPasswordResetEmail()
│
├── client/
│   └── src/
│       ├── pages/
│       │   └── auth/
│       │       ├── ResetPassword.jsx  ✅ MODIFIED
│       │       └── NewPassword.jsx    ✨ NEW
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx          ✅ MODIFIED
│       │       └─ Added /reset-password/:token
│       │
│       └── services/
│           └── auth.service.js        ✅ EXISTS
│               ├─ forgotPassword()
│               └─ resetPassword()
│
└── Documentation/
    ├── PASSWORD_RESET_IMPLEMENTATION.md    ✨ NEW
    ├── PASSWORD_RESET_QUICK_START.md       ✨ NEW
    ├── PASSWORD_RESET_SUMMARY.md           ✨ NEW
    ├── PASSWORD_RESET_CHECKLIST.md         ✨ NEW
    ├── PASSWORD_RESET_ARCHITECTURE.md      ✨ NEW (this file)
    └── test-password-reset.sh              ✨ NEW
```

---

**End of Architecture Documentation**

This visual guide provides a comprehensive overview of the password reset system architecture, security layers, and implementation details.

For detailed implementation instructions, see:
- `PASSWORD_RESET_IMPLEMENTATION.md`
- `PASSWORD_RESET_QUICK_START.md`
- `PASSWORD_RESET_CHECKLIST.md`
