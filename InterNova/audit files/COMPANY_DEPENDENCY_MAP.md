# Company Dependency Map

## Executive Summary

**Date:** 2026-01-22  
**Status:** Schema Migration from Hybrid (User+Company) to Standalone Company Auth  
**Impact:** HIGH - Affects authentication, authorization, job linking, and all company-related features

---

## Schema Changes

### OLD SCHEMA (Hybrid Model)
```javascript
// Company.js - Profile data only, linked to User
{
  name: String,
  description: String,
  logo: String,
  website: String,
  location: String,
  owner: ObjectId (ref: 'User'), // ← Links to User model
  employees: String,
  establishedDate: String,
  workingDays: String,
  weekend: String,
  facebook: String,
  linkedin: String,
  whatsapp: String,
  gallery: [String]
}

// User.js - Has role='recruiter' for companies
{
  username: String,
  email: String (auth),
  password: String (auth),
  role: 'candidate' | 'recruiter', // ← Companies use 'recruiter'
  profilePicture: String
}
```

### NEW SCHEMA (Standalone Company Auth) ✅ IMPLEMENTED
```javascript
// Company.js - Standalone auth + profile
{
  // ===== AUTH (NEW) =====
  companyName: String (required),
  ownerName: String,
  email: String (required, unique, immutable),
  password: String (required, hashed),
  role: 'company' | 'recruiter',
  
  // ===== PROFILE =====
  establishedDate: Date,
  companyWebsite: String,
  companyDescription: String,
  logo: String,
  gallery: [String],
  employees: String,
  companyLocation: String,
  workingDays: String,
  weekend: String,
  phone: String,
  
  // ===== SOCIAL =====
  socialLinks: {
    facebook: String,
    linkedin: String,
    whatsapp: String
  },
  
  // ===== SECURITY =====
  twoStepVerification: Boolean,
  isActive: Boolean,
  
  // ===== METHODS =====
  comparePassword(password),
  generateAccessToken()
}
```

---

## Field Mapping (Old → New)

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `name` | `companyName` | ⚠️ **BREAKING**: Field renamed |
| `description` | `companyDescription` | ⚠️ **BREAKING**: Field renamed |
| `website` | `companyWebsite` | ⚠️ **BREAKING**: Field renamed |
| `location` | `companyLocation` | ⚠️ **BREAKING**: Field renamed |
| `owner` (User ref) | **REMOVED** | ⚠️ **BREAKING**: No longer links to User |
| `establishedDate` (String) | `establishedDate` (Date) | ⚠️ **BREAKING**: Type changed |
| `facebook` | `socialLinks.facebook` | ⚠️ **BREAKING**: Nested structure |
| `linkedin` | `socialLinks.linkedin` | ⚠️ **BREAKING**: Nested structure |
| `whatsapp` | `socialLinks.whatsapp` | ⚠️ **BREAKING**: Nested structure |
| N/A | `email` | ✅ NEW: Company has own email (not User.email) |
| N/A | `password` | ✅ NEW: Company has own password (not User.password) |
| N/A | `ownerName` | ✅ NEW: Owner's personal name |
| N/A | `phone` | ✅ NEW: Company phone (was User.phone) |

---

## Backend Dependencies

### 1. **Authentication Flow** ⚠️ HIGH PRIORITY

#### Current Implementation (BROKEN)
```javascript
// authController.js - Only handles User registration/login
POST /api/auth/register → Creates User with role='recruiter'
POST /api/auth/login → Authenticates User
GET /api/auth/me → Returns User data

// authMiddleware.js
- Verifies JWT
- Fetches User from database
- Attaches Company data if role='recruiter'
```

#### Required Changes
```javascript
// Need NEW endpoints for Company auth
POST /api/auth/company/register → Create Company (email, password, companyName)
POST /api/auth/company/login → Authenticate Company
GET /api/auth/company/me → Return Company data

// authMiddleware.js - MUST support both User and Company
- Check JWT payload.role: 'company'/'recruiter' vs 'candidate'
- Fetch from Company model if company, User model if candidate
- Return appropriate data structure
```

---

### 2. **Company Controllers** ⚠️ HIGH PRIORITY

**File:** `server/controllers/companyController.js`

