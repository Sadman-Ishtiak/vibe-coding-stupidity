# InterNova - Job Portal Application

## Project Overview

InterNova is a full-stack MERN (MongoDB, Express, React, Node.js) job portal application that connects job seekers with employers. The platform enables candidates to search and apply for jobs, while companies can post job listings and manage applicants.

### Key Features
- **Dual User Roles**: Separate flows for candidates and companies
- **Authentication System**: Secure JWT-based auth with refresh tokens
- **Email Verification**: OTP-based email verification for new accounts
- **Profile Management**: Complete profile creation and editing
- **Job Management**: Companies can post, edit, and delete job listings
- **Application System**: Candidates can apply for jobs and track applications
- **Bookmarking**: Save favorite jobs for later review
- **Image Upload**: Company logos and candidate profile pictures with automatic resizing
- **Password Reset**: Secure password reset flow with email tokens
- **District Validation**: Bangladesh district-based location system

---

## Tech Stack

### Frontend (`/client`)
- **Framework**: React 19.2.0 with Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **Styling**: 
  - Bootstrap 5.3.8 for UI components
  - Sass 1.97.1 for custom styles
  - Custom CSS from template
- **UI Libraries**:
  - Swiper 12.0.3 for carousels
  - GLightbox 3.3.1 for lightboxes
  - Choices.js 11.1.0 for enhanced selects
  - noUiSlider 15.8.1 for range sliders
- **Utilities**:
  - html-react-parser for HTML content rendering
  - Masonry layout for grid displays

### Backend (`/server`)
- **Runtime**: Node.js with Express 5.2.1
- **Database**: MongoDB with Mongoose 9.1.2
- **Authentication**: 
  - bcryptjs 3.0.3 for password hashing
  - jsonwebtoken 9.0.3 for JWT tokens
  - cookie-parser 1.4.6 for cookie handling
- **File Upload**: 
  - Multer 2.0.2 for file handling
  - Sharp 0.34.5 for image processing
- **Email**: Nodemailer 7.0.12 for sending emails
- **Validation**: express-validator 7.3.1
- **Security**: CORS 2.8.5

### Database
- **MongoDB**: Document-based NoSQL database
- **Models**: User, Candidate, Company, Job, Application

---

## Folder Structure

### Client Structure (`/client/src`)

```
src/
├── assets/          # Static assets (images, CSS, fonts, libraries)
│   ├── css/         # Stylesheets
│   ├── images/      # Image assets
│   ├── fonts/       # Web fonts
│   └── libs/        # Third-party libraries (Bootstrap, Swiper, etc.)
├── components/      # Reusable React components
│   ├── cards/       # Job, company card components
│   ├── common/      # Shared components (modals, inputs, pagination)
│   ├── home/        # Homepage-specific components
│   ├── jobs/        # Job listing components
│   ├── layout/      # Layout components (Footer, Navbar, Layout)
│   └── navbar/      # Navigation components
├── config/          # Configuration files
│   ├── api.js       # API base URL configuration
│   ├── api.paths.js # API endpoint paths
│   └── app.js       # Application constants
├── context/         # React Context providers (currently empty)
├── data/            # Mock/static data (UNUSED - candidates for removal)
├── hooks/           # Custom React hooks
│   ├── useAsync.js
│   ├── useAuthUI.js
│   ├── useBookmark.js
│   ├── useBootstrap.js
│   ├── useJobFilters.js
│   ├── useJobs.js
│   └── useScrollNavbar.js
├── pages/           # Page components
│   ├── auth/        # Authentication pages (SignIn, SignUp, ResetPassword, etc.)
│   ├── candidates/  # Candidate pages (Profile, Applied Jobs, Bookmarks)
│   ├── companies/   # Company pages (Profile, Post Job, Manage Jobs)
│   └── jobs/        # Job pages (List, Grid, Details)
├── routes/          # Routing configuration
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── services/        # API service layer
│   ├── api/         # HTTP client configuration
│   ├── auth.service.js
│   ├── auth.session.js
│   ├── candidates.service.js
│   ├── companies.service.js
│   ├── jobs.service.js
│   └── applications.service.js
├── utils/           # Utility functions
│   ├── authLogger.js
│   ├── imageHelpers.js
│   ├── profileCompletionHelper.js
│   └── validators.js
├── App.jsx          # Main App component
└── main.jsx         # Application entry point
```

