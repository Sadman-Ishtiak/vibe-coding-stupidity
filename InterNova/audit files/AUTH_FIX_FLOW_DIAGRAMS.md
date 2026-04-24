# AUTH SYSTEM FLOW DIAGRAMS

## 📊 BEFORE vs AFTER FIX

### BEFORE FIX (❌ BROKEN)
```
┌─────────────────────────────────────────────────────────────┐
│                      SIGNUP FLOW (BROKEN)                    │
└─────────────────────────────────────────────────────────────┘

  Frontend Signup
       │
       ├──► accountType: "candidate" ───► User Collection ✓
       │
       ├──► accountType: "company" ─────► User Collection ✗ (WRONG!)
       │
       └──► accountType: "recruiter" ───► User Collection ✗ (WRONG!)


┌─────────────────────────────────────────────────────────────┐
│                       LOGIN FLOW (BROKEN)                    │
└─────────────────────────────────────────────────────────────┘

  Login Request
       │
       └──► Check User Collection Only
            │
            ├──► Found Candidate ────► Login Success ✓
            │
            └──► Company Not Found ──► Login Failed ✗


┌─────────────────────────────────────────────────────────────┐
│                      TOKEN STRUCTURE (BROKEN)                │
└─────────────────────────────────────────────────────────────┘

  JWT Payload:
  {
    "id": "user_id",
    "role": "company"
    ❌ Missing userType field!
  }

  Auth Middleware:
  ❌ Cannot determine which model to load
  ❌ Defaults to User model only
```

---

### AFTER FIX (✅ WORKING)
```
┌─────────────────────────────────────────────────────────────┐
│                      SIGNUP FLOW (FIXED)                     │
└─────────────────────────────────────────────────────────────┘

  Frontend Signup
       │
       ├──► accountType: "candidate" ───► User Collection ✓
       │
       ├──► accountType: "company" ─────► Company Collection ✓
       │
       └──► accountType: "recruiter" ───► Company Collection ✓


┌─────────────────────────────────────────────────────────────┐
│                       LOGIN FLOW (FIXED)                     │
└─────────────────────────────────────────────────────────────┘

  Login Request (email + password)
       │
       ├──► Check User Collection
       │    │
       │    ├──► Found? ──► Authenticate ──► Return Token ✓
       │    │
       │    └──► Not Found? ──┐
       │                      │
       └──────────────────────┘
                              │
       ┌──────────────────────┘
       │
       └──► Check Company Collection
            │
            ├──► Found? ──► Authenticate ──► Return Token ✓
            │
            └──► Not Found? ──► Return Error


┌─────────────────────────────────────────────────────────────┐
│                      TOKEN STRUCTURE (FIXED)                 │
└─────────────────────────────────────────────────────────────┘

  JWT Payload:
  {
    "id": "user_id",
    "role": "company",
    "userType": "company"  ✓ Added!
  }

  Auth Middleware:
  if (userType === "company")
    ✓ Load from Company model
  else
    ✓ Load from User model
```

---

## 🔄 DETAILED FLOW DIAGRAMS

### REGISTRATION FLOW

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT                                                      │
└─────────────────────────────────────────────────────────────┘
        │
        │  POST /api/auth/register
        │  { username, email, password, accountType }
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  AUTH CONTROLLER (register)                                  │
└─────────────────────────────────────────────────────────────┘
        │
        ├─► Validate Input
        │
        ├─► Normalize Email
        │
        └─► Route Based on accountType:
            │
            ├────────────────────────┬────────────────────────┐
            │                        │                        │
            ▼                        ▼                        ▼
    accountType:           accountType:            accountType:
    "candidate"            "company"               "recruiter"
            │                        │                        │
            ▼                        ▼                        ▼
    ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
    │ Check User   │        │ Check Company│        │ Check Company│
    │ Collection   │        │ Collection   │        │ Collection   │
    │ for Duplicate│        │ for Duplicate│        │ for Duplicate│
    └──────────────┘        └──────────────┘        └──────────────┘
            │                        │                        │
            ▼                        ▼                        ▼
    ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
    │  Create in   │        │  Create in   │        │  Create in   │
    │  User Model  │        │ Company Model│        │ Company Model│
    │ role: "candidate"     │ role: "company"       │ role: "recruiter"
    └──────────────┘        └──────────────┘        └──────────────┘
            │                        │                        │
            ▼                        ▼                        ▼
    ┌──────────────────────────────────────────────────────┐
    │  Generate JWT Token                                  │
    │  { id, role, userType: "candidate" | "company" }     │
    └──────────────────────────────────────────────────────┘
            │
            ▼
    ┌──────────────────────────────────────────────────────┐
    │  Return Response                                      │
    │  { success, accessToken, refreshToken, user }        │
    └──────────────────────────────────────────────────────┘
