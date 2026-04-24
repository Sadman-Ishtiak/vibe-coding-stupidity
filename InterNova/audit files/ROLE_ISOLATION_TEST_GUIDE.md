# 🧪 Role Isolation Testing Guide

Quick reference for testing the complete role isolation between Candidate and Company systems.

---

## 🎯 Test Scenarios

### ✅ Test 1: Candidate Authentication

**Register as Candidate:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_candidate",
    "email": "john@candidate.com",
    "password": "password123",
    "accountType": "candidate"
  }'
```

**Login as Candidate:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@candidate.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "role": "candidate"
  }
}
```

**Verify JWT includes role:**
```bash
# Decode JWT at https://jwt.io
# Payload should show: { "id": "...", "role": "candidate", "iat": ..., "exp": ... }
```

---

### ✅ Test 2: Recruiter Authentication

**Register as Recruiter:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_recruiter",
    "email": "jane@recruiter.com",
    "password": "password123",
    "accountType": "recruiter"
  }'
```

**Login as Recruiter:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@recruiter.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "role": "recruiter"
  }
}
```

---

### ✅ Test 3: Candidate Access Control (Should PASS)

**Access Candidate Profile:**
```bash
curl -X GET http://localhost:5000/api/candidates/me \
  -H "Authorization: Bearer <CANDIDATE_TOKEN>"
```

**Expected:** ✅ 200 OK - Returns candidate profile

**Get Bookmarks:**
```bash
curl -X GET http://localhost:5000/api/candidates/bookmarks \
  -H "Authorization: Bearer <CANDIDATE_TOKEN>"
```

**Expected:** ✅ 200 OK - Returns bookmarks array

**Change Password:**
```bash
curl -X PUT http://localhost:5000/api/candidates/change-password \
  -H "Authorization: Bearer <CANDIDATE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

**Expected:** ✅ 200 OK - Password changed successfully

---

### ❌ Test 4: Candidate Blocked from Company Endpoints

**Try to Create Company (as Candidate):**
```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Authorization: Bearer <CANDIDATE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "description": "Test Description"
  }'
```

**Expected:** ❌ 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. This endpoint is for recruiters only."
}
```

---

### ✅ Test 5: Recruiter Access Control (Should PASS)

**Create Company:**
```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Authorization: Bearer <RECRUITER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Innovators Inc",
    "description": "Leading technology company",
    "location": "Dhaka",
    "website": "www.techinnovators.com"
  }'
```

**Expected:** ✅ 201 Created - Company created successfully

---

### ❌ Test 6: Recruiter Blocked from Candidate Endpoints

**Try to Access Candidate Profile (as Recruiter):**
```bash
curl -X GET http://localhost:5000/api/candidates/me \
  -H "Authorization: Bearer <RECRUITER_TOKEN>"
```

**Expected:** ❌ 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. This endpoint is for candidates only."
}
```

**Try to Get Bookmarks (as Recruiter):**
```bash
curl -X GET http://localhost:5000/api/candidates/bookmarks \
  -H "Authorization: Bearer <RECRUITER_TOKEN>"
```

**Expected:** ❌ 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. This endpoint is for candidates only."
}
```

**Try to Change Password via Candidate Endpoint (as Recruiter):**
```bash
curl -X PUT http://localhost:5000/api/candidates/change-password \
  -H "Authorization: Bearer <RECRUITER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

**Expected:** ❌ 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. This endpoint is for candidates only."
}
```

---

## 🔍 Frontend Testing (Browser)

### Test 7: Candidate UI Flow

1. **Register as Candidate** → Navigate to registration page
2. **Login** → Use candidate credentials
3. **Access Candidate Pages:**
   - ✅ Should load: Candidate Profile (`/candidate-profile`)
   - ✅ Should load: Applied Jobs (`/applied-jobs`)
   - ✅ Should load: Bookmarked Jobs (`/bookmarked-jobs`)
4. **Verify Console** → No 403 errors in Network tab

### Test 8: Recruiter UI Flow

1. **Register as Recruiter** → Navigate to registration page
2. **Login** → Use recruiter credentials
3. **Access Company Pages:**
   - ✅ Should load: Company Profile (`/company-profile`)
   - ✅ Should load: Manage Jobs (`/manage-jobs`)
   - ✅ Should load: Post Job (`/post-job`)
4. **Verify Console** → No 403 errors in Network tab

### Test 9: Cross-Access Prevention (Frontend)

**Candidate attempting Company routes:**
- Navigate to `/company-profile` → Should redirect or show 403
- Navigate to `/manage-jobs` → Should redirect or show 403

**Recruiter attempting Candidate routes:**
- Navigate to `/candidate-profile` → Should redirect or show 403
- Navigate to `/applied-jobs` → Should redirect or show 403

---

## 📊 Expected Results Summary

