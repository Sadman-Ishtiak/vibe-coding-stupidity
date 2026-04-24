# 🔄 Authentication Flow Diagrams

Visual guide to understanding the authentication system.

---

## 🔐 Login Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Server    │
│  (SignIn)   │                                    │  (Express)  │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /auth/login                            │
       │     { email, password }                         │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                                    2. Find user │
       │                                    3. Verify pw │
       │                                4. Gen tokens    │
       │                                5. Store refresh │
       │                                                  │
       │  6. Response                                    │
       │     { accessToken, refreshToken, user }         │
       │<────────────────────────────────────────────────┤
       │                                                  │
7. Store tokens                                          │
   in localStorage                                       │
       │                                                  │
8. Navigate to                                           │
   dashboard                                             │
       │                                                  │
```

**Key Points:**
- Password verified with bcrypt
- Both tokens generated
- Refresh token stored in DB
- Tokens sent to client
- Client stores for future requests

---

## 🔄 Token Refresh Flow (Silent)

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Server    │
│   (Axios)   │                                    │  (Express)  │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. GET /api/jobs                               │
       │     Authorization: Bearer <expired-token>       │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                              2. Verify token    │
       │                              3. Token expired!  │
       │                                                  │
       │  4. 401 Unauthorized                            │
       │<────────────────────────────────────────────────┤
       │                                                  │
5. Interceptor                                           │
   detects 401                                           │
       │                                                  │
       │  6. POST /auth/refresh-token                    │
       │     Cookie: refreshToken                        │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                          7. Validate refresh    │
       │                          8. Gen new tokens      │
       │                          9. Update DB           │
       │                                                  │
       │  10. Response                                   │
       │      { accessToken, refreshToken }              │
       │<────────────────────────────────────────────────┤
       │                                                  │
11. Store new                                            │
    accessToken                                          │
       │                                                  │
       │  12. Retry GET /api/jobs                        │
       │      Authorization: Bearer <new-token>          │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                           13. Verify new token  │
       │                           14. Process request   │
       │                                                  │
       │  15. Response { jobs: [...] }                   │
       │<────────────────────────────────────────────────┤
       │                                                  │
✅ User never knows                                      │
   token was refreshed!                                  │
       │                                                  │
```

**Key Points:**
- Automatic detection of expired token
- Silent refresh in background
- Original request automatically retried
- Seamless user experience
- Token rotation for security

---

## 🛡️ Role-Based Access Control (RBAC) Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Server    │
│  (Candidate)│                                    │  (Express)  │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /api/jobs                              │
       │     Authorization: Bearer <token>               │
       │     { title: "Dev", company: "X" }              │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                           2. authMiddleware     │
       │                              - Verify token ✅  │
       │                              - Load user ✅     │
       │                                                  │
       │                           3. isRecruiter        │
       │                              - Check role       │
       │                              - role = candidate │
       │                              - ❌ BLOCK!        │
       │                                                  │
       │  4. 403 Forbidden                               │
       │     { message: "Only recruiters..." }           │
       │<────────────────────────────────────────────────┤
       │                                                  │
❌ Request blocked                                       │
   at middleware level                                   │
       │                                                  │
```

### ✅ Successful RBAC Flow (Recruiter)

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Server    │
│  (Recruiter)│                                    │  (Express)  │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /api/jobs                              │
       │     Authorization: Bearer <token>               │
       │     { title: "Dev", company: "X" }              │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                           2. authMiddleware     │
       │                              - Verify token ✅  │
       │                              - Load user ✅     │
       │                                                  │
       │                           3. isRecruiter        │
       │                              - Check role       │
       │                              - role = recruiter │
       │                              - ✅ PASS!         │
       │                                                  │
       │                           4. createJob()        │
       │                              - Create in DB     │
       │                                                  │
       │  5. 201 Created                                 │
       │     { job: { id: "...", ... } }                 │
       │<────────────────────────────────────────────────┤
       │                                                  │
✅ Request successful                                    │
       │                                                  │
```

**Key Points:**
- Middleware chain: auth → role → controller
- Blocks at middleware (before controller)
- Clean 403 responses
- No controller logic needed

---

## 🚪 Logout Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Server    │
│             │                                    │  (Express)  │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /auth/logout                           │
       │     Authorization: Bearer <token>               │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                         2. authMiddleware       │
       │                            - Verify token ✅    │
       │                            - Load user ✅       │
       │                                                  │
       │                         3. logout()             │
       │                            - Clear DB token     │
       │                            - Clear cookie       │
       │                                                  │
       │  4. Response { success: true }                  │
       │<────────────────────────────────────────────────┤
       │                                                  │
5. clearAuth()                                           │
   - Clear localStorage                                  │
   - Clear user state                                    │
       │                                                  │
6. Redirect to /sign-in                                  │
       │                                                  │
