# InterNova: Job and Application System Flow

This document details the technical implementation of the Job Circular and Application lifecycles within the InterNova MERN stack application.

## 1. Job Circular Lifecycle

### A. Creation (Recruiter)
*   **Frontend:** `PostJob.jsx` collects data and interacts with `jobs.service.js`.
*   **Backend:** `jobController.js -> createJob` validates inputs using `express-validator`.
*   **Security:** The system ignores the `company` field in the request body and enforces the authenticated user's ID (`req.user._id`) as the owner.
*   **Data Model:** Stored in the `Job` collection with attributes for title, category, vacancy, location, and salary.

### B. Discovery (Public/Candidate)
*   **Filtering:** `useJobFilters.js` custom hook manages URL sync and debounced search for `keyword`, `location`, and `category`.
*   **Backend Query:** `jobController.js -> getJobs` builds a dynamic `$and` query.
*   **Population:** Uses Mongoose `.populate()` to join `User` data (Company name/logo) into the `Job` response.

### C. Management (Recruiter)
*   **Monitoring:** `ManageJobs.jsx` displays active/paused status and real-time application counts using Mongoose virtuals.
*   **State Control:** `updateJobStatus` (`PATCH /api/jobs/:id/status`) allows recruiters to toggle job visibility.

---

## 2. Application Lifecycle

### A. Submission (Candidate)
*   **Frontend:** `ApplyJobModal.jsx` handles the submission UI.
*   **Protection:** Gated by `protectCandidate` middleware to prevent Recruiters from applying.
*   **Logic:** `applicationController.js -> apply` prevents duplicate applications using a unique compound index on `{ candidateId, jobId }`.
*   **Attachments:** Automatically attaches the candidate's default resume from their profile if not overridden.

### B. Review (Recruiter)
*   **Management:** `ManageApplicants.jsx` lists all candidates for a specific job.
*   **Hybrid Population:** The backend handles cases where candidate data might be in the specialized `Candidate` model or the base `User` model.

### C. Status Workflow
*   **Transitions:** `pending` -> `shortlisted` / `rejected` -> `accepted`.
*   **Persistence:** Updated via `PUT /api/applications/:id/status`.

---

## 3. Core Technical Aspects

| Feature | Implementation Detail |
| :--- | :--- |
| **RBAC** | Gated by `isRecruiter` and `isCandidate` middlewares in `roleMiddleware.js`. |
| **Authentication** | JWT-based with `accessToken` (15m) and `refreshToken` (7d) rotation. |
| **Silent Auth** | Axios interceptors in `api.js` handle automatic token refreshing. |
| **Image Processing** | `sharp` middleware resizes and crops profile pics/logos to consistent dimensions. |
| **Data Integrity** | `districtValidator.js` ensures all location data matches the standard 64 districts of Bangladesh. |
