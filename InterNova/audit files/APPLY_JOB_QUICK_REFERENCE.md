# Apply Job Workflow - Quick Reference Guide

## 🚀 Quick Start

### Run Migration (One-Time Setup)
```bash
cd server
node scripts/migrate-application-companyid.js
```

### Run Tests
```bash
bash audit\ files/test-apply-job-workflow.sh
```

---

## 📝 Key Changes Summary

### Backend
1. **Application Model**: Added `companyId` field + improved indexes
2. **Apply Controller**: HTTP 409 for duplicates, active job validation
3. **Migration Script**: Populates companyId in existing applications

### Frontend
1. **ApplyJobModal**: Checks if applied, disables button, handles 409
2. **Applications Service**: Added `checkIfApplied()` method

### Zero UI Changes
✅ All markup, styles, and layouts preserved exactly as-is

---

## 🔑 Key Features

### ✅ Duplicate Prevention
- **Database Level**: Unique compound index `(candidateId, jobId)`
- **Application Level**: Pre-check before insert
- **HTTP Status**: 409 Conflict for duplicates
- **Frontend**: Button disabled after successful application

### ✅ Data Accuracy
- **Applicant Count**: Real-time from Application.countDocuments()
- **Manage Jobs**: Shows accurate applicationCount per job
- **Manage Applicants**: Fetches with proper candidate population
- **Stats Dashboard**: Aggregates across all recruiter jobs

### ✅ User Experience
- **Already Applied Check**: Runs on modal open
- **Button States**: Loading, disabled, success states
- **Error Messages**: User-friendly, actionable
- **Immediate Feedback**: Success/error alerts

---

## 🎯 API Endpoints

### Candidate
```http
POST /api/applications/apply
Authorization: Bearer {candidate_token}
Body: { "jobId": "..." }

Response 201: Success
Response 409: Already applied
Response 400: Job not active
Response 404: Job not found
```

### Recruiter
```http
# Get job stats
GET /api/jobs/recruiter/stats
Authorization: Bearer {recruiter_token}

# Get my jobs with application counts
GET /api/jobs/recruiter/my-jobs
Authorization: Bearer {recruiter_token}

# Get applicants for a job
GET /api/applications/job/:jobId
Authorization: Bearer {recruiter_token}
```

---

## 🔍 Testing Checklist

- [ ] Apply to job → Success (201)
- [ ] Apply again → Conflict (409)
- [ ] Check Manage Jobs → Correct count
- [ ] Check Manage Applicants → Shows applicant
- [ ] Check candidate's Applied Jobs → Shows application
- [ ] Check Stats Dashboard → Accurate total
- [ ] Try applying to paused job → Error
- [ ] Frontend button disabled after apply
- [ ] Modal shows "Already Applied" state

---

## 🛠️ Troubleshooting

### "Duplicate key error" in logs
✅ **Expected!** This means the unique index is working.  
The controller catches this and returns 409.

### Frontend shows different count than backend
🔧 **Fix:** Refresh page. Backend is source of truth.

### Migration script shows "Job not found"
⚠️ **Normal.** These are orphaned applications (job was deleted).  
The script counts and reports these.

### Modal doesn't show "Already Applied"
🔧 **Check:** 
1. User is authenticated
2. Token is valid
3. /applications/my returns data
4. jobId matches correctly

---

## 📊 Database Indexes

```javascript
// Unique constraint (prevents duplicates)
{ candidateId: 1, jobId: 1 } [UNIQUE, partial]

// Performance indexes
{ candidateId: 1, status: 1 }
{ companyId: 1, status: 1 }
{ jobId: 1, status: 1 }
{ recruiterId: 1, status: 1 }
{ appliedAt: -1 }
```

---

## 🎯 Production Deployment

```bash
# 1. Backup database
mongodump --uri="mongodb://..." --out=backup_$(date +%Y%m%d)

# 2. Deploy backend
cd server && npm install && pm2 restart jobportal-api

# 3. Deploy frontend
cd client && npm install && npm run build

# 4. Run migration
cd server && node scripts/migrate-application-companyid.js

# 5. Verify
bash audit\ files/test-apply-job-workflow.sh
```

---

## ✅ Success Criteria

- [x] Applications stored correctly
- [x] Applicant count always accurate
- [x] Duplicate applications blocked
- [x] Manage Jobs analytics work
- [x] Manage Applicants page works
- [x] UI unchanged
- [x] No errors in console
- [x] Production-ready

---

## 📞 Quick Commands

```bash
# Check database indexes
mongosh jobportal
> db.applications.getIndexes()

# Check for applications without companyId
> db.applications.countDocuments({ companyId: { $exists: false } })

# Manually create index (if needed)
> db.applications.createIndex(
    { candidateId: 1, jobId: 1 },
    { unique: true, partialFilterExpression: { candidateId: { $exists: true } } }
  )
```

---

## 🎉 Status

**✅ COMPLETE** - All features implemented and tested  
**✅ PRODUCTION READY** - Ready for deployment  
**✅ ZERO UI CHANGES** - All requirements met

---

**Last Updated:** January 14, 2026  
**Version:** 1.0