| Function | Current Logic | Required Fix | Status |
|----------|---------------|--------------|--------|
| `getMyProfile` | Fetches User → finds Company by owner | Fetch Company directly by req.user._id | ❌ BROKEN |
| `updateMyProfile` | Updates User + Company (owner lookup) | Update Company fields only | ❌ BROKEN |
| `changePassword` | Updates User.password | Update Company.password | ❌ BROKEN |
| `getCompanies` | Finds all Company docs, populates owner | Find all Companies, use companyName/email | ❌ BROKEN |
| `getCompany` | Find by ID, populate owner (User) | Find by ID, no owner field | ❌ BROKEN |
| `getCompanyJobs` | Find jobs where job.company = company.owner | Find jobs where job.company = company._id | ⚠️ DEPENDS ON JOB MODEL |

**Field Usage Issues:**
- ❌ `company.name` → Should be `company.companyName`
- ❌ `company.owner` → Should be removed (no User linkage)
- ❌ `company.description` → Should be `company.companyDescription`
- ❌ `company.website` → Should be `company.companyWebsite`
- ❌ `company.location` → Should be `company.companyLocation`
- ❌ `company.facebook` → Should be `company.socialLinks.facebook`
- ❌ `company.linkedin` → Should be `company.socialLinks.linkedin`
- ❌ `company.whatsapp` → Should be `company.socialLinks.whatsapp`

---

### 3. **Job Model & Controllers** ⚠️ CRITICAL DECISION NEEDED

**Current State:**
```javascript
// Job.js
{
  company: { type: ObjectId, ref: 'User' } // ← References User (recruiter)
}

// jobController.js
- Creates job: company = req.user._id (User ID)
- Populates: .populate('company', 'username email profilePicture')
- Ownership check: job.company.toString() === req.user._id
```

**Problem:** Job references `User`, but companies are now standalone `Company` model.

**Option 1: Update Job.company to ref: 'Company'** (BREAKING CHANGE)
```javascript
company: { type: ObjectId, ref: 'Company' }

// CONS:
// - Violates "DO NOT CHANGE Job.js schema" constraint
// - Breaks all existing jobs in database
// - Requires data migration

// PROS:
// - Clean architecture
// - Direct company linking
```

**Option 2: Keep Job.company → User, Create "bridge" Company for each recruiter**
```javascript
// When Company registers:
// 1. Create Company document
// 2. Create matching User document (role='recruiter', email=Company.email)
// 3. Link: Company.userId = User._id

// CONS:
// - Redundant data (email/password in both models)
// - Complex sync logic
// - Not true standalone

// PROS:
// - No Job schema change
// - Backward compatible
```

**Option 3: Keep dual references (hybrid approach)**
```javascript
// Job.js
{
  company: { type: ObjectId, ref: 'User' }, // Legacy
  companyProfile: { type: ObjectId, ref: 'Company' } // New
}

// CONS:
// - Adds field to Job (violates constraint)
// - Migration needed

// PROS:
// - Gradual migration path
```

**⚠️ RECOMMENDATION:** Need clarification from user on Job.company field handling.

---

### 4. **Application Controller**

**File:** `server/controllers/applicationController.js`

**Current Issues:**
```javascript
Line 73:  const companyDoc = await Company.findOne({ owner: job.company })
Line 178: const companyDoc = await Company.findOne({ owner: job.company || job.recruiter })
Line 238: if (job.company.toString() !== req.user._id.toString())
Line 376: const companyDoc = await Company.findOne({ owner: app.jobId.company })
Line 460: if (job.company.toString() !== req.user._id.toString())
```

**Required Fixes:**
- Remove `owner` lookups
- Change ownership checks to compare Company._id instead of User._id
- Update companyDoc fetching logic

---

### 5. **Candidate Controller**

**File:** `server/controllers/candidateController.js`

**Current Issues:**
```javascript
Line 357: const companyDoc = await Company.findOne({ owner: job.company._id || job.company })
Line 361: if (job.company.username) companyName = job.company.username
Line 367: if (job.company.username) companyName = job.company.username
```

**Required Fixes:**
- Remove `owner` lookups
- Use `company.companyName` instead of `job.company.username`
- Update job population to use Company model if Job.company changes

---

### 6. **Auth Middleware**

**File:** `server/middlewares/authMiddleware.js`

**Current Implementation:**
```javascript
// Always fetches User model
req.user = await User.findById(decoded.id)

// If recruiter, attaches Company data
if (req.user.role === 'recruiter') {
  const company = await Company.findOne({ owner: req.user._id })
  req.user.company = { name: company.name, logo: company.logo }
}
```