### Server Structure (`/server`)

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/           # Route handlers
│   ├── applicationController.js
│   ├── authController.js
│   ├── candidateController.js
│   ├── companyController.js
│   └── jobController.js
├── mail/                  # Email system
│   ├── mailSender.js      # Email sending logic
│   ├── mailTemplates.js   # HTML email templates
│   └── mailTransporter.js # Nodemailer configuration
├── middlewares/           # Express middlewares
│   ├── authMiddleware.js
│   ├── candidateAuthMiddleware.js
│   ├── companyAuthMiddleware.js
│   ├── errorMiddleware.js
│   ├── imageResize.js
│   ├── optionalAuthMiddleware.js
│   ├── profileCompletionGuard.js
│   ├── rateLimitMiddleware.js
│   ├── roleMiddleware.js
│   └── uploadMiddleware.js
├── models/                # Mongoose schemas
│   ├── Application.js
│   ├── Candidate.js
│   ├── Company.js
│   ├── Job.js
│   └── User.js
├── routes/                # API routes
│   ├── applicationRoutes.js
│   ├── authRoutes.js
│   ├── candidateRoutes.js
│   ├── companyRoutes.js
│   └── jobRoutes.js
├── scripts/               # Database migration scripts
│   ├── migrate-application-companyid.js
│   └── test_update_profile.js
├── uploads/               # User-uploaded files
├── utils/                 # Utility functions
│   ├── authLogger.js
│   ├── districtValidator.js
│   ├── emailService.js
│   ├── generateToken.js
│   ├── otpService.js
│   ├── profileCompletion.js
│   └── validateEnv.js
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── fix-refresh-token.js   # Maintenance script
└── smoke-test.js          # Test script
```

---

## Environment Setup

### Required Environment Variables

#### Client (`.env` in `/client`)
```env
VITE_API_URL=http://localhost:5000
```

#### Server (`.env` in `/server`)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/internova

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif
```

### Installation & Running

