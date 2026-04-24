# InternNova Backend

A production-ready MERN backend for a Job Portal built with Node.js, Express.js, MongoDB, and Mongoose.

## Architecture

```
backend/
├── config/
│   └── db.js                 # MongoDB connection setup
├── models/
│   ├── User.js               # User schema (Candidates & Recruiters)
│   ├── Job.js                # Job posting schema
│   ├── Company.js            # Company schema
│   └── Application.js        # Job application schema
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── jobsController.js     # Job management logic
│   ├── companiesController.js # Company management logic
│   └── applicationsController.js # Application logic
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── jobRoutes.js          # Job endpoints
│   ├── companyRoutes.js      # Company endpoints
│   └── applicationRoutes.js  # Application endpoints
├── middlewares/
│   ├── auth.js               # JWT authentication & authorization
│   └── errorHandler.js       # Global error handling
├── utils/
│   ├── tokenUtils.js         # JWT token generation
│   └── response.js           # Consistent response formatting
├── validations/              # Input validation rules
├── app.js                    # Express app setup
├── server.js                 # Server entry point
└── package.json              # Dependencies
```

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **dotenv** - Environment configuration
- **CORS** - Cross-origin requests
- **express-validator** - Input validation

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud instance)

### Setup

1. **Clone and navigate to backend directory**
```bash
cd Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file** (copy from .env.example)
```bash
cp .env.example .env
```

4. **Configure .env**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/internnova
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

6. **Run the server**
```bash
# Development with watch mode
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/sign-up` | Register new user | ❌ |
| POST | `/api/auth/sign-in` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/sign-out` | Logout user | ✅ |

### Jobs

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/jobs` | List all jobs | ❌ | - |
| GET | `/api/jobs/:jobId` | Get job details | ❌ | - |
| POST | `/api/jobs` | Create job | ✅ | recruiter |
| PUT | `/api/jobs/:jobId` | Update job | ✅ | recruiter |
| DELETE | `/api/jobs/:jobId` | Delete job | ✅ | recruiter |

### Companies

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/companies` | List all companies | ❌ | - |
| GET | `/api/companies/:companyId` | Get company details | ❌ | - |
| POST | `/api/companies` | Create company | ✅ | recruiter |
| PUT | `/api/companies/:companyId` | Update company | ✅ | recruiter |
| DELETE | `/api/companies/:companyId` | Delete company | ✅ | recruiter |

### Applications

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/applications/:jobId/apply` | Apply to job | ✅ | candidate |
| GET | `/api/applications/job/:jobId` | Get job applications | ✅ | recruiter |
| GET | `/api/applications/user/my-applications` | Get my applications | ✅ | candidate |
| PUT | `/api/applications/:applicationId/status` | Update app status | ✅ | recruiter |
| DELETE | `/api/applications/:applicationId` | Delete application | ✅ | - |

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Authentication

The backend uses JWT (JSON Web Tokens) for authentication.

### Login Flow
1. User sends credentials to `/api/auth/sign-in`
2. Server validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. For subsequent requests, token is sent in Authorization header:
   ```
   Authorization: Bearer <token>
   ```

### Roles

- **candidate** - Job seekers who can apply to jobs
- **recruiter** - Employers who can post jobs and manage applications

## Database Models

### User
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  accountType: 'candidate' | 'recruiter',
  profile: {
    name: String,
    title: String,
    location: String,
    avatarUrl: String,
    skills: [String],
    bio: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Job
```javascript
{
  title: String (required),
  companyId: ObjectId (required),
  companyName: String,
  companyLogoUrl: String,
  location: String,
  salaryText: String,
  badges: [String],
  experienceText: String,
  notes: String,
  descriptionHtml: String,
  recruiter: ObjectId,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Company
```javascript
{
  name: String (required),
  logoUrl: String (required),
  location: String (required),
  website: String,
  description: String,
  recruiter: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Application
```javascript
{
  jobId: ObjectId (required),
  candidateId: ObjectId (required),
  name: String,
  email: String,
  message: String,
  resumeUrl: String,
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling middleware
- ✅ Environment variable configuration

## Frontend Integration

The frontend expects:
- Base URL: `http://localhost:5000/api`
- Authorization header format: `Bearer <token>`
- Response format with `success`, `message`, `data` fields

Update your frontend `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Development Guidelines

### Adding a New Endpoint

1. Create controller function in appropriate file
2. Add route definition in routes file
3. Use `sendSuccess` and `sendError` utilities for consistent responses
4. Apply middleware (auth, role checks) as needed
5. Document in this README

### Error Handling

All errors are caught by the global error handler. Controllers should use:
- `sendError(res, statusCode, message, code)`

## Production Checklist

Before deploying:
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Update `MONGODB_URI` to production database
- [ ] Update `CORS_ORIGIN` to production frontend URL
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Add input validation
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enable CORS restrictions

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in .env
- Verify network connectivity

### JWT Token Errors
- Check token format in Authorization header
- Verify `JWT_SECRET` matches frontend
- Check token expiration

### CORS Errors
- Verify `CORS_ORIGIN` in .env matches frontend URL
- Check browser console for specific CORS error

## License

MIT

## Support

For issues and questions, please refer to the project documentation.
