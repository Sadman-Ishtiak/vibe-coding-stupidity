# 🧪 Production Testing Checklist

## Pre-Deployment Setup

### Backend Setup
```bash
cd server
npm install
# Verify Sharp is installed
npm list sharp
# Create upload directories
mkdir -p uploads/profile-pics uploads/logos uploads/gallery uploads/resumes
```

### Frontend Setup
```bash
cd client
npm install
# Verify env file
cat .env.local  # Should have VITE_API_BASE_URL
```

---

## 1️⃣ IMAGE UPLOAD & RESIZE TESTS

### Test 1.1: User Registration with Profile Picture
- [ ] Go to Sign Up page
- [ ] Upload a large image (>2MB) - should be accepted
- [ ] Complete registration
- [ ] **Expected**: Profile picture appears as 33x33 in navbar
- [ ] **Expected**: Image is circular and properly cropped
- [ ] **Check backend**: File saved in `uploads/profile-pics/` as `.jpg`
- [ ] **Check backend**: Original upload is deleted

### Test 1.2: Navbar Avatar Display
- [ ] Log in with account that has profile picture
- [ ] **Expected**: Avatar shows as 33x33 circular image
- [ ] **Expected**: No distortion or stretching
- [ ] **Expected**: Image loads quickly

### Test 1.3: Company Logo Upload
- [ ] Log in as recruiter
- [ ] Go to Company Profile
- [ ] Upload company logo
- [ ] Save profile
- [ ] **Expected**: Logo saved as 120x120
- [ ] **Expected**: Old logo deleted if existed
- [ ] **Check backend**: File in `uploads/logos/`

### Test 1.4: Gallery Images Upload
- [ ] On Company Profile
- [ ] Upload 3 gallery images
- [ ] Save profile
- [ ] **Expected**: All images saved as 800x600
- [ ] **Expected**: Old gallery images deleted
- [ ] **Check backend**: Files in `uploads/gallery/`

### Test 1.5: Image Update & Old File Deletion
- [ ] Update profile picture
- [ ] **Check backend**: Old image file deleted from filesystem
- [ ] **Expected**: New image displays correctly

### Test 1.6: Image Fallback
- [ ] Delete user's profile picture from database
- [ ] Reload page
- [ ] **Expected**: Default avatar displays
- [ ] **Expected**: No broken image icon

### Test 1.7: Image Error Handling
- [ ] Break image URL in database (e.g., wrong path)
- [ ] Reload page
- [ ] **Expected**: Fallback image shows
- [ ] **Expected**: No console errors

---

## 2️⃣ PASSWORD EYE TOGGLE TESTS

### Test 2.1: Sign In Page
- [ ] Go to Sign In page
- [ ] Enter password
- [ ] **Expected**: Eye icon visible on right side
- [ ] Click eye icon
- [ ] **Expected**: Password becomes visible
- [ ] Click eye-slash icon
- [ ] **Expected**: Password hidden again

### Test 2.2: Sign Up Page
- [ ] Go to Sign Up page
- [ ] Enter password
- [ ] **Expected**: Eye icon visible
- [ ] Toggle visibility
- [ ] **Expected**: Password shows/hides correctly
- [ ] **Expected**: Helper text visible ("Must be at least 8 characters...")

### Test 2.3: Reset Password Page
- [ ] Request password reset
- [ ] Go to reset link
- [ ] **Expected**: Both password fields have eye toggle
- [ ] Toggle both fields
- [ ] **Expected**: Both work independently

### Test 2.4: Candidate Change Password
- [ ] Log in as candidate
- [ ] Go to Profile
- [ ] Scroll to Change Password section
- [ ] **Expected**: All 3 fields have eye toggle
  - Current Password
  - New Password
  - Confirm Password
- [ ] Toggle each independently
- [ ] **Expected**: All work correctly

### Test 2.5: Company Change Password
- [ ] Log in as recruiter
- [ ] Go to Company Profile
- [ ] Scroll to Change Password
- [ ] **Expected**: All 3 fields have eye toggle
- [ ] Toggle each independently
- [ ] **Expected**: All work correctly

