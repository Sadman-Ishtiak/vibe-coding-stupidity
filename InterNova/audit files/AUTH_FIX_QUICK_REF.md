# AUTH FIX - QUICK REFERENCE

## 🎯 TLDR
Fixed auth system to save Company/Recruiter accounts in `companies` collection instead of `users` collection.

---

## 📝 WHAT TO KNOW

### **Account Types & Collections**

| Account Type | Collection   | Model   | Role Field  |
|-------------|-------------|---------|-------------|
| Candidate   | `users`     | User    | `candidate` |
| Company     | `companies` | Company | `company`   |
| Recruiter   | `companies` | Company | `recruiter` |

---

## 🔑 KEY CHANGES

### **1. Signup Flow**

```javascript
// Candidate
POST /api/auth/register
{ accountType: 'candidate' } → saves to User collection

// Company
POST /api/auth/register
{ accountType: 'company' } → saves to Company collection

// Recruiter
POST /api/auth/register
{ accountType: 'recruiter' } → saves to Company collection
```

### **2. Login Flow**

```javascript
POST /api/auth/login
{ email, password }

// System checks:
1. Search in User collection first
2. If not found, search in Company collection
3. Authenticate against correct model
4. Return token with userType field
```

### **3. JWT Token**

```javascript
// Token payload now includes:
{
  id: "user_id",
  role: "company" | "candidate" | "recruiter",
  userType: "company" | "candidate"  // ← NEW
}
```

### **4. Auth Middleware**

```javascript
// Automatically loads correct model:
if (token.userType === 'company') {
  req.user = await Company.findById(token.id);
} else {
  req.user = await User.findById(token.id);
}
```

---

## 🗂️ FILES CHANGED

```
✏️  server/utils/generateToken.js
✏️  server/controllers/authController.js
➕  scripts/cleanup-misplaced-accounts.js
```

---

## 🧪 TESTING COMMANDS

```bash
# Test candidate signup
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"John","email":"john@test.com","password":"test1234","accountType":"candidate"}'

# Test company signup
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"TechCorp","email":"hr@techcorp.com","password":"test1234","accountType":"company"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test1234"}'

# Verify token
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧹 DATABASE CLEANUP

```bash
# Preview misplaced accounts (safe)
node scripts/cleanup-misplaced-accounts.js --dry-run

# Execute cleanup (migrates & deletes)
node scripts/cleanup-misplaced-accounts.js --execute

# Backup only
node scripts/cleanup-misplaced-accounts.js --backup
```

---

## ✅ VALIDATION QUERIES

```javascript
// MongoDB shell commands

// Check for misplaced company/recruiter in users collection (should be 0)
db.users.find({ role: { $in: ['company', 'recruiter'] } }).count()

// Check companies collection
db.companies.find({ role: { $in: ['company', 'recruiter'] } }).count()

// View all company accounts
db.companies.find({}, { email: 1, role: 1, companyName: 1 })

// View all candidate accounts
db.users.find({}, { email: 1, role: 1, username: 1 })
```

---

## 🚨 IMPORTANT NOTES

1. **NO UI CHANGES** - All fixes are backend only
2. **BACKWARD COMPATIBLE** - Existing tokens still work
3. **RUN CLEANUP** - After deployment, run cleanup script
4. **VERIFY COLLECTIONS** - Ensure no misplaced accounts exist

---

## 🔍 DEBUGGING

### "User not found" error during login
- **Cause:** Account might be in wrong collection
- **Fix:** Run cleanup script or check both collections

### Company account has candidate fields
- **Cause:** Created before fix
- **Fix:** Run cleanup script to migrate

### Token refresh fails
- **Cause:** Old token without userType field
- **Fix:** User needs to login again

---

## 📞 SUPPORT

For issues or questions, check:
- Full documentation: `/audit files/AUTH_FIX_IMPLEMENTATION.md`
- Auth controller: `/server/controllers/authController.js`
- Token utils: `/server/utils/generateToken.js`

---

**Last Updated:** January 22, 2026
