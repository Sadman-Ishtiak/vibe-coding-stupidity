# CANDIDATE PROFILE - DEVELOPER QUICK REFERENCE

## 🔌 API ENDPOINTS

### GET /api/candidates/me
**Auth:** Required (Candidate JWT)  
**Returns:** Full profile with absolute image URLs

```javascript
// Response
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profileImage": "http://localhost:5000/uploads/profile-pics/image.jpg", // Absolute URL
    "designation": "Developer",
    "phone": "+1234567890",
    "location": "New York",
    "about": "...",
    "education": [...],
    "experience": [...],
    "skills": [...],
    "languages": [...],
    "projects": [...],
    "social": {
      "facebook": "",
      "linkedin": "https://...",
      "whatsapp": ""
      // NO phoneCall field
    },
    "resume": {
      "fileName": "resume.pdf",
      "fileUrl": "/uploads/resumes/resume.pdf",
      "fileSize": "245 KB"
    }
  }
}
```

---

### PUT /api/candidates/me
**Auth:** Required (Candidate JWT)  
**Body:** Partial or full profile data  
**Note:** Email changes are rejected

```javascript
// Request
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "designation": "Senior Developer",
  "phone": "+1234567890",
  "email": "newemail@example.com"  // ← Ignored/rejected
}

// Response
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* full profile */ }
}
```

---

### POST /api/candidates/me/profile-image
**Auth:** Required (Candidate JWT)  
**Content-Type:** multipart/form-data  
**Field:** profileImage (file)  
**Accepts:** JPEG, PNG, WEBP (max 5MB)  
**Processing:** Sharp resize to 200x200, optimize

```javascript
// FormData
const formData = new FormData();
formData.append('profileImage', fileInput.files[0]);

// Response
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "profileImage": "http://localhost:5000/uploads/profile-pics/image-123.jpg"
  }
}
```

**What happens:**
1. File uploaded via multer
2. Sharp resizes to 200x200 (center crop)
3. Optimized to JPEG (85% quality)
4. Saved to `uploads/profile-pics/`
5. Old image deleted
6. Absolute URL returned

---

### POST /api/candidates/me/resume
**Auth:** Required (Candidate JWT)  
**Content-Type:** multipart/form-data  
**Field:** resume (file)  
**Accepts:** PDF, DOC, DOCX (max 5MB)

```javascript
// FormData
const formData = new FormData();
formData.append('resume', fileInput.files[0]);

// Response
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resume": {
      "fileName": "John_Doe_Resume.pdf",
      "fileUrl": "/uploads/resumes/resume-123.pdf",
      "fileSize": "245 KB"
    }
  }
}
```

**What happens:**
1. File uploaded via multer
2. File type validated (PDF/DOC/DOCX)
3. Saved to `uploads/resumes/`
4. Old resume deleted
5. Metadata returned

---

## 🎨 FRONTEND USAGE

### Import Services
```javascript
import { 
  getMyProfile, 
  updateMyProfile, 
  uploadProfileImage, 
  uploadResume 
} from '@/services/candidates.service';
```

### Get Profile (Cached)
```javascript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { profileCache, getCachedProfile } = useAuth();
  
  // Get cached profile (instant)
  const profile = getCachedProfile();
  
  // Or from state
  console.log(profileCache);
}
```

### Update Profile
```javascript
const handleUpdate = async (data) => {
  try {
    const response = await updateMyProfile(data);
    if (response.success) {
      // Update AuthContext cache
      updateUser(response.data);
      alert('Success!');
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Failed');
  }
};
```

### Upload Profile Image
```javascript
const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Validate
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    alert('Invalid file type');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('File too large (max 5MB)');
    return;
  }
  
  try {
    const response = await uploadProfileImage(file);
    if (response.success) {
      // Update profile state
      setProfile(prev => ({ 
        ...prev, 
        profileImage: response.data.profileImage 
      }));
      // Update AuthContext
      updateUser({ profileImage: response.data.profileImage });
      alert('Uploaded!');
    }
  } catch (error) {
    alert('Upload failed');
  }
};
```

### Upload Resume
```javascript
const handleResumeUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Validate
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (!allowed.includes(file.type)) {
    alert('Only PDF, DOC, DOCX allowed');
    return;
  }
  
  try {
    const response = await uploadResume(file);
    if (response.success) {
      setProfile(prev => ({ 
        ...prev, 
        resume: response.data.resume 
      }));
      alert('Resume uploaded!');
    }
  } catch (error) {
    alert('Upload failed');
  }
};
```

---

## 🔐 BACKEND MIDDLEWARE