**Required Changes:**
```javascript
// Check token payload for role/model type
const decoded = jwt.verify(token, secret)

if (decoded.role === 'company' || decoded.role === 'recruiter') {
  // Fetch from Company model
  req.user = await Company.findById(decoded.id).select('-password')
  req.user.userType = 'company'
} else if (decoded.role === 'candidate') {
  // Fetch from User model
  req.user = await User.findById(decoded.id).select('-password')
  req.user.userType = 'candidate'
}
```

---

### 7. **Role Middleware**

**File:** `server/middlewares/roleMiddleware.js`

**Current Logic:**
```javascript
isRecruiter: req.user.role === 'recruiter'
isCandidate: req.user.role === 'candidate'
```

**Required Updates:**
- Support `req.user.role === 'company'` for new Company auth
- Ensure `isRecruiter` accepts both 'recruiter' and 'company' roles
- Handle req.user from Company model (different fields than User)

---

### 8. **Routes**

**File:** `server/routes/companyRoutes.js`

**Current Endpoints:**
```javascript
GET    /api/companies          → getCompanies (public)
GET    /api/companies/:id      → getCompany (public)
GET    /api/companies/:id/jobs → getCompanyJobs (public)
GET    /api/companies/me       → getMyProfile (auth, recruiter)
PATCH  /api/companies/me       → updateMyProfile (auth, recruiter)
PATCH  /api/companies/change-password → changePassword (auth, recruiter)
POST   /api/companies          → createCompany (legacy)
```

**Required Changes:**
- Ensure `getMyProfile` works with Company model (no User)
- Ensure `updateMyProfile` updates Company fields directly
- Ensure `changePassword` updates Company.password

**⚠️ Auth endpoints need to be added:**
```javascript
POST /api/auth/company/register
POST /api/auth/company/login
GET  /api/auth/company/me
POST /api/auth/company/refresh-token
```

---

## Frontend Dependencies

### 1. **Services**

**File:** `client/src/services/companies.service.js`

**Functions:**
- `getMyProfile()` → GET /api/companies/me
- `updateMyProfile(formData)` → PATCH /api/companies/me
- `changePassword(passwords)` → PATCH /api/companies/change-password
- `listCompanies({ page, limit, sortBy, order })` → GET /api/companies
- `getCompany(companyId)` → GET /api/companies/:id
- `getCompanyJobs(companyId, { page, limit })` → GET /api/companies/:id/jobs

**Required Changes:**
- **API Response Mapping:** Backend now returns different field names
  - `response.data.company.name` → `response.data.companyName`
  - `response.data.company.description` → `response.data.companyDescription`
  - etc.

---

### 2. **Components**

#### CompanyCard.jsx
**Current Usage:**
```jsx
companyName: company?.companyName || 'Company Name'
logo: company?.logo
location: company?.location
openJobsCount: company?.openJobsCount
```

**Status:** ✅ Already uses `companyName` (correct for new schema!)

---

#### CompanyProfile.jsx
**Current Usage:**
```jsx
formData: {
  username: profile.user?.username,
  phone: profile.user?.phone,
  location: profile.user?.location,
  about: profile.user?.about,
  companyName: profile.company?.name, // ❌ BROKEN
  companyDescription: profile.company?.description, // ❌ BROKEN
  companyWebsite: profile.company?.website, // ❌ BROKEN
  companyLocation: profile.company?.location, // ❌ BROKEN
  facebook: profile.company?.facebook, // ❌ BROKEN
  linkedin: profile.company?.linkedin, // ❌ BROKEN
  whatsapp: profile.company?.whatsapp // ❌ BROKEN
}
```

**Required Changes:**
- Backend `/api/companies/me` should return Company directly (no `user` + `company` split)
- Frontend should expect:
  ```jsx
  {
    companyName: profile.companyName,
    email: profile.email, // NEW
    ownerName: profile.ownerName, // NEW
    phone: profile.phone,
    companyLocation: profile.companyLocation,
    facebook: profile.socialLinks.facebook,
    linkedin: profile.socialLinks.linkedin,
    // etc.
  }
  ```

---

#### CompanyDetails.jsx
**Current Usage:**
```jsx
company.companyName
company.logo
company.website
company.location
company.employees
company.establishedDate
company.workingDays
company.weekend
company.facebook
company.linkedin
company.whatsapp
company.gallery
```

**Required Changes:**
- ❌ `company.facebook` → `company.socialLinks.facebook`
- ❌ `company.linkedin` → `company.socialLinks.linkedin`
- ❌ `company.whatsapp` → `company.socialLinks.whatsapp`
- ✅ Other fields match (companyName, logo, etc.)

