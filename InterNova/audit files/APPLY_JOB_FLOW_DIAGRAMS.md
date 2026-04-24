# Apply Job Workflow - Architecture Diagrams

## 📊 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      CANDIDATE INTERFACE                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Job Details / Job Grid                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  Job Card  │  │  Job Card  │  │  Job Card  │                │
│  │            │  │            │  │            │                │
│  │ [Apply Now]│  │ [Apply Now]│  │ [Apply Now]│                │
│  └────────────┘  └────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ApplyJobModal Component                     │
│                                                                  │
│  1. useEffect: Check if user has already applied                │
│     └─> checkIfApplied(jobId)                                  │
│         └─> GET /api/applications/my                           │
│             └─> Returns: hasApplied = true/false               │
│                                                                  │
│  2. Render based on state:                                      │
│     ┌─────────────────┬──────────────────┐                     │
│     │  hasApplied     │  NOT applied      │                     │
│     ├─────────────────┼──────────────────┤                     │
│     │ "Already        │ "Send            │                     │
│     │  Applied"       │  Application"    │                     │
│     │  [Close]        │  [Submit]        │                     │
│     └─────────────────┴──────────────────┘                     │
│                                                                  │
│  3. On Submit:                                                   │
│     └─> applyForJob(jobId)                                     │
│         └─> POST /api/applications/apply                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND: Apply Controller                     │
│                                                                  │
│  Step 1: Validate jobId format                                  │
│          └─> Must be 24-char hex string                        │
│                                                                  │
│  Step 2: Find job in database                                   │
│          └─> Job.findById(jobId)                               │
│              ├─> Not found? → 404                              │
│              └─> Found → Continue                              │
│                                                                  │
│  Step 3: Validate job is ACTIVE                                 │
│          └─> if (job.status !== 'active')                     │
│              └─> Return 400 "Not accepting applications"       │
│                                                                  │
│  Step 4: Check for existing application                         │
│          └─> Application.findOne({candidateId, jobId})         │
│              ├─> Found? → 409 Conflict                         │
│              └─> Not found → Continue                          │
│                                                                  │
│  Step 5: Create application                                     │
│          └─> Application.create({                              │
│              candidateId,                                       │
│              jobId,                                             │
│              companyId,  ← NEW FIELD                           │
│              recruiterId                                        │
│          })                                                     │
│          ├─> Success → 201 Created                             │
│          └─> Duplicate key error (11000) → 409 Conflict        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB: applications                       │
│                                                                  │
│  Unique Index Validation:                                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  { candidateId: 1, jobId: 1 } [UNIQUE]              │      │
│  │  partialFilterExpression: { candidateId: {$exists} } │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  If duplicate detected:                                         │
│    └─> Throw MongoError code 11000                            │
│        └─> Controller catches → Return 409                     │
│                                                                  │
│  If unique:                                                     │
│    └─> Insert document                                         │
│        └─> Return success                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RECRUITER INTERFACE                            │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────────┐
│   Manage Jobs    │                    │  Manage Applicants   │
│                  │                    │                      │
│  GET /recruiter/ │                    │  GET /applications/  │
│       my-jobs    │                    │       job/:jobId     │
│                  │                    │                      │
│  For each job:   │                    │  1. Verify job owner │
│  - Count apps    │                    │  2. Fetch apps       │
│  - Show count    │                    │  3. Populate         │
│                  │                    │     candidate data   │
└──────────────────┘                    └──────────────────────┘
```

---

## 🔄 Duplicate Prevention Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Layer 1: Frontend Check                      │
│                                                                  │
│  useEffect(() => {                                               │
│    checkIfApplied(jobId)  ────────┐                            │
│  })                                │                            │
│                                    ▼                            │
│                          GET /applications/my                   │
│                                    │                            │
│                                    ▼                            │
│                          hasApplied = true/false                │
│                                    │                            │
│                          ┌─────────┴─────────┐                 │
│                          ▼                   ▼                 │
│                      Disable              Enable               │
│                      Button               Button               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (If user bypasses frontend)
┌─────────────────────────────────────────────────────────────────┐
│                  Layer 2: Application-Level Check                │
│                                                                  │
│  const existing = await Application.findOne({                   │
│    candidateId,                                                 │
│    jobId                                                        │
│  })                                                             │
│                                                                  │
│  if (existing) {                                                │
│    return res.status(409).json({                               │
│      message: 'Already applied'                                │
│    })                                                           │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (If race condition occurs)
┌─────────────────────────────────────────────────────────────────┐
│                  Layer 3: Database-Level Check                   │
│                                                                  │
│  MongoDB Unique Index:                                          │
│    { candidateId: 1, jobId: 1 } [UNIQUE]                       │
│                                                                  │
│  Two concurrent requests:                                       │
│    Request A ───┐                                               │
│    Request B ───┼──> MongoDB                                    │
│                 │                                               │
│                 ├─> First insert: SUCCESS                       │
│                 └─> Second insert: DUPLICATE KEY ERROR (11000)  │
│                                                                  │
│  Controller catches error:                                      │
│    if (err.code === 11000) {                                   │
│      return 409                                                │
│    }                                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow: Application Count

```
┌─────────────────────────────────────────────────────────────────┐
│                        Source of Truth                           │
│                     MongoDB: applications                        │
│                                                                  │
│  { candidateId: "abc", jobId: "job1", companyId: "comp1", ... } │
│  { candidateId: "def", jobId: "job1", companyId: "comp1", ... } │
│  { candidateId: "ghi", jobId: "job2", companyId: "comp1", ... } │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
┌──────────────────────────┐          ┌──────────────────────────┐
│  GET /recruiter/stats    │          │  GET /recruiter/my-jobs  │
│                          │          │                          │
│  1. Get all job IDs      │          │  For each job:           │
│     for recruiter        │          │                          │
│                          │          │  applicationCount =      │
│  2. Count applications:  │          │    Application           │
│     Application          │          │      .countDocuments({   │
│       .countDocuments({  │          │        jobId: job._id    │
│         jobId: {         │          │      })                  │
│           $in: jobIds    │          │                          │
│         }                │          │  Return jobs with counts │
│       })                 │          │                          │
│                          │          │                          │
│  3. Return total count   │          │                          │
└──────────────────────────┘          └──────────────────────────┘
        │                                           │
        ▼                                           ▼
