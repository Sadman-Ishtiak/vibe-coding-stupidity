# Company Authentication Test Guide

## Test Steps

### 1. Start the Server
```bash
cd server
npm start
```

### 2. Register a Company
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "TestCompany",
    "email": "test@company.com",
    "password": "Test123!@#",
    "accountType": "company"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with the OTP sent.",
  "user": {
    "id": "...",
    "email": "test@company.com",
    "userType": "company",
    "requiresEmailVerification": true
  }
}
```

**Check Server Logs For:**
- `[REGISTER] Starting company/recruiter registration for: test@company.com, accountType: company`
- `[REGISTER] Creating User with role: 'recruiter'`
- `[REGISTER] User created successfully. ID: ..., role: recruiter, isEmailVerified: false`
- `[REGISTER] Creating Company profile linked to userId: ...`
- `[REGISTER] Company profile created. ID: ..., companyName: TestCompany`

### 3. Get OTP from Email or Server Logs

Look in server console for: `[OTP] Generated OTP: XXXXXX`

### 4. Verify Email with OTP
```bash
curl -X POST http://localhost:5000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.com",
    "otp": "XXXXXX",
    "purpose": "signup"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "userType": "company"
}
```

**Check Server Logs For:**
- `[OTP] Setting isEmailVerified=true and isVerified=true for test@company.com (company)`
- `[OTP] Successfully saved user. isEmailVerified: true, isVerified: true`
- `[OTP] Successfully verified signup OTP for test@company.com`

### 5. Login with Verified Account
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@company.com",
    "password": "Test123!@#"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "userId": "...",
    "username": "TestCompany",
    "email": "test@company.com",
    "role": "recruiter",
    "userType": "company"
  }
}
```

**Check Server Logs For:**
- `[LOGIN] Attempting login for: test@company.com`
- `[LOGIN] User found. Role: recruiter, isEmailVerified: true, isVerified: true`
- `[LOGIN] Password verified successfully`
- `[LOGIN] Email verified. Routing based on role: recruiter`
- `[LOGIN] Processing company/recruiter login for userId: ...`
- `[LOGIN] Company profile found: TestCompany, isActive: true`
- `[LOGIN] Company login successful. Generating response for: test@company.com`

## If Login Fails

### Check These in Order:

1. **User Not Found**
   - Run: `db.users.findOne({email: "test@company.com"})`
   - Verify user exists and has correct email

2. **Password Mismatch**
   - Verify password was saved during registration
   - Check if bcrypt hashing worked

3. **Email Not Verified**
   - Run: `db.users.findOne({email: "test@company.com"}, {isEmailVerified: 1, isVerified: 1})`
   - Verify both flags are `true`

4. **Wrong Role**
   - Run: `db.users.findOne({email: "test@company.com"}, {role: 1})`
   - Should be `"recruiter"` not `"company"`

5. **Company Profile Not Found**
   - Run: `db.companies.findOne({email: "test@company.com"})`
   - Verify company profile exists and has `userId` reference

## Database Queries to Check State

```javascript
// Check User record
db.users.findOne({email: "test@company.com"})

// Check Company record
db.companies.findOne({email: "test@company.com"})

// Check if userId links correctly
const user = db.users.findOne({email: "test@company.com"})
db.companies.findOne({userId: user._id})
```

## Common Issues

1. **User has role='company'**: Schema doesn't accept it → Validation error
2. **isEmailVerified is false**: OTP verification didn't save correctly
3. **Company.userId doesn't match User._id**: Wrong reference during creation
4. **Company profile doesn't exist**: Creation failed during registration