| Test | User Type | Endpoint | Expected Result |
|------|-----------|----------|-----------------|
| 1 | Candidate | `POST /api/auth/register` | ✅ 201 Created |
| 2 | Candidate | `POST /api/auth/login` | ✅ 200 OK (token with role) |
| 3 | Candidate | `GET /api/candidates/me` | ✅ 200 OK |
| 4 | Candidate | `GET /api/candidates/bookmarks` | ✅ 200 OK |
| 5 | Candidate | `PUT /api/candidates/change-password` | ✅ 200 OK |
| 6 | Candidate | `POST /api/companies` | ❌ 403 Forbidden |
| 7 | Recruiter | `POST /api/auth/register` | ✅ 201 Created |
| 8 | Recruiter | `POST /api/auth/login` | ✅ 200 OK (token with role) |
| 9 | Recruiter | `POST /api/companies` | ✅ 201 Created |
| 10 | Recruiter | `GET /api/candidates/me` | ❌ 403 Forbidden |
| 11 | Recruiter | `GET /api/candidates/bookmarks` | ❌ 403 Forbidden |
| 12 | Recruiter | `PUT /api/candidates/change-password` | ❌ 403 Forbidden |

---

## 🔐 Security Verification Checklist

- [ ] JWT tokens include `role` field
- [ ] Candidate JWT has `"role": "candidate"`
- [ ] Recruiter JWT has `"role": "recruiter"`
- [ ] candidateAuthMiddleware blocks recruiters (403)
- [ ] companyAuthMiddleware blocks candidates (403)
- [ ] Password hashing works automatically
- [ ] No console errors on successful operations
- [ ] UI unchanged (no visual differences)
- [ ] Frontend services call correct endpoints
- [ ] No shared state between roles

---

## 🚨 Common Issues & Solutions

### Issue: "Token expired" error
**Solution:** Tokens expire after 15 minutes. Re-login to get new token.

### Issue: "User not found" error
**Solution:** Ensure you're using the correct token for the registered user.

### Issue: Server not responding
**Solution:** Check if server is running on port 5000:
```bash
curl http://localhost:5000/api/auth/health
```

### Issue: 403 on valid request
**Solution:** Verify JWT includes correct role at https://jwt.io

---

## 📝 Test Execution Script

```bash
#!/bin/bash

echo "🧪 Role Isolation Test Suite"
echo "=============================="

# Test 1: Register Candidate
echo "Test 1: Register Candidate"
CANDIDATE_REGISTER=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test_candidate","email":"test@candidate.com","password":"password123","accountType":"candidate"}')
echo "✅ Candidate registered"

# Test 2: Login Candidate
echo "Test 2: Login Candidate"
CANDIDATE_LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@candidate.com","password":"password123"}')
CANDIDATE_TOKEN=$(echo $CANDIDATE_LOGIN | jq -r '.accessToken')
echo "✅ Candidate token: $CANDIDATE_TOKEN"

# Test 3: Candidate access own profile (should PASS)
echo "Test 3: Candidate accessing /api/candidates/me"
CANDIDATE_PROFILE=$(curl -s -X GET http://localhost:5000/api/candidates/me \
  -H "Authorization: Bearer $CANDIDATE_TOKEN")
echo "✅ Candidate profile access: $(echo $CANDIDATE_PROFILE | jq -r '.success')"

# Test 4: Candidate accessing company endpoint (should FAIL 403)
echo "Test 4: Candidate accessing /api/companies (should be 403)"
CANDIDATE_COMPANY_ACCESS=$(curl -s -X POST http://localhost:5000/api/companies \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}')
echo "❌ Expected 403: $(echo $CANDIDATE_COMPANY_ACCESS | jq -r '.message')"

# Test 5: Register Recruiter
echo "Test 5: Register Recruiter"
RECRUITER_REGISTER=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test_recruiter","email":"test@recruiter.com","password":"password123","accountType":"recruiter"}')
echo "✅ Recruiter registered"

# Test 6: Login Recruiter
echo "Test 6: Login Recruiter"
RECRUITER_LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@recruiter.com","password":"password123"}')
RECRUITER_TOKEN=$(echo $RECRUITER_LOGIN | jq -r '.accessToken')
echo "✅ Recruiter token: $RECRUITER_TOKEN"

# Test 7: Recruiter accessing candidate endpoint (should FAIL 403)
echo "Test 7: Recruiter accessing /api/candidates/me (should be 403)"
RECRUITER_CANDIDATE_ACCESS=$(curl -s -X GET http://localhost:5000/api/candidates/me \
  -H "Authorization: Bearer $RECRUITER_TOKEN")
echo "❌ Expected 403: $(echo $RECRUITER_CANDIDATE_ACCESS | jq -r '.message')"

# Test 8: Recruiter accessing company endpoint (should PASS)
echo "Test 8: Recruiter accessing /api/companies"
RECRUITER_COMPANY_ACCESS=$(curl -s -X POST http://localhost:5000/api/companies \
  -H "Authorization: Bearer $RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Company","description":"Test"}')
echo "✅ Company creation: $(echo $RECRUITER_COMPANY_ACCESS | jq -r '.name')"

echo "=============================="
echo "✅ All tests completed!"
```

**Save as:** `test-role-isolation.sh`

**Run:**
```bash
chmod +x test-role-isolation.sh
./test-role-isolation.sh
```

---

**END OF TESTING GUIDE**