┌──────────────────────────┐          ┌──────────────────────────┐
│   Stats Dashboard        │          │    Manage Jobs Page      │
│                          │          │                          │
│  Total Applications: 42  │          │  Job Title | Apps        │
│  Active Jobs: 5          │          │  ─────────────────────   │
│  Paused Jobs: 2          │          │  Frontend  |  12         │
│                          │          │  Backend   |   8         │
└──────────────────────────┘          │  DevOps    |  22         │
                                      └──────────────────────────┘
```

---

## 🎯 Frontend State Management

```
ApplyJobModal Component State:

┌─────────────────────────────────────────────────────────────────┐
│  State Variables:                                                │
│                                                                  │
│  1. isSubmitting: boolean                                        │
│     └─> Prevents double submission                             │
│                                                                  │
│  2. hasApplied: boolean                                          │
│     └─> Tracks if user already applied                         │
│                                                                  │
│  3. checkingStatus: boolean                                      │
│     └─> Shows loading state while checking                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  State Transitions:                                              │
│                                                                  │
│  Initial Mount:                                                  │
│    checkingStatus = true ──> Check API ──> checkingStatus = false│
│                                    │                            │
│                                    ▼                            │
│                              hasApplied = ?                     │
│                                                                  │
│  ┌────────────────────┬────────────────────┐                   │
│  │  hasApplied = true │ hasApplied = false │                   │
│  ├────────────────────┼────────────────────┤                   │
│  │ Show: "Already     │ Show: "Send        │                   │
│  │        Applied"    │        Application"│                   │
│  │ Button: Disabled   │ Button: Enabled    │                   │
│  └────────────────────┴────────────────────┘                   │
│                                    │                            │
│                                    ▼ User clicks                │
│                          isSubmitting = true                    │
│                                    │                            │
│                                    ▼ API call                   │
│                          ┌─────────┴─────────┐                 │
│                          ▼                   ▼                 │
│                     Success (201)      Conflict (409)          │
│                          │                   │                 │
│                          ▼                   ▼                 │
│                  hasApplied = true   hasApplied = true         │
│                  Redirect to         Show alert                │
│                  /applied-jobs       Close modal               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Validation Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     Security Validation Stack                    │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Authentication
├─> Middleware: protectCandidate
│   └─> Verifies JWT token
│   └─> Extracts candidateId from token
│   └─> Attaches req.candidate
│
Layer 2: Authorization
├─> Role check: Must be Candidate
│   └─> Recruiters cannot apply to jobs
│
Layer 3: Input Validation
├─> jobId format validation
│   └─> Must match /^[0-9a-fA-F]{24}$/
│
Layer 4: Business Logic Validation
├─> Job exists?
├─> Job is active?
├─> Already applied?
│
Layer 5: Database Constraints
└─> Unique index enforcement
    └─> Atomic duplicate prevention
```

---

## 📊 Database Schema Relationships

```
┌────────────────┐
│     User       │
│  (Candidate)   │
│                │
│  _id: ObjectId │◀─────────┐
│  username      │          │
│  email         │          │
│  role          │          │
└────────────────┘          │
                            │
                            │ candidateId
                            │
┌────────────────┐          │     ┌─────────────────┐
│     User       │          │     │  Application    │
│  (Recruiter)   │          │     │                 │
│                │          │     │  _id: ObjectId  │
│  _id: ObjectId │◀─────────┼─────│  candidateId ───┘
│  username      │ companyId│     │  jobId ─────────┐
│  email         │          │     │  companyId      │
│  role          │          │     │  recruiterId    │
└────────────────┘          │     │  status         │
        │                   │     │  appliedAt      │
        │ company           │     │  resume         │
        │                   │     └─────────────────┘
        ▼                   │              │
┌────────────────┐          │              │ jobId
│      Job       │          │              │
│                │          │              ▼
│  _id: ObjectId │◀─────────┘     Indexes:
│  title         │                • { candidateId, jobId } [UNIQUE]
│  company ──────┘                • { companyId, status }
│  status        │                • { jobId, status }
│  location      │                • { appliedAt: -1 }
└────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026