### Authentication Check
```javascript
// All routes protected by JWT
router.use(protectCandidate);

// In controller
req.candidate._id  // Current user ID
req.candidate.email  // Current user email
```

### File Upload
```javascript
const upload = require('../middlewares/uploadMiddleware');

// Single file
router.post('/upload', upload.single('profileImage'), controller);

// Multiple files
router.post('/upload', upload.array('images', 5), controller);

// Mixed fields
router.post('/upload', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), controller);
```

### Image Processing
```javascript
const { processUploadedImage, deleteOldImage } = require('../middlewares/imageResize');

// In controller
const processedPath = await processUploadedImage(req.file, 'profile');
// Returns: "uploads/profile-pics/image-123.jpg"

// Delete old image
await deleteOldImage(oldImageUrl);
```

---

## 🗄️ DATABASE SCHEMA

### User Model (No Changes to Structure)
```javascript
{
  profilePicture: String,  // Relative path
  phone: String,           // Primary phone field
  
  social: {
    facebook: String,
    linkedin: String,
    whatsapp: String
    // phoneCall REMOVED
  },
  
  resume: {
    fileName: String,
    fileUrl: String,
    fileSize: String
  }
}
```

### Safe Migration
```javascript
// phoneCall field ignored (not deleted)
// resume field has defaults
// All existing data works
```

---

## 🧪 TESTING COMMANDS

### Test Profile Load
```bash
curl -X GET http://localhost:5000/api/candidates/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Profile Update
```bash
curl -X PUT http://localhost:5000/api/candidates/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe Updated"}'
```

### Test Image Upload
```bash
curl -X POST http://localhost:5000/api/candidates/me/profile-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profileImage=@/path/to/image.jpg"
```

### Test Resume Upload
```bash
curl -X POST http://localhost:5000/api/candidates/me/resume \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

---

## 🐛 TROUBLESHOOTING

### Image Not Showing
1. Check browser console for CORS errors
2. Verify absolute URL is returned: `http://...`
3. Check `uploads/profile-pics/` directory exists
4. Verify file permissions (chmod 755)

### Upload Fails
1. Check file size (max 5MB)
2. Check file type (JPEG/PNG/WEBP for image, PDF/DOC/DOCX for resume)
3. Verify Sharp is installed: `npm list sharp`
4. Check disk space

### Cache Not Working
1. Verify AuthContext wraps app
2. Check `profileCache` in React DevTools
3. Ensure `updateUser()` is called after updates
4. Clear browser cache and localStorage

### Email Change Blocked
**This is correct behavior!** Email is immutable for security.

---

## 📁 FILE LOCATIONS

```
server/
├── controllers/
│   └── candidateController.js        // Upload logic
├── routes/
│   └── candidateRoutes.js            // Upload routes
├── models/
│   └── User.js                       // Schema (resume added)
├── middlewares/
│   ├── uploadMiddleware.js           // Multer config
│   └── imageResize.js                // Sharp processing
└── uploads/
    ├── profile-pics/                 // Profile images
    └── resumes/                      // Resume files

client/
├── src/
│   ├── pages/candidates/
│   │   └── CandidateProfile.jsx      // Main component
│   ├── services/
│   │   └── candidates.service.js     // API calls
│   └── context/
│       └── AuthContext.jsx           // Caching logic
```

---

## 🎯 KEY POINTS TO REMEMBER

1. **Always** return absolute URLs for images
2. **Always** update AuthContext cache after profile changes
3. **Never** allow email changes (security)
4. **Always** delete old files on replacement
5. **Always** validate file types and sizes
6. **phoneCall** is removed from social (use primary phone field)
7. **Cache** is cleared on logout automatically
8. **Sharp** processes all uploaded images
9. **Resume** accepts PDF, DOC, DOCX
10. **Partial updates** preserve existing data

---

## ✅ CHECKLIST FOR NEW FEATURES

When adding new profile fields:
- [ ] Add to User schema
- [ ] Add to getMyProfile response
- [ ] Add to updateMyProfile handler
- [ ] Add to frontend formData state
- [ ] Add input to Settings tab
- [ ] Add display to Overview tab
- [ ] Update validation
- [ ] Test caching behavior
- [ ] Update documentation

---

**Need help? Check:**
- `CANDIDATE_PROFILE_FIX_COMPLETE.md` - Full documentation
- `CANDIDATE_PROFILE_SUMMARY.md` - Changes summary
- `CANDIDATE_PROFILE_BEFORE_AFTER.md` - Visual guide
- `TEST_CANDIDATE_PROFILE.sh` - Test checklist
