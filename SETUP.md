# InterNova - Full Stack Setup Guide

Complete setup and installation guide for running the InterNova MERN Internship Management Platform.

## Project Overview

**Frontend**: React 18 (Port 3000)  
**Backend**: Express.js (Port 5000)  
**Database**: MongoDB  

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18+ (Recommended: v18.20.8 LTS)
  ```bash
  node --version
  ```

- **npm**: v10+ (comes with Node.js)
  ```bash
  npm --version
  ```

- **MongoDB**: Local or Cloud instance
  - **Local**: [Install MongoDB Community](https://docs.mongodb.com/manual/installation/)
  - **Cloud**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

- **Git**: For version control
  ```bash
  git --version
  ```

## Quick Start (3 Steps)

### Step 1: Set Up Backend

```bash
cd Project/backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file and set:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A strong random secret
# - FRONTEND_URL: http://localhost:3000

# Start backend server
npm run dev
```

Expected output:
```
╔════════════════════════════════════════╗
║  InterNova Backend Server              ║
║  Server running on port 5000           ║
║  Environment: development              ║
╚════════════════════════════════════════╝
```

### Step 2: Set Up Frontend

```bash
cd Project/frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Frontend will start on `http://localhost:3000`

### Step 3: Test Connection

- Open http://localhost:3000 in your browser
- Register a new account (candidate/company/admin)
- Check browser console for any errors
- Check backend terminal for requests

## Database Setup

### Option 1: Local MongoDB

#### Linux/Mac

```bash
# Install MongoDB
# Ubuntu/Debian:
sudo apt-get install -y mongodb

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify connection
mongosh
# Type: show dbs
# Type: exit
```

#### Windows

- Download [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- Run installer
- Start MongoDB service from Services
- Or run mongod manually: `mongod`

#### macOS

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start service
brew services start mongodb-community

# Verify
mongosh
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster (free tier)
4. Create database user
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/internova
   ```
6. Update `.env` in backend:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/internova
   ```

## Environment Configuration

### Backend `.env`

Create `/Project/backend/.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/internova

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: Email notifications
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password
```

### Frontend `.env`

Create `/Project/frontend/.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Optional
REACT_APP_NAME=InterNova
```

## Running the Application

### Terminal 1: Start Backend

```bash
cd Project/backend
npm run dev
```

### Terminal 2: Start Frontend

```bash
cd Project/frontend
npm run dev
```

### Browser

Open http://localhost:3000

## API Endpoints Reference

All endpoints are prefixed with `/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (auth required)
- `PUT /auth/profile` - Update profile (auth required)

### Internships
- `GET /internships` - List all internships
- `GET /internships/:id` - Get internship details
- `POST /internships` - Create internship (company only)
- `PUT /internships/:id` - Update internship (company only)
- `DELETE /internships/:id` - Delete internship (company only)

### Applications
- `POST /applications/:internshipId/apply` - Apply to internship
- `GET /applications/candidate/applications` - Get my applications
- `GET /applications/company/applications` - Get applications (company)
- `PUT /applications/:id/status` - Update status (company)

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user details
- `PUT /admin/users/:id/approve` - Approve user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/analytics` - Get platform analytics

## Testing

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

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Or start mongod manually
mongod
```

### Port Already in Use

**Error**: `Error: listen EADDRINUSE :::5000`

**Solution**:
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### CORS Error in Browser

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Ensure backend is running
2. Check `FRONTEND_URL` in `.env` matches your frontend URL
3. Verify backend CORS middleware is enabled

### API Not Responding

**Debug steps**:
```bash
# Test backend health
curl http://localhost:5000/health

# Check backend logs for errors
# Look in terminal where backend is running

# Verify API URL in frontend
# Open browser DevTools > Network tab
# Check request URLs are correct
```

### JWT Token Issues

**Error**: `Invalid or expired token`

**Solution**:
- Ensure `JWT_SECRET` is set in `.env`
- Token expires after 7 days; user must login again
- Check token format in header: `Authorization: Bearer <token>`

## Project Structure

```
Project/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, error handling
│   │   ├── models/            # MongoDB schemas
│   │   └── routes/            # API endpoints
│   ├── server.js              # Entry point
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── README.md
│
└── frontend/                   # React app
    ├── src/
    │   ├── components/        # React components
    │   ├── pages/             # Page components
    │   ├── routes/            # Route protection
    │   ├── services/          # API calls
    │   ├── context/           # State management
    │   ├── hooks/             # Custom hooks
    │   └── App.jsx
    ├── public/
    ├── package.json
    ├── .env                   # Environment variables
    └── README.md
```

## Development Workflow

### Making Changes to Backend

1. Backend files auto-reload via nodemon
2. Check terminal for errors
3. Refresh frontend in browser to see changes

### Making Changes to Frontend

1. Frontend files auto-reload via React hot reload
2. Check browser console for errors
3. Changes appear instantly in browser

### Database Changes

- Models are defined in `backend/src/models/`
- Collections are created automatically on first use
- To reset database:
  ```bash
  # Connect to MongoDB
  mongosh
  
  # Switch to database
  use internova
  
  # Delete all collections
  db.dropDatabase()
  ```

## Deployment

### Deploy Backend

**Option 1: Heroku**
```bash
heroku create internova-api
git push heroku main
heroku config:set MONGODB_URI=<mongo_url>
heroku config:set JWT_SECRET=<secret>
```

**Option 2: AWS/DigitalOcean**
- SSH into server
- Clone repository
- Install Node.js
- Set `.env` variables
- Run `npm install && npm start`
- Use PM2 for process management

**Option 3: Docker**
```bash
docker build -t internova-backend -f backend/Dockerfile .
docker run -p 5000:5000 internova-backend
```

### Deploy Frontend

**Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
- Connect GitHub
- Build command: `npm run build`
- Publish: `build`

**Option 3: AWS S3 + CloudFront**
```bash
npm run build
aws s3 sync build/ s3://bucket-name
```

## Performance Tips

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Pagination**: Implement for large result sets
3. **Caching**: Use Redis for popular internships
4. **Compression**: Enable gzip in Express
5. **Code Splitting**: React.lazy() for components
6. **Bundle Analysis**: `npm run build` with source maps

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string in production
- [ ] Use HTTPS in production
- [ ] Set `MONGODB_URI` with strong credentials
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Set CORS to specific domains only
- [ ] Add rate limiting for API endpoints
- [ ] Hash passwords (already done with bcryptjs)
- [ ] Validate all user inputs
- [ ] Use HTTPS-only cookies for tokens

## Support

For issues or questions:
1. Check `/backend/README.md` for API docs
2. Check `/frontend/README.md` for UI docs
3. Review error messages in terminal/console
4. Check troubleshooting section above

## Next Steps

1. ✅ Set up backend with MongoDB
2. ✅ Set up frontend
3. Register test accounts (candidate, company, admin)
4. Test core features (post internship, apply, view applications)
5. Deploy to production

---

**Last Updated**: December 23, 2025
