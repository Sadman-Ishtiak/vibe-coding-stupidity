Profile Completion — internNova

Overview
--------
This document describes how profile completion is calculated for Candidates and Companies, how the server evaluates it, and a precise checklist to reach 100% completion.

Where the logic lives
---------------------
- Server implementation: `server/utils/profileCompletion.js`
- Middleware that enforces completion: `server/middleware/profileCompletionGuard.js`

The server exposes checks when users attempt actions that require a complete profile (e.g., apply for jobs or post jobs). The guard middleware uses the utility functions to compute a percentage (0-100).

How the calculation works (weights)
----------------------------------
Candidate (total 100%) — weights and rules:
- Basic Info (25%) — 4 fields equally weighted (6.25% each):
  - `username` (or display name)
  - `email`
  - `phone`
  - `profilePicture` or `profileImage`
  Basic info score = (number of completed basic fields / 4) * 25

- Education (20%) — +20% if `education` is a non-empty array
- Skills (20%) — +20% if `skills` is a non-empty array
- Experience OR Internships (15%) — +15% if `experience` OR `internships` is a non-empty array
- Resume Upload (10%) — +10% if `resume` exists (string path or object with fileUrl)
- Location & Preferences (10%) — 2 fields equally weighted (5% each):
  - `location`
  - `jobTypePreference`
  Combined score = (completed / 2) * 10

Company (total 100%) — weights and rules:
- Basic Info (25%) — 4 fields equally weighted (6.25% each):
  - `companyName` (or `userId.name`/`username` fallback)
  - `email` (or `userId.email` fallback)
  - `phone`
  - `logo`
  Basic info score = (completed / 4) * 25

- Company Details (20%) — 3 fields equally weighted (~6.66% each):
  - `companyDescription` (or `description`)
  - `companyWebsite` (or `website`)
  - `establishedDate`
  Score = (completed / 3) * 20

- Location & Size (15%) — 2 fields equally weighted (7.5% each):
  - `companyLocation` (or `location`)
  - `employees` (or `numberOfEmployees`)
  Score = (completed / 2) * 15

- Working Schedule (15%) — full 15% if `workingSchedule` exists and at least 5 days have `isOpen === true`.

- Social & Branding (10%) — full 10% if at least one social link (linkedin/twitter/facebook) OR `gallery` array has at least one image.

- Verification & Status (15%) — 2 boolean checks (7.5% each):
  - `company.isActive !== false` (account active)
  - `company.userId?.isVerified` (linked user is verified)
  Score = (completed / 2) * 15

Notes about rounding: final percentage is rounded with `Math.round`.

Concrete checklist to reach 100%
-------------------------------
Candidate (step-by-step — check and complete each item):
1. Account & Email
   - Verify your email address via OTP (this sets `isEmailVerified`).
   - Ensure the `email` field is present on your profile.

2. Display & Contact
   - Set `username` (or firstName/lastName shown as username).
   - Add `phone` number.
   - Upload a `profilePicture` or set `profileImage`.

3. Education
   - Add at least one entry to your `education` array (school, degree, start/end years).

4. Skills
   - Add at least one skill in the `skills` array.

5. Experience / Internship
   - Add at least one entry in `experience` OR `internships` array. Either satisfies this category.

6. Resume
   - Upload a resume. The server recognizes `resume` as either a string (path/url) or an object with `fileUrl`.

7. Location & Preferences
   - Set `location` (city/district) and `jobTypePreference` (e.g., Full-time/Part-time/Remote).

If all the above are present, the candidate's computed score will be 100%.

Company (step-by-step — check and complete each item):
1. Account & Email
   - Verify the company's account email (linked `User.isEmailVerified`).
   - Ensure `company.email` exists on the Company profile (or `userId.email`).

2. Basic Identity
   - Set `companyName`.
   - Add a `phone` number.
   - Upload a `logo` image.

3. Company Details
   - Fill `companyDescription` (what you do, mission)
   - Add `companyWebsite` (valid URL)
   - Set `establishedDate` (date/company founding year)