```

---

### LOGIN FLOW

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT                                                      │
└─────────────────────────────────────────────────────────────┘
        │
        │  POST /api/auth/login
        │  { email, password }
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  AUTH CONTROLLER (login)                                     │
└─────────────────────────────────────────────────────────────┘
        │
        ├─► Validate Input
        │
        ├─► Normalize Email
        │
        └─► Search for Account:
            │
            ▼
    ┌──────────────────┐
    │ Search User      │
    │ Collection       │
    │ by email         │
    └──────────────────┘
            │
            ├──► Found? ──────────────────┐
            │                             │
            └──► Not Found?               │
                      │                   │
                      ▼                   ▼
            ┌──────────────────┐   ┌──────────────────┐
            │ Search Company   │   │  User Account    │
            │ Collection       │   │  Found           │
            │ by email         │   │  userType = "candidate"
            └──────────────────┘   └──────────────────┘
                      │                   │
                      │                   │
            ├─────────┴───────────────────┘
            │         │
            │         └──► Not Found? ──► Return Error
            │
            ▼
    ┌──────────────────┐
    │ Company Account  │
    │ Found            │
    │ userType = "company"
    └──────────────────┘
            │
            ├──────────┬────────────┐
            │          │            │
            ▼          ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Verify   │ │ Check    │ │ Compare  │
    │ isActive │ │ Account  │ │ Password │
    │ (Company)│ │ Status   │ │          │
    └──────────┘ └──────────┘ └──────────┘
            │          │            │
            └──────────┴────────────┘
                      │
                      ▼
            ┌──────────────────────┐
            │ Generate JWT Tokens  │
            │ with correct userType│
            └──────────────────────┘
                      │
                      ▼
            ┌──────────────────────┐
            │ Store Refresh Token  │
            │ (User model only)    │
            └──────────────────────┘
                      │
                      ▼
            ┌──────────────────────┐
            │ Return Response      │
            │ { success, tokens,   │
            │   user data }        │
            └──────────────────────┘
```

---

### AUTH MIDDLEWARE FLOW

```
┌─────────────────────────────────────────────────────────────┐
│  PROTECTED ROUTE REQUEST                                     │
│  Authorization: Bearer <token>                               │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  AUTH MIDDLEWARE                                             │
└─────────────────────────────────────────────────────────────┘
        │
        ├─► Extract Token from Header
        │
        ├─► Verify JWT Signature
        │
        └─► Decode Token Payload:
            │
            ▼
    ┌────────────────────────────┐
    │ Token Payload:             │
    │ {                          │
    │   id: "user_id",           │
    │   role: "company",         │
    │   userType: "company"      │
    │ }                          │
    └────────────────────────────┘
            │
            └─► Check userType field:
                │
                ├───────────────────┬───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        userType:           userType:          userType:
        "company"           "candidate"        undefined
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
        │ Load from    │    │ Load from    │   │ Default to   │
        │ Company      │    │ User Model   │   │ User Model   │
        │ Model        │    │              │   │ (legacy)     │
        └──────────────┘    └──────────────┘   └──────────────┘
                │                   │                   │
                ├───────────────────┴───────────────────┘
                │
                ▼
        ┌──────────────────┐
        │ Attach to        │
        │ req.user         │
        │ + userType flag  │
        └──────────────────┘
                │
                ▼
        ┌──────────────────┐
        │ Call next()      │
        │ Continue to      │
        │ Route Handler    │
        └──────────────────┘
```

---

