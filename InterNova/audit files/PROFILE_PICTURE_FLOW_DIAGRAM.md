# Profile Picture Processing Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER REGISTRATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   FRONTEND  │
│             │
│  User       │
│  uploads    │
│  image      │
│  (any size) │
└──────┬──────┘
       │
       │ FormData with
       │ profilePicture file
       │
       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              BACKEND API                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  POST /api/auth/register                                                  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 1: MULTER UPLOAD                                            │   │
│  │ ──────────────────────                                           │   │
│  │ • profileUpload.single('profilePicture')                         │   │
│  │ • Saves to: uploads/profile-pics/1234567890-original.jpg         │   │
│  │ • Max size: 2MB                                                  │   │
│  │ • Formats: JPEG, PNG, GIF, WEBP                                  │   │
│  └─────────────────────────┬───────────────────────────────────────┘   │
│                            │                                             │
│                            ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 2: IMAGE PROCESSING MIDDLEWARE                              │   │
│  │ ───────────────────────────────────                              │   │
│  │ processProfileImage                                              │   │
│  │                                                                   │   │
│  │  ┌────────────────────────────────────────────┐                 │   │
│  │  │ 2a. VALIDATE IMAGE                          │                 │   │
│  │  │ ─────────────────                           │                 │   │
│  │  │ • Check if valid image using sharp          │                 │   │
│  │  │ • Reject corrupted files                    │                 │   │
│  │  │ • Return 400 if invalid                     │                 │   │
│  │  └───────────────────┬────────────────────────┘                 │   │
│  │                      │                                           │   │
│  │                      ▼                                           │   │
│  │  ┌────────────────────────────────────────────┐                 │   │
│  │  │ 2b. PROCESS IMAGE (sharp)                   │                 │   │
│  │  │ ────────────────────────                    │                 │   │
│  │  │ sharp(inputPath)                            │                 │   │
│  │  │   .resize(33, 33, {                         │                 │   │
│  │  │     fit: 'cover',        // Center crop     │                 │   │
│  │  │     position: 'center'                      │                 │   │
│  │  │   })                                        │                 │   │
│  │  │   .jpeg({                                   │                 │   │
│  │  │     quality: 90,         // High quality    │                 │   │
│  │  │     mozjpeg: true        // Optimize        │                 │   │
│  │  │   })                                        │                 │   │
│  │  │   .toFile(outputPath)                       │                 │   │
│  │  │                                             │                 │   │
│  │  │ Output: 1234567890-processed.jpg (33×33)    │                 │   │
│  │  └───────────────────┬────────────────────────┘                 │   │
│  │                      │                                           │   │
│  │                      ▼                                           │   │
│  │  ┌────────────────────────────────────────────┐                 │   │
│  │  │ 2c. CLEANUP ORIGINAL                        │                 │   │
│  │  │ ───────────────────                         │                 │   │
│  │  │ • Delete 1234567890-original.jpg            │                 │   │
│  │  │ • Only keep processed version               │                 │   │
│  │  └───────────────────┬────────────────────────┘                 │   │
│  │                      │                                           │   │
│  │                      ▼                                           │   │
│  │  ┌────────────────────────────────────────────┐                 │   │
│  │  │ 2d. UPDATE req.file                         │                 │   │
│  │  │ ──────────────────                          │                 │   │
│  │  │ req.file.processedPath = "/uploads/..."    │                 │   │
│  │  │ req.file.filename = "...processed.jpg"     │                 │   │
│  │  └───────────────────┬────────────────────────┘                 │   │
│  └────────────────────────┼───────────────────────────────────────┘   │
│                            │                                             │
│                            ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 3: VALIDATION                                               │   │
│  │ ─────────────────                                                │   │
│  │ • express-validator checks username, email, password             │   │
│  │ • If fails: cleanup processed file, return 400                   │   │
│  └─────────────────────────┬───────────────────────────────────────┘   │
│                            │                                             │
│                            ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 4: AUTH CONTROLLER (register)                               │   │
│  │ ──────────────────────────────────                               │   │
│  │ • Check for duplicate email                                      │   │
│  │ • Hash password                                                  │   │
│  │ • Create user with:                                              │   │
│  │     profilePicture: req.file.processedPath                       │   │
│  │     // "/uploads/profile-pics/1234567890-processed.jpg"          │   │
│  │ • Save to MongoDB                                                │   │
│  │ • Return user data                                               │   │
│  └─────────────────────────┬───────────────────────────────────────┘   │
│                            │                                             │
└────────────────────────────┼─────────────────────────────────────────────┘
                             │
                             │ Response: { user: { profilePicture: "..." } }
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND DISPLAY                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User object received:                                                   │
│  {                                                                       │
│    profilePicture: "/uploads/profile-pics/1234567890-processed.jpg"    │
│  }                                                                       │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ Navbar.jsx / ProfileMenu.jsx                               │        │
│  │ ────────────────────────────                               │        │
│  │                                                             │        │
│  │ <img                                                        │        │
│  │   src={getProfileImageUrl(user.profilePicture)}            │        │
│  │   width="33"                                                │        │
│  │   height="33"                                               │        │
│  │   className="rounded-circle"                                │        │
│  │   onError={fallbackHandler}                                 │        │
│  │ />                                                          │        │
│  │                                                             │        │
│  │ • Renders 33×33 image (already processed)                  │        │
│  │ • No runtime resizing needed                               │        │
│  │ • Perfect layout every time                                │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         IMAGE TRANSFORMATION                             │
└─────────────────────────────────────────────────────────────────────────┘

BEFORE PROCESSING:                  AFTER PROCESSING:
┌─────────────────────┐             ┌──────┐
│                     │             │      │
│                     │             │  33  │
│    Large Image      │    ─────>   │  ×   │
│    (any size)       │             │  33  │
│                     │             │  px  │
│                     │             │      │
└─────────────────────┘             └──────┘
  800×1200 (150KB)                  33×33 (3KB)
  Portrait                          Square, cropped


STORAGE:

uploads/profile-pics/
├── 1234567890-processed.jpg  ✅ 33×33, optimized
├── 1234567891-processed.jpg  ✅ 33×33, optimized
└── 1234567892-processed.jpg  ✅ 33×33, optimized

(Original files automatically deleted)


DATABASE:

User Collection:
{
  _id: "...",
  username: "johndoe",
  email: "john@example.com",
  profilePicture: "/uploads/profile-pics/1234567890-processed.jpg"  ← 33×33
}


┌─────────────────────────────────────────────────────────────────────────┐
│                          ERROR HANDLING FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

Upload → Validate → Process
                     ↓
                  ❌ Error?
                     │
                     ├─→ Delete original file
                     ├─→ Delete processed file (if exists)
                     └─→ Return 400/500 error
                         {
                           success: false,
                           message: "Failed to process image"
                         }


┌─────────────────────────────────────────────────────────────────────────┐
│                              KEY BENEFITS                                │
└─────────────────────────────────────────────────────────────────────────┘

✅ Consistency     All images exactly 33×33px
✅ Performance     Small files (~3KB vs 150KB)
✅ Layout          Navbar never breaks
✅ Quality         Center crop + optimization
✅ Automation      Zero manual intervention
✅ Clean           No large files kept
✅ Reliability     Comprehensive error handling
✅ Standards       Industry best practices
```