#### 1. Install Dependencies
```bash
# Install root dependencies (if any)
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

#### 2. Setup Database
- Install MongoDB locally or use MongoDB Atlas
- Create a database named `internova`
- Update `MONGODB_URI` in server `.env`

#### 3. Run Development Servers

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

#### 4. Build for Production

**Client:**
```bash
cd client
npm run build
# Output in /client/dist
```

**Server:**
```bash
cd server
npm start
```

---

## Key Application Flows

### 1. Authentication Flow

#### Registration
1. User submits registration form (email, password, role, username/company name)
2. Backend validates input using express-validator
3. Password is hashed using bcryptjs
4. User record created in `users` collection
5. Corresponding Candidate or Company profile created
6. OTP sent to email for verification
7. JWT tokens (access + refresh) generated and returned
8. Frontend stores tokens in localStorage/cookies

#### Email Verification
1. User receives OTP via email
2. User enters OTP on verify page
3. Backend validates OTP and marks email as verified
4. User redirected to profile completion

#### Login
1. User submits email + password
2. Backend validates credentials
3. Checks if email is verified
4. Generates new JWT tokens
5. Returns user data + tokens
6. Frontend stores tokens and user info

#### Password Reset
1. User requests password reset with email
2. Backend generates unique token
3. Reset link emailed to user
4. User clicks link, redirected to reset page
5. User submits new password with token
6. Backend validates token and updates password
7. User redirected to login

### 2. Company → Job → Application Flow

#### Company Posts Job
1. Company completes profile (required before posting)
2. Navigates to "Post Job" page
3. Fills job details form (title, description, location, salary, etc.)
4. Submits form
5. Backend validates data
6. Job created in `jobs` collection with companyId reference
7. Job appears in job listings

#### Candidate Views Jobs
1. Visits job listing pages (grid or list view)
2. Optionally filters by location, experience, job type
3. Views job details
4. Can bookmark jobs for later

#### Candidate Applies for Job
1. Candidate must complete profile first
2. Clicks "Apply Now" on job details
3. Modal opens with application form (cover letter optional)
4. Submits application
5. Backend creates Application record
6. Email sent to company about new applicant
7. Email sent to candidate confirming application

#### Company Manages Applications
1. Company navigates to "Manage Applicants"
2. Views all applications for their jobs
3. Can filter by job or status
4. Can update application status (pending, shortlisted, rejected)
5. Status change triggers email to candidate

### 3. Email Flow

The application sends emails for:
- Email verification (OTP)
- Password reset links
- Welcome emails
- Application confirmations
- Application status updates
- Job posting notifications

**Email Service**: Uses Nodemailer with configurable SMTP
**Templates**: HTML templates in `/server/mail/mailTemplates.js`
**Sending**: Centralized in `/server/mail/mailSender.js`

### 4. Image Upload Flow

#### Profile Pictures & Company Logos
1. User selects image file (max 5MB)
2. Frontend validates file type and size
3. File sent to backend via FormData
4. Multer middleware intercepts upload
5. Sharp middleware resizes image (800x800 for logos, smaller for profiles)
6. File saved to `/server/uploads/` directory
7. File path stored in database
8. Frontend displays uploaded image

**Allowed Formats**: JPG, JPEG, PNG, GIF
**Storage**: Local filesystem in `/server/uploads/`
**Serving**: Express static middleware serves uploaded files

---

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token
- `POST /verify-email` - Verify email with OTP
- `POST /resend-otp` - Resend OTP
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /me` - Get current user

### Jobs (`/api/jobs`)
- `GET /` - Get all jobs (with filters)
- `GET /:id` - Get job by ID
- `POST /` - Create job (company only)
- `PUT /:id` - Update job (company only)
- `DELETE /:id` - Delete job (company only)
- `GET /company/:companyId` - Get jobs by company
- `POST /:id/bookmark` - Bookmark job (candidate only)
- `DELETE /:id/bookmark` - Remove bookmark

### Companies (`/api/companies`)
- `GET /` - Get all companies
- `GET /:id` - Get company by ID
- `GET /profile` - Get own company profile
- `PUT /profile` - Update company profile
- `PUT /logo` - Update company logo

### Candidates (`/api/candidates`)
- `GET /` - Get all candidates
- `GET /:id` - Get candidate by ID
- `GET /profile` - Get own candidate profile
- `PUT /profile` - Update candidate profile
- `PUT /profile-picture` - Update profile picture
- `GET /bookmarks` - Get bookmarked jobs

### Applications (`/api/applications`)
- `POST /` - Apply for job
- `GET /candidate` - Get candidate's applications
- `GET /company` - Get company's received applications
- `PUT /:id/status` - Update application status (company only)
- `GET /job/:jobId` - Get applications for a job

---

