# InterNova - Internship Management Platform Backend

REST API backend for the MERN Internship Management Platform, built with Express.js and MongoDB.

## Overview

This is the backend server for managing internship applications, user profiles, and admin operations. It provides secure REST endpoints with JWT-based authentication and role-based access control.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cors** - Cross-Origin Resource Sharing

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── internshipController.js
│   │   ├── applicationController.js
│   │   └── adminController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT & role-based auth
│   │   └── errorHandler.js
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Internship.js
│   │   └── Application.js
│   └── routes/               # API endpoints
│       ├── authRoutes.js
│       ├── internshipRoutes.js
│       ├── applicationRoutes.js
│       └── adminRoutes.js
├── server.js                 # Entry point
├── .env                      # Environment variables
├── package.json              # Dependencies
└── README.md                 # This file
```

## Prerequisites

- **Node.js**: v18.20.8 LTS or higher
- **npm**: v10.8.2 or higher
- **MongoDB**: Local or cloud instance (MongoDB Atlas)

## Installation

### 1. Clone and Setup

```bash
cd Project/backend
npm install
```

### 2. Configure Environment Variables

Create or update `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/internova

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB (if local)

```bash
# On Linux/Mac
mongod

# Or use MongoDB Atlas cloud instance (update MONGODB_URI in .env)
```

### 4. Run the Server

```bash
# Development mode (with auto-reload via nodemon)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## Available Scripts

### Development

```bash
npm run dev
```

Starts the server with nodemon for auto-reload on file changes.

### Production

```bash
npm start
```

Runs the server without auto-reload.

## API Endpoints

All requests should include JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user (candidate, company, admin) |
| POST | `/login` | ❌ | Login and get JWT token |
| POST | `/logout` | ❌ | Logout (client-side token removal) |
| GET | `/profile` | ✅ | Get logged-in user's profile |
| PUT | `/profile` | ✅ | Update user profile |

**Register Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "candidate" | "company" | "admin"
}
```

### Internships (`/api/internships`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ❌ | — | Get all active internships (with filters) |
| GET | `/:id` | ❌ | — | Get internship details |
| POST | `/` | ✅ | company | Create new internship |
| PUT | `/:id` | ✅ | company | Update internship |
| DELETE | `/:id` | ✅ | company | Delete internship |

**Query Filters:**
```
GET /api/internships?category=Engineering&location=New York&search=python
```

### Applications (`/api/applications`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/:internshipId/apply` | ✅ | candidate | Apply to internship |
| GET | `/candidate/applications` | ✅ | candidate | Get my applications |
| GET | `/company/applications` | ✅ | company | Get applications for my internships |
| GET | `/:id` | ✅ | — | Get application details |
| PUT | `/:id/status` | ✅ | company | Update application status |

**Application Statuses:**
- `Applied` (default)
- `Reviewed`
- `Shortlisted`
- `Rejected`
- `Accepted`

### Admin (`/api/admin`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users` | ✅ | admin | Get all users |
| GET | `/users/:id` | ✅ | admin | Get user details |
| PUT | `/users/:id/approve` | ✅ | admin | Approve/verify user |
| DELETE | `/users/:id` | ✅ | admin | Delete user |
| GET | `/analytics` | ✅ | admin | Get platform analytics |

## Database Models

### User

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: 'candidate' | 'company' | 'admin',
  phone: String,
  bio: String,
  profilePicture: String,
  isApproved: Boolean (default: true),
  isDeleted: Boolean (default: false),
  
  // Company fields
  companyName: String,
  companyWebsite: String,
  companyLocation: String,
  
  // Candidate fields
  skills: [String],
  education: {
    school: String,
    degree: String,
    field: String,
    graduationYear: Number
  },
  resume: String (URL)
}
```

### Internship

```javascript
{
  title: String,
  description: String,
  company: ObjectId (ref: User),
  location: String,
  category: String,
  startDate: Date,
  endDate: Date,
  stipend: Number,
  stipendType: 'Fixed' | 'Hourly' | 'None',
  duration: String,
  requirements: [String],
  perks: [String],
  isActive: Boolean (default: true),
  applicationCount: Number (default: 0)
}
```

### Application

```javascript
{
  internship: ObjectId (ref: Internship),
  candidate: ObjectId (ref: User),
  status: 'Applied' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Accepted',
  appliedAt: Date (default: now),
  coverLetter: String,
  resumeUrl: String
}
```

## Testing with cURL

### Register a Candidate

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "candidate"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Internships

```bash
curl -X GET http://localhost:5000/api/internships
```

### Create Internship (requires company token)

```bash
curl -X POST http://localhost:5000/api/internships \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "React Developer",
    "description": "Build responsive web apps",
    "location": "New York",
    "category": "Engineering",
    "startDate": "2024-01-15",
    "endDate": "2024-04-15",
    "stipend": 15000,
    "stipendType": "Fixed",
    "duration": "3 months",
    "requirements": ["React", "JavaScript", "CSS"],
    "perks": ["Flexible hours", "Remote"]
  }'
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message description"
}
```

Common error codes:
- `400` - Bad Request (missing/invalid fields)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Security

- **Passwords**: Hashed with bcryptjs (salt rounds: 10)
- **JWT Tokens**: Expire after 7 days
- **CORS**: Restricted to frontend URL
- **Role-Based Access**: Endpoints enforced by middleware
- **Input Validation**: Basic validation on all inputs

## Environment Variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `PORT` | ❌ | 5000 | Server port |
| `JWT_SECRET` | ✅ | — | CHANGE IN PRODUCTION |
| `NODE_ENV` | ❌ | development | Environment (development/production) |
| `FRONTEND_URL` | ❌ | http://localhost:3000 | Frontend URL for CORS |

## Troubleshooting

### MongoDB Connection Error

```bash
# Start MongoDB locally
mongod

# Or update MONGODB_URI in .env to use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/internova
```

### Port Already in Use

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### JWT Token Issues

- Ensure `JWT_SECRET` is set in `.env`
- Token expires after 7 days; users need to re-login
- Verify token format: `Authorization: Bearer <token>`

### CORS Errors

- Check `FRONTEND_URL` in `.env` matches frontend URL
- Default: `http://localhost:3000`

## Performance Tips

- Add database indexing for frequently queried fields
- Implement pagination for large result sets
- Use caching (Redis) for popular internships
- Monitor request/response times with logging

## Deployment

### Heroku

```bash
heroku create internova-backend
git push heroku main
heroku config:set MONGODB_URI=<your_mongodb_atlas_url>
heroku config:set JWT_SECRET=<strong_random_secret>
```

### AWS EC2 / DigitalOcean

1. SSH into server
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables in `.env`
5. Run `npm install && npm start`
6. Use PM2 for process management:

```bash
npm install -g pm2
pm2 start server.js --name "internova-api"
pm2 startup
pm2 save
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t internova-backend .
docker run -p 5000:5000 -e MONGODB_URI=<mongo_url> internova-backend
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test all endpoints
4. Submit a pull request

## License

MIT