---

#### CompanyList.jsx
**Current Usage:**
```jsx
sortBy === 'companyName'
companies.map(company => <CompanyCard company={company} />)
```

**Status:** ✅ Uses `companyName` (correct!)

---

### 3. **Auth Context**

**File:** `client/src/context/AuthContext.jsx`

**Current Logic:**
```javascript
// Login/Register uses /api/auth/register (User model)
// Stores user data with role='candidate'/'recruiter'
```

**Required Changes:**
- **Separate login flows:**
  - Candidate → `/api/auth/login` (User model)
  - Company → `/api/auth/company/login` (Company model)
- **Token payload:** Should indicate which model (User vs Company)
- **Context state:** Should handle both user types

---

### 4. **Navbar**

**File:** `client/src/components/layout/Navbar.jsx`

**Current Logic:**
```jsx
// Shows user.profilePicture or user.company.logo
// Shows user.username or user.company.name
```

**Required Changes:**
- If authenticated as Company:
  - Show `company.logo`
  - Show `company.companyName`
  - No need for `user.username`

---

## Data Flow Analysis

### 1. Company Registration Flow

**OLD:**
```
User fills form → POST /api/auth/register 
→ Creates User (role='recruiter')
→ JWT signed with User._id
→ Frontend stores User data
→ Redirects to dashboard
→ User creates Company profile later (optional)
```

**NEW (Required):**
```
Company fills form → POST /api/auth/company/register
→ Creates Company (email, password, companyName, etc.)
→ JWT signed with Company._id and role='company'
→ Frontend stores Company data
→ Redirects to company dashboard
```

---

### 2. Company Login Flow

**OLD:**
```
Enter email/password → POST /api/auth/login
→ Finds User by email
→ Compares User.password
→ Returns User data + Company if exists
```

**NEW (Required):**
```
Enter email/password → POST /api/auth/company/login
→ Finds Company by email
→ Compares Company.password
→ Returns Company data only
```

---

### 3. Create Job Flow

**OLD:**
```
Company logged in (as User with role='recruiter')
→ POST /api/jobs
→ job.company = req.user._id (User ID)
→ Job references User model
```

**NEW:**
```
Company logged in (Company model, _id = Company._id)
→ POST /api/jobs
→ job.company = ??? 
  Option A: req.user._id (Company ID) ← Breaks Job.company ref: 'User'
  Option B: Create shadow User for Company
```

**⚠️ BLOCKER:** Need to resolve Job.company reference issue!

---

### 4. Manage Jobs Flow

**OLD:**
```
GET /api/jobs/my-jobs
→ Finds jobs where job.company = req.user._id (User ID)
→ Populates company (User) → username, email
```

**NEW:**
```
GET /api/jobs/my-jobs
→ req.user._id is Company._id
→ Finds jobs where job.company = Company._id (if Job model updated)
→ Populates company (Company) → companyName, email
```

---

### 5. View Company Profile (Public)

**OLD:**
```
GET /api/companies/:id
→ Find Company by _id
→ Populate company.owner (User) → username, email
→ Find jobs where job.company = company.owner._id
→ Return: { company + owner + jobs }
```

**NEW:**
```
GET /api/companies/:id
→ Find Company by _id
→ No owner field (standalone)
→ Find jobs where job.company = company._id
→ Return: { company + jobs }
```

---

## Required Field Handling

### Fields That Must Have Fallbacks

| Field | Required in Schema? | Frontend Default | Backend Default |
|-------|---------------------|------------------|-----------------|
| `companyName` | ✅ Yes | 'Company Name' | N/A (required) |
| `email` | ✅ Yes | N/A | N/A (required) |
| `password` | ✅ Yes | N/A | N/A (required) |
| `ownerName` | ❌ No | '' | undefined/null |
| `phone` | ❌ No | '' | undefined/null |
| `companyLocation` | ❌ No | 'Location not specified' | undefined/null |
| `logo` | ❌ No (default: '') | '/assets/images/featured-job/img-01.png' | '' |
| `gallery` | ❌ No (default: []) | [] | [] |
| `employees` | ❌ No | 'N/A' | undefined/null |
| `establishedDate` | ❌ No | 'N/A' | undefined/null |
| `socialLinks.facebook` | ❌ No | '' | undefined/null |
| `socialLinks.linkedin` | ❌ No | '' | undefined/null |
| `socialLinks.whatsapp` | ❌ No | '' | undefined/null |

