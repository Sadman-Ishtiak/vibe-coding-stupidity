# InterNova - Quick Reference Guide

## 🚀 Quick Start Commands

### Development
```bash
# Start Backend (Terminal 1)
cd server
npm run dev

# Start Frontend (Terminal 2)
cd client
npm run dev
```

### Production Build
```bash
# Build Frontend
cd client
npm run build

# Start Production Server
cd server
npm start
```

---

## 📁 Important File Locations

### Configuration
- Frontend API URL: `/client/.env` → `VITE_API_URL`
- Backend Config: `/server/.env`
- Database Config: `/server/config/db.js`
- API Paths: `/client/src/config/api.paths.js`

### Authentication
- Auth Controller: `/server/controllers/authController.js`
- Auth Service: `/client/src/services/auth.service.js`
- Auth Middleware: `/server/middlewares/authMiddleware.js`
- Token Generation: `/server/utils/generateToken.js`

### Email System
- Email Templates: `/server/mail/mailTemplates.js`
- Email Sender: `/server/mail/mailSender.js`
- Email Service: `/server/utils/emailService.js`
- OTP Service: `/server/utils/otpService.js`

### File Uploads
- Upload Middleware: `/server/middlewares/uploadMiddleware.js`
- Image Resize: `/server/middlewares/imageResize.js`
- Upload Directory: `/server/uploads/`

---

## 🔑 Common Tasks

### Adding a New API Endpoint

1. **Create Route** (`/server/routes/`)
```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/yourController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, controller.getAll);
router.post('/', authMiddleware, controller.create);

module.exports = router;
```

2. **Register Route** (`/server/app.js`)
```javascript
app.use('/api/your-resource', require('./routes/yourRoutes'));
```

3. **Create Controller** (`/server/controllers/yourController.js`)
```javascript
exports.getAll = async (req, res) => {
  try {
    // Your logic
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

4. **Add Frontend Service** (`/client/src/services/`)
```javascript
import { apiRequest } from './api';

export const getAll = () => apiRequest('GET', '/your-resource');
export const create = (data) => apiRequest('POST', '/your-resource', data);
```

### Adding Email Notification

1. **Create Template** (`/server/mail/mailTemplates.js`)
```javascript
exports.yourTemplate = (data) => `
  <h1>Your Email Title</h1>
  <p>${data.message}</p>
`;
```

2. **Send Email** (in controller)
```javascript
const { sendEmail } = require('../mail/mailSender');
const { yourTemplate } = require('../mail/mailTemplates');

await sendEmail(
  userEmail,
  'Email Subject',
  yourTemplate({ message: 'Hello!' })
);
```

### Adding Form Validation

```javascript
const { body } = require('express-validator');

router.post('/your-endpoint',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('name').trim().notEmpty().withMessage('Name required'),
    body('age').isInt({ min: 18 }).withMessage('Must be 18+')
  ],
  controller.yourMethod
);
```

### Protected Route (Frontend)

```jsx
import { ProtectedRoute } from './routes/ProtectedRoute';

<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

---

## 🗄️ Database Models

### User
- Email, password, role
- Email verification status
- OTP data
- Refresh tokens

### Candidate
- Links to User
- Profile info, skills
- Bookmarked jobs

### Company
- Links to User
- Company details
- Logo

### Job
- Company ID
- Job details
- Requirements
- Status

### Application
- Job ID, Candidate ID, Company ID
- Cover letter
- Status (pending/shortlisted/rejected)

---

## 🛠️ Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
systemctl status mongod

# Or start MongoDB
systemctl start mongod
```

### "Emails not sending"
1. Check `.env` has correct EMAIL_USER and EMAIL_PASSWORD
2. For Gmail, enable "App Passwords" in Google Account
3. Verify EMAIL_SERVICE matches provider (gmail, outlook, etc.)

### "Token expired" errors
1. Check system clock is accurate
2. Verify JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in `.env`
3. Clear localStorage/cookies and login again

### "Images not uploading"
1. Check file size < 5MB
2. Verify allowed file types (jpg, jpeg, png, gif)
3. Ensure `/server/uploads/` directory exists with write permissions
```bash
mkdir -p server/uploads
chmod 755 server/uploads
```

### "CORS errors"
1. Verify FRONTEND_URL in `/server/.env` matches client URL
2. Check CORS config in `/server/app.js`

---

## 📊 Useful Commands

### Database
```bash
# MongoDB shell
mongosh internova

# View collections
show collections

# View users
db.users.find().pretty()

# Count jobs
db.jobs.countDocuments()
```

### Git
```bash
# Check current changes
git status

# Commit changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin main
```

### Logs
```bash
# View server logs
tail -f server.log

# View PM2 logs (if using PM2)
pm2 logs
```

---

## 🔒 Security Checklist

Before Production:
- [ ] HTTPS enabled
- [ ] Secure cookies (`secure: true, sameSite: 'strict'`)
- [ ] Rate limiting configured
- [ ] Helmet security headers added
- [ ] All .env secrets different from development
- [ ] MongoDB connection uses strong password
- [ ] CORS limited to production frontend domain only
- [ ] File upload limits enforced
- [ ] Input sanitization implemented

---

## 📦 Dependencies Overview

### Backend Key Packages
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `nodemailer` - Email sending
- `multer` - File uploads
- `sharp` - Image processing
- `express-validator` - Input validation

### Frontend Key Packages
- `react` - UI library
- `react-router-dom` - Routing
- `bootstrap` - UI framework
- `swiper` - Carousels
- `axios` (via services) - HTTP client

---

## 🐛 Debug Mode

### Enable Verbose Logging

**Backend** (`/server/.env`):
```env
NODE_ENV=development
DEBUG=*
```

**Frontend**:
```javascript
// In browser console
localStorage.setItem('debug', 'app:*');
```

---

## 📚 Documentation Files

- `PROJECT_DOCUMENTATION.md` - Comprehensive project guide
- `CLEANUP_SUMMARY.md` - Cleanup actions and recommendations
- `_archived_scripts/` - Historical migration scripts
- `audit files/` - Development history and implementation details

---

## 🎯 Quick Wins for Performance

1. **Add Database Indexes** (5 minutes)
```javascript
// In User.js model
userSchema.index({ email: 1 });

// In Job.js model
jobSchema.index({ companyId: 1, status: 1 });
jobSchema.index({ district: 1, employmentType: 1 });
```

2. **Enable Response Compression** (2 minutes)
```javascript
// In server/app.js
const compression = require('compression');
app.use(compression());
```

3. **Frontend Code Splitting** (5 minutes)
```jsx
// In App.jsx
const JobList = lazy(() => import('./pages/jobs/JobList'));
const CompanyProfile = lazy(() => import('./pages/companies/CompanyProfile'));
```

---

## ⚡ Performance Monitoring

### Check Bundle Size
```bash
cd client
npm run build -- --report
```

### Monitor API Response Times
```javascript
// Add to server/app.js
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

---

## 🚨 Emergency Rollback

If something breaks in production:

```bash
# 1. Revert to previous git commit
git log --oneline -5  # Find last working commit
git revert <commit-hash>

# 2. Redeploy
npm run build
pm2 restart all

# 3. Check logs
pm2 logs --err
```

---

## 📞 Support Resources

- Project Documentation: `/PROJECT_DOCUMENTATION.md`
- Cleanup Guide: `/CLEANUP_SUMMARY.md`
- Audit Files: `/audit files/` directory
- Migration Scripts: `/_archived_scripts/` directory

---

**Last Updated**: January 24, 2026  
**Maintained By**: Development Team