```

**Key Points:**
- Server invalidates refresh token
- Client clears all local data
- User redirected to login
- Session completely terminated

---

## 🔒 Security Layers

```
┌───────────────────────────────────────────────────────┐
│                    Request Flow                       │
└───────────────────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│ Layer 1: CORS Check                                   │
│ ✓ Origin allowed?                                     │
│ ✓ Credentials enabled?                                │
└───────────────────┬───────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────┐
│ Layer 2: Authentication (authMiddleware)              │
│ ✓ Token present?                                      │
│ ✓ Token valid?                                        │
│ ✓ User exists?                                        │
└───────────────────┬───────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────┐
│ Layer 3: Authorization (roleMiddleware)               │
│ ✓ User has required role?                             │
│ ✓ Permission granted?                                 │
└───────────────────┬───────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────┐
│ Layer 4: Business Logic (controller)                  │
│ ✓ Resource exists?                                    │
│ ✓ User owns resource?                                 │
│ ✓ Validation passed?                                  │
└───────────────────┬───────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────┐
│                Response Sent                          │
└───────────────────────────────────────────────────────┘
```

---

## 📦 Token Storage

```
┌─────────────────────────────────────────────────────┐
│                 Client Storage                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  localStorage:                                      │
│  ┌──────────────────────────────────────┐          │
│  │ internnova.accessToken               │          │
│  │ → "eyJhbGciOiJIUzI1NiIs..."         │          │
│  │ → Used for API requests              │          │
│  │ → 15 minute expiry                   │          │
│  └──────────────────────────────────────┘          │
│                                                     │
│  ┌──────────────────────────────────────┐          │
│  │ internnova.refreshToken              │          │
│  │ → "eyJhbGciOiJIUzI1NiIs..."         │          │
│  │ → Backup for non-cookie storage      │          │
│  │ → 7 day expiry                       │          │
│  └──────────────────────────────────────┘          │
│                                                     │
│  ┌──────────────────────────────────────┐          │
│  │ internnova.userData                  │          │
│  │ → { id, username, email, role }      │          │
│  │ → Cached for quick access            │          │
│  └──────────────────────────────────────┘          │
│                                                     │
│  Cookies (httpOnly):                                │
│  ┌──────────────────────────────────────┐          │
│  │ refreshToken                         │          │
│  │ → Set by server                      │          │
│  │ → httpOnly (XSS protection)          │          │
│  │ → secure (HTTPS only in prod)        │          │
│  │ → sameSite=strict (CSRF protection)  │          │
│  └──────────────────────────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 Server Storage                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  MongoDB (User collection):                         │
│  ┌──────────────────────────────────────┐          │
│  │ refreshToken: "eyJhbGciOiJ..."       │          │
│  │ → Stored on login                    │          │
│  │ → Validated on refresh               │          │
│  │ → Cleared on logout                  │          │
│  └──────────────────────────────────────┘          │
│                                                     │
│  ┌──────────────────────────────────────┐          │
│  │ refreshTokenExpiry: Date             │          │
│  │ → Calculated on token creation       │          │
│  │ → Checked on token refresh           │          │
│  └──────────────────────────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Middleware Chain

```
Route: POST /api/jobs

┌────────────────────┐
│  Request Arrives   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  authMiddleware    │  ← Verify JWT & load user
├────────────────────┤
│ ✓ Extract token    │
│ ✓ Verify signature │
│ ✓ Load user        │
│ ✓ Attach to req    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  isRecruiter       │  ← Check user role
├────────────────────┤
│ ✓ Check req.user   │
│ ✓ Verify role      │
│ ✓ Allow/block      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  createJob()       │  ← Business logic
├────────────────────┤
│ ✓ Validate data    │
│ ✓ Create in DB     │
│ ✓ Return response  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Response Sent     │
└────────────────────┘
```

---

## 🔐 Token Expiry Timeline

```
Time: 0 min
┌────────────────────────────────────────┐
│  User logs in                          │
│  - accessToken created (15 min exp)   │
│  - refreshToken created (7 day exp)   │
└────────────────────────────────────────┘

Time: 0-15 min
┌────────────────────────────────────────┐
│  Normal API requests                   │
│  ✓ accessToken valid                   │
│  ✓ Requests succeed                    │
└────────────────────────────────────────┘

Time: 15 min (accessToken expires)
┌────────────────────────────────────────┐
│  API request made                      │
│  ❌ accessToken expired                │
│  🔄 Auto refresh triggered             │
│  ✓ New accessToken obtained            │
│  ✓ Request retried & succeeds          │
└────────────────────────────────────────┘

Time: 15-30 min
┌────────────────────────────────────────┐
│  Using new accessToken                 │
│  ✓ Requests succeed                    │
└────────────────────────────────────────┘

Time: 7 days (refreshToken expires)
┌────────────────────────────────────────┐
│  API request made                      │
│  ❌ accessToken expired                │
│  🔄 Refresh attempted                  │
│  ❌ refreshToken also expired          │
│  ➡️  User redirected to login          │
└────────────────────────────────────────┘
```

**Key Points:**
- Short access token = More secure
- Long refresh token = Better UX
- Automatic refresh = Seamless experience
- Forced re-login after 7 days

---

## 📊 Status Code Guide

```
┌──────────┬─────────────────────────────────────┐
│   Code   │            Meaning                  │
├──────────┼─────────────────────────────────────┤
│   200    │ ✅ Success (GET, PUT, DELETE)       │
│   201    │ ✅ Created (POST)                   │
│   400    │ ❌ Bad request (validation)         │
│   401    │ 🔒 Unauthorized (no/invalid token)  │
│   403    │ 🚫 Forbidden (wrong role)           │
│   404    │ ❓ Not found                        │
│   500    │ 💥 Server error                     │
└──────────┴─────────────────────────────────────┘
```

**When to expect each:**
- **401** - Not logged in, token expired
- **403** - Logged in but wrong role
- **400** - Missing/invalid data
- **500** - Server/database error

---

## 🎉 Summary

This authentication system provides:

✅ **Secure** - JWT + bcrypt + token rotation  
✅ **Seamless** - Silent refresh, no interruptions  
✅ **Protected** - Role-based access control  
✅ **Scalable** - Clean middleware architecture  
✅ **Documented** - Complete flow diagrams  

**Status:** Production Ready!

---

**Last Updated:** January 12, 2026