---

## Population Logic Changes

### OLD Population Queries
```javascript
// Get jobs with company info
Job.find().populate('company', 'username email profilePicture')
// Returns: job.company = { _id, username, email, profilePicture }

// Get company with owner
Company.findById(id).populate('owner', 'email username')
// Returns: company.owner = { _id, email, username }
```

### NEW Population Queries (If Job.company → Company)
```javascript
// Get jobs with company info
Job.find().populate('company', 'companyName email logo')
// Returns: job.company = { _id, companyName, email, logo }

// Get company (no owner)
Company.findById(id) // No populate needed
// Returns: { _id, companyName, email, ... }
```

---

## Ownership Checks

### OLD Ownership Logic
```javascript
// Check if user owns the job
if (job.company.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: 'Not authorized' })
}
// Works because:
// - job.company = User._id (recruiter)
// - req.user = User document
// - req.user._id = User._id
```

### NEW Ownership Logic (Option A: Job.company → Company)
```javascript
// Check if company owns the job
if (job.company.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: 'Not authorized' })
}
// Works because:
// - job.company = Company._id
// - req.user = Company document
// - req.user._id = Company._id
```

### NEW Ownership Logic (Option B: Job.company → User, Company has userId)
```javascript
// Check if company's linked user owns the job
const company = await Company.findById(req.user._id).select('userId')
if (job.company.toString() !== company.userId.toString()) {
  return res.status(403).json({ message: 'Not authorized' })
}
// More complex, requires Company.userId field
```

---

## Image Handling

### Logo Handling
- **OLD:** User.profilePicture → copied to Company.logo
- **NEW:** Company.logo (standalone, no User linkage)
- **Upload endpoint:** `/api/companies/me` (PATCH with multipart/form-data)
- **Storage:** `/uploads/profile-pics/` or `/uploads/logos/`
- **Normalization:** `normalizeImageUrl()` function ensures `/` prefix

### Gallery Handling
- **Field:** `Company.gallery: [String]`
- **Max images:** 3 (enforced in frontend)
- **Upload:** Same endpoint, field name `galleryImages`
- **Storage:** `/uploads/gallery/`

---

## Critical Issues Summary

### 🔴 BLOCKER Issues

1. **Job.company Reference Mismatch**
   - **Problem:** Job model references `User`, but companies are now standalone `Company` model
   - **Impact:** Cannot create jobs, cannot query jobs by company
   - **Options:**
     - A) Update Job.company to ref: 'Company' (violates "no Job schema change")
     - B) Create shadow User for each Company (redundant data)
     - C) Add dual reference field (violates "no Job schema change")
   - **Status:** ⚠️ **NEEDS USER DECISION**

2. **Missing Company Auth Endpoints**
   - **Problem:** No registration/login for Company model
   - **Impact:** Cannot authenticate as Company
   - **Fix:** Create new auth endpoints in authController
   - **Status:** ❌ **TODO**

3. **Auth Middleware Only Handles User Model**
   - **Problem:** Always fetches User, doesn't know about Company model
   - **Impact:** Company auth tokens will fail
   - **Fix:** Update middleware to check token role and fetch correct model
   - **Status:** ❌ **TODO**

---

### 🟡 HIGH Priority Fixes

4. **Company Controller Field Mapping**
   - **Problem:** Uses old field names (name, description, etc.)
   - **Impact:** API returns wrong field names, frontend breaks
   - **Fix:** Update all field references to new schema
   - **Files:**
     - `server/controllers/companyController.js`
     - `server/controllers/candidateController.js`
     - `server/controllers/applicationController.js`
   - **Status:** ❌ **TODO**

5. **Frontend Response Mapping**
   - **Problem:** Expects `company.name`, receives `companyName`
   - **Impact:** UI shows missing/wrong data
   - **Fix:** Update frontend to use new field names
   - **Files:**
     - `client/src/pages/companies/CompanyProfile.jsx`
     - `client/src/pages/companies/CompanyDetails.jsx`
   - **Status:** ❌ **TODO**

6. **Social Links Nested Structure**
   - **Problem:** Frontend expects `company.facebook`, backend has `company.socialLinks.facebook`
   - **Impact:** Social links don't display
   - **Fix:** Update frontend to access nested structure
   - **Status:** ❌ **TODO**

---

### 🟢 MEDIUM Priority Fixes

