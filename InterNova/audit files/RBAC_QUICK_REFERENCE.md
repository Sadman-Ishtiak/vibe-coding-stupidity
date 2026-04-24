# 🛡️ RBAC (Role-Based Access Control) Quick Reference

## Overview

This guide provides quick examples and patterns for using Role-Based Access Control in the InterNova Job Portal.

---

## 🔐 Available Middleware

### 1. `authMiddleware`
**Purpose:** Verifies JWT access token and loads user  
**Location:** `server/middlewares/authMiddleware.js`  
**Usage:** Must be used before role middleware

```javascript
const auth = require('../middlewares/authMiddleware');
router.get('/protected', auth, controller);
```

**What it does:**
- Extracts Bearer token from Authorization header
- Verifies JWT signature
- Loads user from database
- Attaches user to `req.user`
- Returns 401 if token is invalid/missing

---

### 2. `isRecruiter`
**Purpose:** Blocks non-recruiters (403 Forbidden)  
**Location:** `server/middlewares/roleMiddleware.js`  
**Usage:** For recruiter-only routes

```javascript
const { isRecruiter } = require('../middlewares/roleMiddleware');
router.post('/jobs', auth, isRecruiter, createJob);
```

**Use Cases:**
- Creating job postings
- Updating company profiles
- Viewing job applications
- Managing job listings

---

### 3. `isCandidate`
**Purpose:** Blocks non-candidates (403 Forbidden)  
**Location:** `server/middlewares/roleMiddleware.js`  
**Usage:** For candidate-only routes

```javascript
const { isCandidate } = require('../middlewares/roleMiddleware');
router.post('/apply', auth, isCandidate, applyToJob);
```

**Use Cases:**
- Applying to jobs
- Updating candidate profile
- Uploading resume
- Managing job applications

---

### 4. `requireRole(...roles)`
**Purpose:** Generic role-based protection  
**Location:** `server/middlewares/roleMiddleware.js`  
**Usage:** For routes allowing multiple roles

```javascript
const { requireRole } = require('../middlewares/roleMiddleware');

// Single role
router.get('/admin', auth, requireRole('admin'), controller);

// Multiple roles
router.get('/dashboard', auth, requireRole('recruiter', 'admin'), controller);
```

**Use Cases:**
- Admin-only routes
- Multi-role access
- Custom role combinations

---

## 📖 Common Patterns

### Pattern 1: Public Route
No authentication required (e.g., job listings, home page)

```javascript
router.get('/jobs', getJobs); // No middleware
```

---

### Pattern 2: Authenticated Route (Any Role)
User must be logged in, any role allowed

```javascript
router.get('/profile', auth, getProfile);
```

---

### Pattern 3: Role-Specific Route
User must be logged in AND have specific role

```javascript
// Recruiter only
router.post('/jobs', auth, isRecruiter, createJob);

// Candidate only
router.post('/apply', auth, isCandidate, applyToJob);
```

---

### Pattern 4: Multi-Role Route
User must be logged in AND have one of specified roles

```javascript
router.get('/analytics', auth, requireRole('recruiter', 'admin'), getAnalytics);
```

---

### Pattern 5: Owner-Only Route
User can only access their own resources

```javascript
// In controller, not middleware
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  
  // Check if user owns this resource
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own profile'
    });
  }
  
  // Proceed with update...
};

router.put('/users/:userId', auth, updateProfile);
```

---

## 🎯 Real-World Examples

### Job Routes
```javascript
const auth = require('../middlewares/authMiddleware');
const { isRecruiter } = require('../middlewares/roleMiddleware');

// Public - Anyone can view jobs
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJob);

// Protected - Recruiters only
router.post('/jobs', auth, isRecruiter, createJob);
router.put('/jobs/:id', auth, isRecruiter, updateJob);
router.delete('/jobs/:id', auth, isRecruiter, deleteJob);
```

---