### Test 2.6: Password Toggle UI Consistency
- [ ] Check all password fields across the app
- [ ] **Expected**: Eye icon positioned consistently (right side)
- [ ] **Expected**: No layout shifts when toggling
- [ ] **Expected**: Icon color consistent

---

## 3️⃣ DISTRICT DROPDOWN TESTS

### Test 3.1: Post Job - Location Dropdown
- [ ] Log in as recruiter
- [ ] Go to Post Job page
- [ ] Click Location field
- [ ] **Expected**: Dropdown shows all 64 districts
- [ ] **Expected**: "Remote" option available
- [ ] Select a district
- [ ] **Expected**: District appears in field
- [ ] Submit job
- [ ] **Expected**: Job created successfully

### Test 3.2: Company Profile - Location Dropdown
- [ ] Go to Company Profile
- [ ] Find "Primary Location" field
- [ ] **Expected**: Dropdown (not text input)
- [ ] **Expected**: All districts available
- [ ] Select district
- [ ] Save profile
- [ ] **Expected**: Saved successfully

### Test 3.3: Backend District Validation - Valid
- [ ] Submit job with valid district (e.g., "Dhaka")
- [ ] **Expected**: Job created successfully
- [ ] **Check database**: District saved correctly

### Test 3.4: Backend District Validation - Invalid
- [ ] Use API tool (Postman/curl)
- [ ] Send POST to `/api/jobs` with invalid district:
```json
{
  "location": "InvalidPlace",
  ...
}
```
- [ ] **Expected**: 400 Bad Request
- [ ] **Expected**: Error message mentions invalid district

### Test 3.5: District Normalization
- [ ] Submit "dhaka" (lowercase)
- [ ] **Expected**: Normalized to "Dhaka"
- [ ] **Check database**: Stored as "Dhaka" (proper case)

### Test 3.6: Remote Option for Jobs
- [ ] Post job with location "Remote"
- [ ] **Expected**: Accepted
- [ ] **Check**: Job displays "Remote" as location

---

## 4️⃣ INTEGRATION TESTS

### Test 4.1: Complete User Registration Flow
- [ ] Go to Sign Up
- [ ] Fill all fields
- [ ] Upload profile picture (large image)
- [ ] Use password eye toggle
- [ ] Submit
- [ ] **Expected**: Registration success
- [ ] **Expected**: Redirected to appropriate page
- [ ] **Expected**: Avatar appears in navbar (33x33)

### Test 4.2: Complete Job Posting Flow
- [ ] Log in as recruiter
- [ ] Post new job
- [ ] Select district from dropdown
- [ ] Submit
- [ ] **Expected**: Job created
- [ ] View job details
- [ ] **Expected**: District displays correctly

### Test 4.3: Complete Profile Update Flow
- [ ] Update profile picture
- [ ] Update location using dropdown
- [ ] Change password using eye toggle
- [ ] Submit
- [ ] **Expected**: All updates saved
- [ ] **Expected**: Old image deleted
- [ ] **Expected**: New avatar in navbar

---

## 5️⃣ ERROR HANDLING TESTS

### Test 5.1: Large Image Upload (>5MB)
- [ ] Try to upload 6MB image
- [ ] **Expected**: Error message
- [ ] **Expected**: No file created on server

### Test 5.2: Invalid Image Format
- [ ] Try to upload .txt file as image
- [ ] **Expected**: Error message
- [ ] **Expected**: Upload blocked

### Test 5.3: Network Error During Upload
- [ ] Start uploading image
- [ ] Disconnect internet mid-upload
- [ ] **Expected**: Error message
- [ ] **Expected**: Partial files cleaned up

### Test 5.4: Password Validation
- [ ] Try short password (<8 chars)
- [ ] **Expected**: Validation error
- [ ] Try password without numbers
- [ ] **Expected**: Validation error

---

## 6️⃣ PERFORMANCE TESTS

