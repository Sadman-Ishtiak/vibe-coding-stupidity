# 🔧 Developer Quick Reference Guide

## Image Upload - How to Use

### Backend: Adding Image Upload to a Route

```javascript
const upload = require('../middlewares/uploadMiddleware');
const { processImageMiddleware } = require('../middlewares/imageResize');

// Single image upload (avatar, logo)
router.post('/upload-avatar', 
  upload.single('profilePicture'),
  processImageMiddleware('avatar', 'profilePicture'),  // 33x33
  controller
);

// Multiple images upload
router.post('/upload-company', 
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'gallery', maxCount: 3 }
  ]),
  processImageMiddleware('logo', 'logo'),              // 120x120
  processImageMiddleware('gallery', 'gallery'),         // 800x600
  controller
);
```

### Backend: Accessing Processed Images in Controller

```javascript
// Single file
const profilePicture = req.file?.processedPath || null;

// Multiple files
const galleryUrls = req.processedPaths?.gallery || [];
```

### Backend: Deleting Old Images

```javascript
const { deleteOldImage } = require('../middlewares/imageResize');

// Delete old image before updating
if (user.profilePicture) {
  await deleteOldImage(user.profilePicture);
}
```

---

## Password Input - How to Use

### Frontend Component

```jsx
import PasswordInput from '@/components/common/PasswordInput';

<PasswordInput
  id="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  label="Password"
  placeholder="Enter password"
  helperText="Must be at least 8 characters"
  required
  disabled={loading}
  autoComplete="new-password"
/>
```

---

## Location Select - How to Use

### Frontend Component

```jsx
import LocationSelect from '@/components/common/LocationSelect';

<LocationSelect
  name="location"
  value={formData.location}
  onChange={handleChange}
  placeholder="Select district"
  required
  includeRemote={true}  // For job locations only
  disabled={loading}
/>
```

### Backend Validation

```javascript
const { validateDistrict, validateMultipleDistricts } = require('../utils/districtValidator');

// Single field validation
router.post('/job', validateDistrict('location'), createJob);

// Multiple fields validation
router.post('/profile', 
  validateMultipleDistricts(['location', 'companyLocation']), 
  updateProfile
);
```

---

## Image Types & Dimensions

| Type | Size | Usage | Middleware Param |
|------|------|-------|------------------|
| **Avatar** | 33x33 | Navbar, small profiles | `'avatar'` |
| **Profile** | 200x200 | Profile pages | `'profile'` |
| **Logo** | 120x120 | Company logos | `'logo'` |
| **Gallery** | 800x600 | Company galleries | `'gallery'` |

---

## Common Tasks

### Add a New Image Upload Endpoint

1. **Backend Route**:
```javascript
router.post('/upload', 
  auth,
  upload.single('image'),
  processImageMiddleware('logo', 'image'),  // Choose appropriate type
  controller
);
```

2. **Controller**:
```javascript
exports.uploadImage = async (req, res) => {
  const imagePath = req.file?.processedPath;
  // Save to database
};
```

3. **Frontend Form**:
```jsx
<input 
  type="file" 
  name="image"
  accept="image/*"
  onChange={handleFileChange}
/>
```

### Add a New Location Field

1. **Frontend Form**:
```jsx
import LocationSelect from '@/components/common/LocationSelect';

<LocationSelect
  name="newLocation"
  value={formData.newLocation}
  onChange={handleChange}
  required
/>
```

2. **Backend Route**:
```javascript
const { validateDistrict } = require('../utils/districtValidator');

router.post('/endpoint', 
  validateDistrict('newLocation'),
  controller
);
```

### Add Password Field with Toggle

```jsx
import PasswordInput from '@/components/common/PasswordInput';

<PasswordInput
  id="newField"
  name="newField"
  value={formData.newField}
  onChange={handleChange}
  label="Your Password"
  required
/>
```

---

## Troubleshooting

### Images Not Displaying
1. Check `VITE_API_BASE_URL` in `.env`
2. Verify upload directories exist
3. Check console for image errors
4. Verify Sharp is installed: `npm list sharp`

### Districts Not Validating
1. Check middleware order (validator before controller)
2. Verify district name matches exactly (case-insensitive)
3. Check backend logs for validation errors

### Password Toggle Not Working
1. Ensure PasswordInput component is imported
2. Check for conflicting CSS
3. Verify mdi icons are loaded

---

## Best Practices

### Images
- ✅ Always use `processImageMiddleware`
- ✅ Always delete old images before updating
- ✅ Use appropriate image type for context
- ✅ Add fallback images on frontend

### Locations
- ✅ Use LocationSelect for all location inputs
- ✅ Add backend validation on all location routes
- ✅ Allow "Remote" for job locations only

### Passwords
- ✅ Use PasswordInput for all password fields
- ✅ Set appropriate autocomplete attributes
- ✅ Add helper text for requirements

---

## File Locations Reference

### Backend
```
server/
  middlewares/
    uploadMiddleware.js       # Main upload config
    imageResize.js            # Sharp processing
  utils/
    districtValidator.js      # Location validation
  routes/
    authRoutes.js            # Uses avatar upload
    companyRoutes.js         # Uses logo + gallery
    jobRoutes.js             # Uses location validation
```

### Frontend
```
client/src/
  components/common/
    PasswordInput.jsx        # Password with eye toggle
    LocationSelect.jsx       # District dropdown
    ProfileImage.jsx         # Image with fallback
  data/
    bangladeshDistricts.js   # District list
  utils/
    imageHelpers.js          # Image URL helpers
  assets/css/
    image-display.css        # Image styling
```