### Application Routes
```javascript
const auth = require('../middlewares/authMiddleware');
const { isCandidate, isRecruiter } = require('../middlewares/roleMiddleware');

// Candidate applies to job
router.post('/apply', auth, isCandidate, applyToJob);

// Recruiter views applications for their job
router.get('/job/:jobId/applications', auth, isRecruiter, getApplications);

// User views their own applications (any role)
router.get('/my-applications', auth, getMyApplications);
```

---

### Company Routes
```javascript
const auth = require('../middlewares/authMiddleware');
const { isRecruiter } = require('../middlewares/roleMiddleware');

// Public - Anyone can view companies
router.get('/companies', getCompanies);
router.get('/companies/:id', getCompany);

// Protected - Recruiters only
router.post('/companies', auth, isRecruiter, createCompany);
router.put('/companies/:id', auth, isRecruiter, updateCompany);
```

---

## ❌ Error Responses

### 401 Unauthorized (No/Invalid Token)
```json
{
  "success": false,
  "message": "No token provided"
}
```
**When:** User not logged in or token expired

---

### 403 Forbidden (Wrong Role)
```json
{
  "success": false,
  "message": "Access denied. Only recruiters can access this resource."
}
```
**When:** User logged in but lacks required role

---

## 🧪 Testing RBAC

### Test Case 1: Recruiter Creates Job
```bash
# Login as recruiter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recruiter@example.com","password":"password123"}'

# Expected: Access token returned

# Create job (with token)
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Developer","company":"Tech Corp"}'

# Expected: 200 OK
```

---

### Test Case 2: Candidate Tries to Create Job
```bash
# Login as candidate
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate@example.com","password":"password123"}'

# Create job (with candidate token)
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <candidate-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Developer","company":"Tech Corp"}'

# Expected: 403 Forbidden
```

---

### Test Case 3: Recruiter Tries to Apply
```bash
# Login as recruiter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recruiter@example.com","password":"password123"}'

# Apply to job (with recruiter token)
curl -X POST http://localhost:5000/api/applications/apply \
  -H "Authorization: Bearer <recruiter-token>" \
  -H "Content-Type: application/json" \
  -d '{"jobId":"123","resume":"resume.pdf"}'

# Expected: 403 Forbidden
```

---

## 🔧 Custom Role Middleware

Need a custom role check? Create a new middleware:

```javascript
// server/middlewares/roleMiddleware.js

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role?.toLowerCase() !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin access required.',
    });
  }

  next();
};

module.exports = {
  isRecruiter,
  isCandidate,
  requireRole,
  isAdmin, // Add new middleware
};
```

**Usage:**
```javascript
const { isAdmin } = require('../middlewares/roleMiddleware');
router.delete('/users/:id', auth, isAdmin, deleteUser);
```

---

## ⚠️ Best Practices

### ✅ DO
- Always use `auth` middleware before role middleware
- Keep role logic in middleware, not controllers
- Use descriptive error messages
- Return 403 for wrong role, 401 for no auth
- Test all role combinations

### ❌ DON'T
- Don't check roles in controllers
- Don't leak sensitive data in error messages
- Don't skip auth middleware before role checks
- Don't use role middleware without auth
- Don't hardcode role names (use constants)

---

## 📚 Middleware Chain Order

**Correct:**
```javascript
router.post('/jobs', auth, isRecruiter, createJob);
//                    ↑     ↑           ↑
//                    1st   2nd         3rd
```

**Incorrect:**
```javascript
router.post('/jobs', isRecruiter, auth, createJob); // ❌ Wrong order!
```

**Why?** `isRecruiter` needs `req.user` which is set by `auth`

---

## 🎓 Summary

| Middleware | Purpose | Returns | Use Case |
|------------|---------|---------|----------|
| `auth` | Verify JWT & load user | 401 | All protected routes |
| `isRecruiter` | Block non-recruiters | 403 | Recruiter-only actions |
| `isCandidate` | Block non-candidates | 403 | Candidate-only actions |
| `requireRole()` | Block specific roles | 403 | Multi-role or custom |

**Quick Rule:** `auth` → role check → controller

---

**Need Help?** Check [AUTH_IMPLEMENTATION_GUIDE.md](./AUTH_IMPLEMENTATION_GUIDE.md) for full details.