4. Location & Size
   - Set `companyLocation` (city/district) and `employees` (e.g., "50-100").

5. Working Schedule
   - Configure `workingSchedule` so that at least 5 weekdays have `isOpen: true` (Mon–Fri typical). This gives full 15% for schedule.

6. Social & Branding
   - Add at least one social link (LinkedIn/Twitter/Facebook) under `socialLinks`, OR
   - Upload at least one gallery image in `gallery`.

7. Verification & Status
   - Ensure `company.isActive` is true (account not deactivated).
   - Ensure the linked `userId` (User) is verified (`userId.isVerified` true). Email verification is usually the way to satisfy this.

If all the above are present, the company's computed score will be 100%.

How to check your current computed score (developer and user tips)
-----------------------------------------------------------------
- API quick check (developer):
  - If you have an authenticated session token, `GET /api/auth/me` returns user/company payload. The profile response may include profile fields.
  - There is no single persisted `profileCompletion` field guaranteed to be up-to-date in DB; the server calculates percentages via `calculateCandidateProfileCompletion` and `calculateCompanyProfileCompletion` when needed (middleware or helpers).

- Manual check via Mongo shell or DB GUI:
  - Inspect your `candidates` or `companies` document and verify the fields listed in the checklist are present and non-empty.

- Quick programmatic check (Node script example):
  - Use `require('./server/utils/profileCompletion')` server-side to call the function with the fetched document to compute the score.

Common pitfalls & debugging
--------------------------
- Empty arrays vs missing fields: the utilities expect arrays for `education`, `skills`, `experience`, `gallery`. A field that exists but is an empty array counts as incomplete.
- Resume format: `resume` can be a simple string path or an object with `fileUrl`. Verify the field's structure matches what the upload routine produces.
- Working schedule detection: ensure days in `workingSchedule` have `isOpen: true`. The check is strict: it counts `day.isOpen === true` values.
- Verification flag for companies: `company.userId?.isVerified` must be true — ensure the linked `User` record has `isVerified`/`isEmailVerified` set by the OTP verification flow.

How the guard middleware enforces completion
-------------------------------------------
- `requireCandidateProfileComplete` and `requireCompanyProfileComplete` are middleware functions used by routes that require a complete profile (e.g., apply/post job routes).
- They fetch the Candidate/Company profile by `userId`, compute the percentage using the utility functions, and if it is below 100, they return a 403 with `profileCompletion` and `redirectTo` so the frontend can redirect users to profile editing pages.

Practical advice to reach 100% faster
-------------------------------------
- Fill basic contact info first (quick wins for the 25% basic bucket).
- Add skills and at least one education/experience entry — these are big buckets (20% each).
- Upload resume and logo/gallery images (10% and branding 10%).
- For companies: configure working schedule and add website/description.
- Verify your email immediately after registration to unlock the verification bucket.

Sample candidate completion checklist (short):
- [ ] Email verified
- [ ] Username set
- [ ] Phone number added
- [ ] Profile picture uploaded
- [ ] Education added
- [ ] Skills added
- [ ] Experience or Internship added
- [ ] Resume uploaded
- [ ] Location and job preferences set

Sample company completion checklist (short):
- [ ] Email verified (linked User verified)
- [ ] Company name set
- [ ] Phone number added
- [ ] Logo uploaded
- [ ] Company description written
- [ ] Website added
- [ ] Established date set
- [ ] Company location added
- [ ] Employee size added
- [ ] Working schedule (≥5 open days)
- [ ] Social link or gallery image added
- [ ] Account active

How I can help next
-------------------
- Add a small endpoint `/api/profile/completion` that returns the computed percentage for the currently authenticated user (candidate or company). This provides a single place the frontend can call to show a progress bar.
- Add a UI checklist on the frontend that maps each required field to the completion percent and guides users step-by-step.

---
File generated programmatically by the development assistant. Follow the checklists above to reach 100% profile completion for both account types.