7. **Job Population Queries**
   - **Problem:** Populates `company` with User fields (username, email)
   - **Impact:** Wrong data in job listings
   - **Fix:** Update populate to use Company fields (companyName, email, logo)
   - **Status:** ⚠️ **DEPENDS ON JOB MODEL DECISION**

8. **Company List Sorting**
   - **Problem:** Sorts by `name`, should be `companyName`
   - **Impact:** Sorting may fail
   - **Fix:** Update sort field mapping in backend
   - **Status:** ❌ **TODO**

9. **Owner Field Removal**
   - **Problem:** Many queries use `Company.findOne({ owner: userId })`
   - **Impact:** Queries will fail (no owner field)
   - **Fix:** Remove all owner lookups, use Company._id directly
   - **Status:** ❌ **TODO**

---

## Recommended Implementation Order

### Phase 1: Core Auth (PRIORITY 1) 🔴
1. ✅ Update Company.js schema (DONE)
2. ❌ Create Company registration endpoint (`POST /api/auth/company/register`)
3. ❌ Create Company login endpoint (`POST /api/auth/company/login`)
4. ❌ Update authMiddleware to support both User and Company
5. ❌ Update roleMiddleware to handle 'company' role
6. ❌ Test auth flow end-to-end

### Phase 2: Resolve Job Model Issue (BLOCKER) 🔴
**⚠️ REQUIRES USER DECISION**
- Option A: Update Job.company to ref: 'Company'
- Option B: Create shadow User for each Company
- Option C: Add companyProfile field to Job model

### Phase 3: Company Controller Fixes (PRIORITY 2) 🟡
1. ❌ Update `getMyProfile` to fetch Company directly (no User)
2. ❌ Update `updateMyProfile` to update Company fields
3. ❌ Update `changePassword` to update Company.password
4. ❌ Update `getCompanies` to use companyName, remove owner
5. ❌ Update `getCompany` to remove owner population
6. ❌ Update `getCompanyJobs` to query jobs correctly

### Phase 4: Application & Candidate Controllers (PRIORITY 2) 🟡
1. ❌ Remove all `Company.findOne({ owner: ... })` queries
2. ❌ Update companyName extraction logic
3. ❌ Update ownership checks

### Phase 5: Frontend Updates (PRIORITY 3) 🟢
1. ❌ Update CompanyProfile.jsx to use new field structure
2. ❌ Update CompanyDetails.jsx to access socialLinks correctly
3. ❌ Update AuthContext for dual login flows
4. ❌ Update Navbar to handle Company auth

### Phase 6: Testing & Validation
1. ❌ Test Company registration
2. ❌ Test Company login
3. ❌ Test Company profile CRUD
4. ❌ Test Job creation/management
5. ❌ Test Application flow
6. ❌ Test public company listing/details

---

## Breaking Changes Checklist

### Database
- [ ] Existing Company documents have old field names → Need migration
- [ ] Existing Jobs reference User IDs → May need migration
- [ ] No email/password in existing Company docs → Cannot login without migration

### API Responses
- [ ] `/api/companies` returns `name` → Now `companyName`
- [ ] `/api/companies/:id` returns `owner` → Now removed
- [ ] `/api/companies/me` returns `{ user, company }` → Now just Company
- [ ] Social links now nested in `socialLinks` object

### Frontend
- [ ] All references to `company.name` must change to `companyName`
- [ ] All references to `company.facebook` must change to `company.socialLinks.facebook`
- [ ] Company profile form must use new field names

### Authentication
- [ ] New JWT payload structure for Company
- [ ] Separate login endpoints
- [ ] Different user object structure in context

---

## Final Notes

### Constraints (Per User Requirements)
- ✅ Company.js schema updated as specified
- ⚠️ User.js, Candidate.js, Application.js must NOT change
- ⚠️ Job.js constraint unclear (company field needs discussion)
- ✅ UI design must NOT change (only field mapping)
- ✅ Business logic must NOT change (only implementation)

### Risks
- **HIGH:** Job.company reference mismatch could block all job features
- **MEDIUM:** Missing data migration could break existing companies
- **LOW:** Frontend field mapping is straightforward

### Success Criteria
- [ ] Companies can register and login independently
- [ ] Company profile CRUD works with new schema
- [ ] Jobs can be created and managed by companies
- [ ] Applications work correctly
- [ ] Public company listing/details work
- [ ] No console errors
- [ ] No runtime crashes
- [ ] All UI displays correctly

---

**END OF DEPENDENCY MAP**