## Database Schema Summary

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed),
  role: String ('candidate' | 'company'),
  emailVerified: Boolean,
  emailVerificationOTP: String,
  otpExpiry: Date,
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  refreshToken: String,
  refreshTokenExpiry: Date
}
```

### Candidate Model
```javascript
{
  userId: ObjectId (ref: User),
  fullName: String,
  email: String,
  phone: String,
  profilePicture: String,
  skills: [String],
  experience: String,
  education: String,
  resume: String,
  location: String,
  district: String,
  bio: String,
  bookmarkedJobs: [ObjectId] (ref: Job)
}
```

### Company Model
```javascript
{
  userId: ObjectId (ref: User),
  companyName: String,
  email: String,
  phone: String,
  logo: String,
  description: String,
  website: String,
  location: String,
  district: String,
  industry: String,
  companySize: String
}
```

### Job Model
```javascript
{
  companyId: ObjectId (ref: Company),
  title: String,
  description: String,
  requirements: [String],
  location: String,
  district: String,
  employmentType: String,
  experienceLevel: String,
  salaryRange: String,
  skills: [String],
  deadline: Date,
  status: String ('active' | 'closed'),
  applicantCount: Number
}
```

### Application Model
```javascript
{
  jobId: ObjectId (ref: Job),
  candidateId: ObjectId (ref: Candidate),
  companyId: ObjectId (ref: Company),
  coverLetter: String,
  status: String ('pending' | 'shortlisted' | 'rejected'),
  appliedAt: Date
}
```

---

## Maintenance & Development Notes

### Where to Add New Features

#### Adding a New Candidate Feature
1. **Backend**: Add route in `/server/routes/candidateRoutes.js`
2. **Backend**: Add controller function in `/server/controllers/candidateController.js`
3. **Frontend**: Add service method in `/client/src/services/candidates.service.js`
4. **Frontend**: Create/update page in `/client/src/pages/candidates/`
5. **Frontend**: Update routing in `/client/src/routes/AppRoutes.jsx`

#### Adding a New Company Feature
1. **Backend**: Add route in `/server/routes/companyRoutes.js`
2. **Backend**: Add controller in `/server/controllers/companyController.js`
3. **Frontend**: Add service in `/client/src/services/companies.service.js`
4. **Frontend**: Create/update page in `/client/src/pages/companies/`

#### Adding Email Notifications
1. Create template in `/server/mail/mailTemplates.js`
2. Add sending logic in relevant controller
3. Use `sendEmail()` from `/server/mail/mailSender.js`

### Where to Modify Safely

#### UI/Styling
- **Bootstrap Variables**: Create custom SCSS in `/client/src/assets/css/`
- **Component Styles**: Add styles in component files or separate CSS modules
- **Global Styles**: Modify `/client/src/App.css`

#### Business Logic
- **Validation**: Add validators in `/server/middlewares/` or use express-validator in routes
- **Authorization**: Modify middlewares in `/server/middlewares/authMiddleware.js`
- **Data Processing**: Add utilities in `/server/utils/` or `/client/src/utils/`

#### Database Queries
- Modify controller files in `/server/controllers/`
- Add model methods in `/server/models/`
- **WARNING**: Always test queries thoroughly before deploying

### Code Organization Best Practices

1. **Keep Controllers Thin**: Move complex logic to utility functions
2. **Reuse Middlewares**: Create reusable middlewares for common tasks
3. **Service Layer**: Keep API calls in service files, not in components
4. **Custom Hooks**: Extract reusable React logic into custom hooks
5. **Error Handling**: Always wrap async operations in try-catch
6. **Validation**: Validate on both frontend and backend

### Testing Checklist

Before deploying changes:
- [ ] Test registration flow
- [ ] Test login/logout
- [ ] Test email verification
- [ ] Test password reset
- [ ] Test job creation
- [ ] Test job application
- [ ] Test profile updates
- [ ] Test image uploads
- [ ] Check email sending
- [ ] Verify authentication persists on refresh
- [ ] Test responsive design
- [ ] Check console for errors

---

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution**: Check if MongoDB is running locally or verify MongoDB Atlas connection string

### Issue: "Emails not sending"
**Solution**: 
1. Verify EMAIL_USER and EMAIL_PASSWORD in `.env`
2. For Gmail, enable "App Passwords" in Google Account settings
3. Check SMTP settings match your provider

### Issue: "Images not uploading"
**Solution**: 
1. Check file size < 5MB
2. Verify file type is allowed
3. Ensure `/server/uploads/` directory exists and has write permissions

### Issue: "Token expired" errors
**Solution**: 
1. Check system clock is accurate
2. Verify JWT secrets are set
3. Ensure refresh token flow is working

### Issue: "CORS errors"
**Solution**: 
1. Verify FRONTEND_URL in server `.env`
2. Check CORS configuration in `/server/app.js`

---

## Security Considerations

1. **Password Security**: Passwords are hashed with bcrypt (10 rounds)
2. **JWT Tokens**: Access tokens expire in 15 minutes, refresh tokens in 7 days
3. **HTTP-Only Cookies**: Refresh tokens stored in HTTP-only cookies
4. **Email Verification**: Mandatory before full account access
5. **Input Validation**: All inputs validated with express-validator
6. **File Upload**: File types and sizes restricted
7. **Rate Limiting**: API rate limiting implemented (currently basic)

### Production Hardening Required

Before production deployment:
- [ ] Add HTTPS/SSL certificates
- [ ] Implement proper rate limiting (per IP)
- [ ] Add request logging
- [ ] Set secure cookie flags (`secure: true`, `sameSite: 'strict'`)
- [ ] Sanitize all user inputs against XSS
- [ ] Add CSRF protection
- [ ] Implement API key authentication for sensitive endpoints
- [ ] Add database connection pooling
- [ ] Setup proper logging (Winston/Morgan)
- [ ] Add monitoring and error tracking (Sentry)
- [ ] Implement proper session management
- [ ] Add database backups

---

## Deployment Guide

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Output directory: `dist`
3. Set environment variable: `VITE_API_URL=https://your-backend-url`