### Test 6.1: Image Load Speed
- [ ] Clear browser cache
- [ ] Load page with images
- [ ] **Expected**: Images load quickly
- [ ] **Check**: Network tab shows optimized sizes
- [ ] **Check**: Avatar ~5KB, Logo ~15KB, Gallery ~50KB each

### Test 6.2: Responsive Design
- [ ] Test on mobile (375px width)
- [ ] **Expected**: Images scale properly
- [ ] **Expected**: Password toggles work
- [ ] **Expected**: Dropdowns usable
- [ ] Test on tablet (768px)
- [ ] **Expected**: All features work

---

## 7️⃣ CROSS-BROWSER TESTS

### Test 7.1: Chrome
- [ ] All image uploads work
- [ ] All password toggles work
- [ ] All dropdowns work

### Test 7.2: Firefox
- [ ] All image uploads work
- [ ] All password toggles work
- [ ] All dropdowns work

### Test 7.3: Safari
- [ ] All image uploads work
- [ ] All password toggles work
- [ ] All dropdowns work

---

## 8️⃣ SECURITY TESTS

### Test 8.1: SQL Injection in District Field
- [ ] Try SQL in district field: `'; DROP TABLE users--`
- [ ] **Expected**: Validation error
- [ ] **Expected**: No database impact

### Test 8.2: XSS in Image Upload
- [ ] Upload image with XSS in filename: `<script>alert(1)</script>.jpg`
- [ ] **Expected**: Filename sanitized
- [ ] **Expected**: No script execution

### Test 8.3: Path Traversal in Image Upload
- [ ] Try uploading to `../../etc/passwd`
- [ ] **Expected**: Blocked
- [ ] **Expected**: File saved in correct directory only

---

## 9️⃣ DATABASE VERIFICATION

### Test 9.1: Image Paths in Database
```sql
SELECT _id, profilePicture FROM users WHERE profilePicture IS NOT NULL LIMIT 5;
```
- [ ] **Expected**: Paths like `/uploads/profile-pics/123456-processed.jpg`

### Test 9.2: District Values in Database
```sql
SELECT DISTINCT location FROM jobs;
```
- [ ] **Expected**: Only valid districts + "Remote"
- [ ] **Expected**: Proper casing (e.g., "Dhaka" not "dhaka")

---

## 🔟 CLEANUP VERIFICATION

### Test 10.1: Old Files Deleted
- [ ] Note file count in `uploads/profile-pics/`
- [ ] Update profile picture 3 times
- [ ] **Check**: Only latest file exists
- [ ] **Check**: No orphaned files

### Test 10.2: Failed Upload Cleanup
- [ ] Start upload, kill server mid-process
- [ ] Restart server
- [ ] **Check**: No partial files in uploads folder

---

## ✅ SIGN-OFF CHECKLIST

### Functionality
- [ ] All image types resize correctly (33x33, 200x200, 120x120, 800x600)
- [ ] All password fields have working eye toggle
- [ ] All location fields use district dropdown
- [ ] Backend validates districts correctly
- [ ] Old images are deleted on update
- [ ] Fallback images work everywhere

### Code Quality
- [ ] No console errors in browser
- [ ] No errors in server logs
- [ ] No broken images
- [ ] No layout shifts

### Performance
- [ ] Images load in <500ms
- [ ] File sizes optimized
- [ ] No memory leaks

### Security
- [ ] Input validation works
- [ ] File upload sanitization works
- [ ] No sensitive data exposed

---

## 🚨 CRITICAL ISSUES TO WATCH FOR

1. **Images not displaying**: Check VITE_API_BASE_URL
2. **Upload fails**: Verify Sharp is installed
3. **District validation fails**: Check middleware order
4. **Old images not deleted**: Check deleteOldImage function calls
5. **Eye toggle not working**: Check mdi icon CSS loaded

---

## 📊 SUCCESS METRICS

All tests should pass with:
- ✅ 0 console errors
- ✅ 0 broken images
- ✅ 0 layout issues
- ✅ <500ms image load time
- ✅ <5KB avatar file size
- ✅ 100% validation coverage

---

## 🎉 READY FOR PRODUCTION

When all tests pass, the system is production-ready!