## 🗄️ DATABASE STRUCTURE

### BEFORE FIX
```
┌─────────────────────────────────────────────────────────────┐
│  users Collection (CONTAMINATED)                             │
└─────────────────────────────────────────────────────────────┘
  {
    username: "John Doe",
    email: "john@example.com",
    role: "candidate",  ✓
    skills: [...],
    education: [...],
    resume: {...}
  }
  {
    username: "Tech Corp",
    email: "hr@techcorp.com",
    role: "company",  ✗ WRONG COLLECTION!
    skills: [],  ✗ Shouldn't have this
    education: [],  ✗ Shouldn't have this
    resume: {}  ✗ Shouldn't have this
  }

┌─────────────────────────────────────────────────────────────┐
│  companies Collection (EMPTY)                                │
└─────────────────────────────────────────────────────────────┘
  (empty - companies not being created here)
```

### AFTER FIX
```
┌─────────────────────────────────────────────────────────────┐
│  users Collection (CLEAN - Candidates Only)                  │
└─────────────────────────────────────────────────────────────┘
  {
    username: "John Doe",
    email: "john@example.com",
    role: "candidate",  ✓
    skills: [...],  ✓
    education: [...],  ✓
    resume: {...},  ✓
    projects: [...],  ✓
    bookmarks: [...]  ✓
  }

┌─────────────────────────────────────────────────────────────┐
│  companies Collection (CLEAN - Companies Only)               │
└─────────────────────────────────────────────────────────────┘
  {
    companyName: "Tech Corp",
    email: "hr@techcorp.com",
    role: "company",  ✓
    ownerName: "Jane Smith",  ✓
    logo: "/uploads/logo.png",  ✓
    employees: "100-200",  ✓
    companyWebsite: "https://techcorp.com",  ✓
    socialLinks: {...}  ✓
  }
  {
    companyName: "Recruit Pro",
    email: "recruiter@example.com",
    role: "recruiter",  ✓
    ownerName: "Bob Johnson",  ✓
    logo: "/uploads/logo2.png",  ✓
    phone: "+123456789"  ✓
  }
```

---

## 🔐 TOKEN COMPARISON

### BEFORE FIX
```javascript
// Access Token Payload
{
  "id": "507f1f77bcf86cd799439011",
  "role": "company",
  "iat": 1706000000,
  "exp": 1706000900
}
// ❌ Missing userType - middleware cannot determine model!
```

### AFTER FIX
```javascript
// Access Token Payload
{
  "id": "507f1f77bcf86cd799439011",
  "role": "company",
  "userType": "company",  // ✓ Added!
  "iat": 1706000000,
  "exp": 1706000900
}
// ✓ Middleware knows to load from Company model
```

---

## 📈 MIGRATION FLOW

```
┌─────────────────────────────────────────────────────────────┐
│  CLEANUP SCRIPT FLOW                                         │
└─────────────────────────────────────────────────────────────┘

  1. Connect to MongoDB
        │
        ▼
  2. Find Misplaced Accounts
     db.users.find({ role: { $in: ['company', 'recruiter'] } })
        │
        ▼
  3. Display Results
     List all misplaced accounts
        │
        ▼
  4. Create Backup
     Export to /backups/misplaced-accounts-{timestamp}.json
        │
        ▼
  5. Migrate Each Account:
        │
        ├──► Check if email exists in Company collection
        │    │
        │    ├──► Exists? ──► Skip (log warning)
        │    │
        │    └──► Not exists? ──► Continue
        │              │
        │              ▼
        │    Create in Company collection:
        │    {
        │      companyName: user.username,
        │      email: user.email,
        │      password: user.password,  // Keep hash
        │      role: user.role,
        │      phone: user.phone || '',
        │      logo: user.profilePicture || '',
        │      isActive: true
        │    }
        │              │
        │              ▼
        └────────► Migration Success
                        │
                        ▼
  6. Delete from User Collection
     db.users.deleteMany({ _id: { $in: [migratedIds] } })
        │
        ▼
  7. Report Results
     - Migrated count
     - Failed count
     - Deleted count
```

---

**These diagrams illustrate the complete authentication flow before and after the fix.**
