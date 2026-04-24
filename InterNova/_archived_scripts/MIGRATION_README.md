# Recruiter to Company Migration

## Overview

This one-time migration safely moves incorrectly stored recruiter records from the **Candidate** collection to the **Company** collection.

### Problem
Some users with `role="recruiter"` were incorrectly stored in the Candidate collection during signup. This migration fixes that data inconsistency.

### Solution
- Identifies all Candidate records linked to recruiter Users
- Creates corresponding Company records
- Removes the wrong Candidate records
- Maintains full audit trail and backup

---

## CRITICAL RULES ✋

- ✅ **NO schema changes** - Works with existing schemas
- ✅ **NO User deletions** - Users remain intact
- ✅ **NO Candidate functionality changes** - Business logic untouched
- ✅ **Fully logged and reversible** - Complete audit trail
- ✅ **Safe for production** - Includes backup and dry-run

---

## Migration Steps

### Step 1: Dry Run (Preview)

**ALWAYS run this first** to see what will happen without making changes:

```bash
cd /home/khan/Downloads/InterNova
node scripts/migrate-recruiters-to-company-dryrun.js
```

**Output:**
- Shows all wrong Candidate records
- Displays what Company records will be created
- Checks for existing Companies (avoids duplicates)
- Shows migration summary

### Step 2: Review Dry Run Output

Check the output carefully:
- Verify the email addresses are correct
- Confirm these are indeed recruiter accounts
- Note how many records will be migrated

### Step 3: Run Migration

Once you're confident:

```bash
node scripts/migrate-recruiters-to-company.js
```

**What happens:**
1. Connects to MongoDB
2. Identifies wrong records
3. **Creates backup JSON file** (automatic)
4. Waits 5 seconds (last chance to cancel with Ctrl+C)
5. Creates Company documents
6. Removes wrong Candidate records
7. Saves migration log
8. Displays summary

### Step 4: Verify Results

After migration:

```bash
# Check MongoDB directly
mongo
use internova
db.companies.find({ owner: { $exists: true } }).count()
db.candidates.find({ email: "recruiter@example.com" })  # Should be empty
```

---

## Backup & Logs

All backups and logs are stored in:
```
scripts/migration-backups/
├── recruiter-candidates-backup-[timestamp].json
└── migration-log-[timestamp].json
```

### Backup File Contains:
- Original Candidate document (full)
- User data (username, email, role)
- IDs for rollback reference
- Timestamp

### Log File Contains:
- Migration start/end time
- Total processed count
- Success/failure status for each record
- Detailed error messages
- New Company IDs created

---

## Migration Logic

### Identification Criteria
```javascript
// Find Users with role="recruiter"
const recruiterUsers = await User.find({ role: 'recruiter' });

// Find Candidates with matching emails (WRONG)
const wrongCandidates = await Candidate.find({
  email: { $in: recruiterEmails }
});
```

### Company Creation Mapping
```javascript
Company = {
  name: user.username,              // From User
  description: candidate.about,     // From Candidate
  location: candidate.location,     // From Candidate
  logo: candidate.profileImage,     // From Candidate
  owner: user._id,                  // Link to User
  // Other fields: default or empty
}
```

### Safe Cleanup
- Only deletes Candidate records **after** successful Company creation
- Logs every deletion
- Never touches legitimate candidate profiles

---

## Rollback (If Needed)

If something goes wrong, you can manually rollback:

1. **Restore Candidates:**
```javascript
// Use backup JSON to restore
const backup = require('./migration-backups/recruiter-candidates-backup-[timestamp].json');
for (const record of backup) {
  await Candidate.create(record.candidateData);
}
```

2. **Remove Created Companies:**
```javascript
// Use log to find created Company IDs
const log = require('./migration-backups/migration-log-[timestamp].json');
for (const detail of log.details) {
  if (detail.status === 'success') {
    await Company.deleteOne({ _id: detail.newCompanyId });
  }
}
```

---

## Expected Results

### Before Migration:
```
Users Collection:
  - user@example.com (role: recruiter) ✓

Candidates Collection:
  - user@example.com (firstName, lastName, etc.) ✗ WRONG

Companies Collection:
  - (empty for this user) ✗
```

### After Migration:
```
Users Collection:
  - user@example.com (role: recruiter) ✓ (unchanged)

Candidates Collection:
  - (no entry for user@example.com) ✓

Companies Collection:
  - Company Name (owner: user._id) ✓ NEW
```

---

## Safety Features

1. **Automatic Backup** - Before any writes
2. **Dry Run Mode** - Preview without changes
3. **5-Second Wait** - Cancellation window
4. **Duplicate Check** - Won't create duplicate Companies
5. **Granular Logging** - Every operation logged
6. **Error Handling** - Continues on individual failures
7. **No Schema Changes** - Works with existing structure

---

## Error Handling

The migration continues even if individual records fail:

- **Company Already Exists**: Skips (logs as "skipped")
- **Validation Error**: Logs error, continues with next
- **Database Error**: Logs error, continues with next

All errors are recorded in the log file for review.

---

## Testing Recommendations

### Test on Staging First
1. Clone production database to staging
2. Run dry run on staging
3. Run migration on staging
4. Verify results
5. Then run on production

### Manual Verification Queries
```javascript
// Count recruiters with wrong Candidates (should be 0 after migration)
db.users.aggregate([
  { $match: { role: "recruiter" } },
  { $lookup: {
      from: "candidates",
      localField: "email",
      foreignField: "email",
      as: "wrongCandidate"
  }},
  { $match: { "wrongCandidate.0": { $exists: true } }},
  { $count: "wrongRecords" }
]);

// Count recruiters with Companies (should match recruiter count)
db.companies.countDocuments({ owner: { $exists: true } });
```

---

## Support

### If Migration Fails:
1. Check `migration-log-[timestamp].json` for errors
2. Backup is in `recruiter-candidates-backup-[timestamp].json`
3. Database remains in consistent state (atomic operations per record)
4. Contact developer with log file

### If You Need to Re-run:
- Safe to run multiple times
- Checks for existing Companies (won't duplicate)
- Only processes records that haven't been migrated

---

## Technical Notes

### Dependencies
- mongoose
- dotenv
- fs (built-in)
- path (built-in)

### Environment Variables Required
```env
MONGO_URI=mongodb://...
```

### Models Used (READ-ONLY)
- User (server/models/User.js)
- Candidate (server/models/Candidate.js)
- Company (server/models/Company.js)

**NO models are modified by this script.**

---

## Checklist

- [ ] Run dry run first
- [ ] Review output carefully
- [ ] Backup environment variables configured
- [ ] Run on staging/test environment first
- [ ] Run migration on production
- [ ] Verify results in database
- [ ] Keep backup files safe
- [ ] Review migration log
- [ ] Test recruiter login flow
- [ ] Confirm Company profiles appear correctly

---

## Questions?

- **Will this affect candidate users?** No, only recruiters are processed.
- **Will this delete any Users?** No, Users remain untouched.
- **Can I run this multiple times?** Yes, it checks for existing Companies.
- **What if I need to rollback?** Use the backup JSON file (see Rollback section).
- **How long does it take?** ~1-2 seconds per record.

---

**Last Updated:** January 14, 2026
**Script Version:** 1.0.0
**Author:** Migration Team