### Backend Deployment (Railway/Heroku/AWS)
1. Set all environment variables
2. Use `npm start` as start command
3. Ensure MongoDB connection is accessible
4. Configure CORS for production frontend URL

### Database (MongoDB Atlas)
1. Create cluster
2. Whitelist deployment server IP
3. Update MONGODB_URI in production environment

---

## Future Scalability Considerations

### Identified Issues

1. **Large Controllers**: Some controllers have multiple responsibilities
   - Consider breaking into smaller, focused handlers
   - Example: `jobController.js` handles CRUD + filtering + bookmarking

2. **Tight Coupling**: Frontend components sometimes directly manipulate state
   - Consider implementing state management (Redux/Zustand)
   - Move complex state logic to dedicated stores

3. **Repeated Validation Logic**: Similar validation patterns across routes
   - Create reusable validation middleware chains
   - Centralize common validators

4. **Hardcoded Values**: Some configuration values are hardcoded
   - Move to environment variables or config files
   - Examples: pagination limits, file size limits, token expiry times

5. **No Caching**: Frequent database queries for static data
   - Implement Redis for caching company/job lists
   - Add query result caching

6. **File Storage**: Local filesystem for uploads
   - Consider cloud storage (AWS S3, Cloudinary)
   - Implement CDN for static assets

7. **Email Queue**: Synchronous email sending blocks requests
   - Implement job queue (Bull, BullMQ)
   - Process emails asynchronously

8. **Search Functionality**: Basic filtering only
   - Implement full-text search (MongoDB Atlas Search or Elasticsearch)
   - Add autocomplete functionality

9. **Real-time Features**: No real-time updates
   - Add WebSocket support for notifications
   - Implement real-time application status updates

10. **Testing**: No automated tests
    - Add unit tests (Jest/Vitest)
    - Add integration tests (Supertest)
    - Add E2E tests (Cypress/Playwright)

### Suggested Improvements

#### Performance
- Implement pagination on all list endpoints
- Add database indexing for frequently queried fields
- Lazy load images and components
- Implement virtual scrolling for long lists

#### Code Quality
- Add TypeScript for better type safety
- Implement proper error boundaries
- Add code splitting for faster initial load
- Set up ESLint and Prettier for code consistency

#### Features
- Add advanced search with filters
- Implement company/candidate messaging system
- Add job recommendations based on skills
- Implement analytics dashboard
- Add resume parsing functionality

---

## Contact & Support

For questions or issues:
1. Check this documentation first
2. Review `/audit files/` for implementation details
3. Check Git commit history for recent changes
4. Test in development environment before production

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Maintained By**: Development Team
