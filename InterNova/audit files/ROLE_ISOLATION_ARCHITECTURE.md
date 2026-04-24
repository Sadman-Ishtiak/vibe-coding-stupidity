# 🏗️ ROLE ISOLATION ARCHITECTURE

Visual representation of the complete role isolation system.

---

## 🎨 SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                           │
│                         Port: 5174 (Vite)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────────────────┐  ┌──────────────────────────┐      │
│   │   CANDIDATE PAGES        │  │   COMPANY PAGES          │      │
│   ├──────────────────────────┤  ├──────────────────────────┤      │
│   │ CandidateProfile.jsx     │  │ CompanyProfile.jsx       │      │
│   │ AppliedJobs.jsx          │  │ ManageJobs.jsx           │      │
│   │ BookmarkJobs.jsx         │  │ ManageApplicants.jsx     │      │
│   │                          │  │ PostJob.jsx              │      │
│   └──────────┬───────────────┘  └──────────┬───────────────┘      │
│              │                              │                       │
│              ↓                              ↓                       │
│   ┌──────────────────────────┐  ┌──────────────────────────┐      │
│   │ candidates.service.js    │  │ companies.service.js     │      │
│   └──────────┬───────────────┘  └──────────┬───────────────┘      │
│              │                              │                       │
│              │                              │                       │
│              │ api.get('/candidates/me')   │ api.post('/companies')│
│              │ api.get('/candidates/...')  │ api.get('/companies/')│
│              │                              │                       │
└──────────────┼──────────────────────────────┼───────────────────────┘
               │                              │
               │                              │
        ┌──────┼──────────────────────────────┼──────┐
        │      │      EXPRESS ROUTER          │      │
        │      │      Port: 5000             │      │
        │      ↓                              ↓      │
        │  /api/candidates/*              /api/companies/*  │
        └──────┼──────────────────────────────┼──────┘
               │                              │
┌──────────────┼──────────────────────────────┼──────────────────────┐
│              ↓                              ↓                       │
│  ┌────────────────────────┐    ┌────────────────────────┐         │
│  │ candidateAuthMiddleware│    │ companyAuthMiddleware  │         │
│  │  (protectCandidate)    │    │  (protectCompany)      │         │
│  ├────────────────────────┤    ├────────────────────────┤         │
│  │                        │    │                        │         │
│  │ 1. Extract JWT token   │    │ 1. Extract JWT token   │         │
│  │ 2. Verify signature    │    │ 2. Verify signature    │         │
│  │ 3. Check decoded.role  │    │ 3. Check decoded.role  │         │
│  │    ❌ BLOCK if         │    │    ❌ BLOCK if         │         │
│  │    role='recruiter'    │    │    role='candidate'    │         │
│  │ 4. Fetch User from DB  │    │ 4. Fetch User from DB  │         │
│  │ 5. Verify user.role    │    │ 5. Verify user.role    │         │
│  │    ❌ BLOCK if not     │    │    ❌ BLOCK if not     │         │
│  │    role='candidate'    │    │    role='recruiter'    │         │
│  │ 6. Attach req.candidate│    │ 6. Attach req.company  │         │
│  │ 7. Call next() ✅      │    │ 7. Call next() ✅      │         │
│  │                        │    │                        │         │
│  └──────────┬─────────────┘    └──────────┬─────────────┘         │
│             │                              │                       │
│             ↓                              ↓                       │
│  ┌────────────────────────┐    ┌────────────────────────┐         │
│  │  candidateController   │    │  companyController     │         │
│  ├────────────────────────┤    ├────────────────────────┤         │
│  │ getMyProfile()         │    │ createCompany()        │         │
│  │ updateMyProfile()      │    │ getCompanies()         │         │
│  │ changePassword()       │    │ getCompany()           │         │
│  │ getBookmarks()         │    │                        │         │
│  │ addBookmark()          │    │                        │         │
│  │ removeBookmark()       │    │                        │         │
│  └──────────┬─────────────┘    └──────────┬─────────────┘         │
│             │                              │                       │
│             └────────────┬─────────────────┘                       │
│                          ↓                                         │
│              ┌────────────────────────┐                            │
│              │     User Model         │                            │
│              │  (MongoDB/Mongoose)    │                            │
│              ├────────────────────────┤                            │
│              │ - username             │                            │
│              │ - email                │                            │
│              │ - password             │ ← bcrypt pre-save hook    │
│              │ - role: 'candidate'    │   (automatic hashing)     │
│              │   OR 'recruiter'       │                            │
│              │ - profilePicture       │                            │
│              │ - isVerified           │                            │
│              │ - refreshToken         │                            │
│              │ - timestamps           │                            │
│              └────────────────────────┘                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 JWT TOKEN STRUCTURE

### Candidate Token
```json
{
  "id": "696412bc732c05ddb300c9bf",
  "role": "candidate",
  "iat": 1768235745,
  "exp": 1768236645
}
```

### Recruiter Token
```json
{
  "id": "696413cd843d16eec411dace",
  "role": "recruiter",
  "iat": 1768235800,
  "exp": 1768236700
}
```

---

## 🚦 REQUEST FLOW

### ✅ Candidate Accessing Own Profile

```
1. User logs in as candidate
   └─> authController.login()
       └─> generateAccessToken(user._id, user.role)
           └─> JWT: { id: "...", role: "candidate" }

2. Frontend calls GET /api/candidates/me
   └─> Headers: Authorization: Bearer <token>

3. candidateAuthMiddleware intercepts
   ├─> Verify JWT signature ✅
   ├─> decoded.role === 'candidate' ✅
   ├─> Find User in database ✅
   ├─> user.role === 'candidate' ✅
   └─> Attach req.candidate = user ✅

4. candidateController.getMyProfile()
   └─> Returns candidate profile ✅

5. Response: 200 OK
```

---

### ❌ Candidate Trying to Access Company Endpoint

```
1. User logged in as candidate
   └─> JWT: { id: "...", role: "candidate" }

2. Frontend calls POST /api/companies
   └─> Headers: Authorization: Bearer <token>

3. companyAuthMiddleware intercepts
   ├─> Verify JWT signature ✅
   ├─> decoded.role === 'candidate' ❌ BLOCKED!
   └─> Return 403 Forbidden ❌

4. Response: 403 Forbidden
   {
     "success": false,
     "message": "Access denied. This endpoint is for recruiters only."
   }
```

---

### ✅ Recruiter Creating Company

```
1. User logs in as recruiter
   └─> authController.login()
       └─> generateAccessToken(user._id, user.role)
           └─> JWT: { id: "...", role: "recruiter" }

2. Frontend calls POST /api/companies
   └─> Headers: Authorization: Bearer <token>

3. companyAuthMiddleware intercepts
   ├─> Verify JWT signature ✅
   ├─> decoded.role === 'recruiter' ✅
   ├─> Find User in database ✅
   ├─> user.role === 'recruiter' ✅
   └─> Attach req.company = user ✅

4. companyController.createCompany()
   └─> Creates company record ✅

5. Response: 201 Created
```

---

### ❌ Recruiter Trying to Access Candidate Endpoint

```
1. User logged in as recruiter
   └─> JWT: { id: "...", role: "recruiter" }

2. Frontend calls GET /api/candidates/me
   └─> Headers: Authorization: Bearer <token>

3. candidateAuthMiddleware intercepts
   ├─> Verify JWT signature ✅
   ├─> decoded.role === 'recruiter' ❌ BLOCKED!
   └─> Return 403 Forbidden ❌

4. Response: 403 Forbidden
   {
     "success": false,
     "message": "Access denied. This endpoint is for candidates only."
   }
```

---

## 🛡️ SECURITY LAYERS

```
┌────────────────────────────────────────────┐
│          Layer 1: JWT Level                │
│  Check decoded.role from token payload     │
│  ✅ Fast rejection before database query   │
└────────────────┬───────────────────────────┘
                 │
┌────────────────┴───────────────────────────┐
│          Layer 2: Database Level           │
│  Verify user.role from User model          │
│  ✅ Confirm role hasn't changed            │
└────────────────┬───────────────────────────┘
                 │
┌────────────────┴───────────────────────────┐
│       Layer 3: Middleware Level            │
│  Dedicated middleware per role             │
│  ✅ candidateAuthMiddleware                │
│  ✅ companyAuthMiddleware                  │
└────────────────┬───────────────────────────┘
                 │
┌────────────────┴───────────────────────────┐
│         Layer 4: Route Level               │
│  Routes protected with role-specific       │
│  middleware via router.use()               │
│  ✅ /api/candidates/* → protectCandidate   │
│  ✅ /api/companies/* → protectCompany      │
└────────────────────────────────────────────┘
```

---

## 📊 ENDPOINT PROTECTION MATRIX

| Endpoint | Middleware | Candidate | Recruiter | Public |
|----------|-----------|-----------|-----------|--------|
| `POST /api/auth/register` | None | ✅ | ✅ | ✅ |
| `POST /api/auth/login` | None | ✅ | ✅ | ✅ |
| `GET /api/candidates/me` | protectCandidate | ✅ | ❌ | ❌ |
| `PUT /api/candidates/me` | protectCandidate | ✅ | ❌ | ❌ |
| `PUT /api/candidates/change-password` | protectCandidate | ✅ | ❌ | ❌ |
| `GET /api/candidates/bookmarks` | protectCandidate | ✅ | ❌ | ❌ |
| `POST /api/candidates/bookmarks/:id` | protectCandidate | ✅ | ❌ | ❌ |
| `DELETE /api/candidates/bookmarks/:id` | protectCandidate | ✅ | ❌ | ❌ |
| `POST /api/companies` | protectCompany | ❌ | ✅ | ❌ |
| `GET /api/companies` | None | ✅ | ✅ | ✅ |
| `GET /api/companies/:id` | None | ✅ | ✅ | ✅ |

---

## 🔄 PASSWORD CHANGE FLOW

```
┌────────────────────────────────────────────┐
│  User submits password change form         │
│  { currentPassword, newPassword,           │
│    confirmPassword }                       │
└────────────────┬───────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────┐
│  PUT /api/candidates/change-password       │
│  (via candidateAuthMiddleware)             │
└────────────────┬───────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────┐
│  candidateController.changePassword()      │
│  1. Validate passwords match ✅            │
│  2. Find user with password field          │
│  3. user.comparePassword(currentPassword)  │
│     ├─> bcrypt.compare() internally        │
│     └─> Returns true/false                 │
│  4. If match:                              │
│     ├─> user.password = newPassword        │
│     └─> user.save()                        │
│         └─> Pre-save hook triggers         │
│             └─> bcrypt.hash(newPassword)   │
└────────────────┬───────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────┐
│  Response: 200 OK                          │
│  { success: true,                          │
│    message: "Password changed successfully"│
│  }                                         │
└────────────────────────────────────────────┘
```

---

## 📝 FILE ORGANIZATION

```
server/
├── controllers/
│   ├── candidateController.js  ← Candidate operations
│   ├── companyController.js    ← Company operations
│   └── authController.js       ← Shared auth (login/register)
│
├── middlewares/
│   ├── candidateAuthMiddleware.js  ← Candidate protection
│   ├── companyAuthMiddleware.js    ← Company protection
│   ├── authMiddleware.js           ← Generic auth (not role-specific)
│   └── roleMiddleware.js           ← Helper (isCandidate, isRecruiter)
│
├── routes/
│   ├── candidateRoutes.js      ← /api/candidates/*
│   ├── companyRoutes.js        ← /api/companies/*
│   └── authRoutes.js           ← /api/auth/*
│
├── models/
│   ├── User.js                 ← Shared user model (both roles)
│   ├── Candidate.js            ← Extended candidate profile
│   └── Company.js              ← Company data model
│
└── utils/
    ├── generateToken.js        ← JWT generation (includes role)
    └── authLogger.js           ← Auth logging utility
```

---

## 🎯 KEY PRINCIPLES

1. **Separation of Concerns**
   - Each role has dedicated middleware
   - Controllers don't share logic
   - Frontend services are separate

2. **Defense in Depth**
   - JWT level check (fast)
   - Database level check (secure)
   - Middleware level enforcement
   - Route level protection

3. **Zero Trust**
   - Never trust JWT alone
   - Always verify from database
   - Block explicitly, allow explicitly

4. **Fail Secure**
   - Default to 403 Forbidden
   - Clear error messages
   - No information leakage

---

**END OF ARCHITECTURE DOCUMENT**
