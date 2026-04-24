# InterNova - Internship Management Platform

A modern MERN stack web application for managing internship programs, connecting candidates with opportunities, and streamlining the application process.

## Overview

InterNova is a full-featured internship management platform built with:

- **Frontend**: React 18 with React Router
- **Backend**: Express.js with Node.js
- **Database**: MongoDB
- **Authentication**: JWT-based with role-based access control

### Key Features

✨ **For Candidates**
- Browse and search internship opportunities
- Apply to internships
- Track application status
- AI-powered resume tips
- Interactive chatbot assistance

💼 **For Companies**
- Post internship positions
- Manage applications
- AI-powered candidate matching
- View applicant profiles
- Accept/reject candidates

🔐 **For Administrators**
- Manage all users and internships
- Approve/delete users
- View platform analytics
- Content moderation

## Quick Start

**For complete setup instructions, see [SETUP.md](./SETUP.md)**

### Minimum Requirements

- Node.js v18+ (v24 also supported)
- npm v10+
- MongoDB local or cloud instance

### 30-Second Start

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Project Structure

```
Project/
├── backend/           # Express API server
│   ├── src/
│   │   ├── models/   # MongoDB schemas
│   │   ├── routes/   # API endpoints
│   │   ├── controllers/ # Business logic
│   │   └── middleware/  # Auth & error handling
│   ├── server.js     # Main server file
│   └── package.json
│
├── frontend/          # React web app
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API client
│   │   ├── context/   # State management
│   │   └── App.jsx    # Root component
│   ├── public/        # Static assets
│   └── package.json
│
├── SETUP.md           # Complete setup guide
└── README.md          # This file
```

## Documentation

- **[SETUP.md](./SETUP.md)** - Complete installation and configuration guide
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation

## Technology Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling

## Environment Setup

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/internova
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

```bash
# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

### Production Build

```bash
# Build frontend
cd frontend && npm run build

# Start backend with production build
cd backend && npm start
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

**Authentication**
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get profile
- `PUT /auth/profile` - Update profile

**Internships**
- `GET /internships` - List all
- `GET /internships/:id` - Get details
- `POST /internships` - Create (company)
- `PUT /internships/:id` - Update (company)
- `DELETE /internships/:id` - Delete (company)

**Applications**
- `POST /applications/:internshipId/apply` - Apply
- `GET /applications/candidate/applications` - My applications
- `GET /applications/company/applications` - Received applications
- `PUT /applications/:id/status` - Update status

**Admin**
- `GET /admin/users` - List users
- `GET /admin/users/:id` - User details
- `PUT /admin/users/:id/approve` - Approve user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/analytics` - Analytics

## User Roles

| Role | Permissions |
|------|-------------|
| **Candidate** | Browse internships, apply, track applications |
| **Company** | Post internships, manage applications, view applicants |
| **Admin** | Manage users, internships, analytics |

## Testing

### Create a Test Account

**Candidate:**
```json
{
  "firstName": "Test",
  "lastName": "Candidate",
  "email": "candidate@test.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "candidate"
}
```

**Company:**
```json
{
  "firstName": "Tech",
  "lastName": "Corp",
  "email": "company@test.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "company"
}
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
mongod
```

### Port Already in Use
```bash
# Kill process on port 5000/3000
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
- Check backend is running on port 5000
- Verify `FRONTEND_URL` in `.env`

### Dependencies Not Installed
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

See [SETUP.md](./SETUP.md) for detailed troubleshooting.

## Deployment

### Backend Deployment Options
- **Heroku**: Free dyno available
- **AWS EC2**: Full control
- **DigitalOcean**: Affordable droplets
- **Vercel/Netlify**: Serverless (requires API refactor)

### Frontend Deployment Options
- **Vercel**: Best for React
- **Netlify**: Easy GitHub integration
- **AWS S3 + CloudFront**: CDN distribution

See [SETUP.md](./SETUP.md) for deployment instructions.

## Performance

- ✅ Code splitting in React
- ✅ API response caching
- ✅ Optimized MongoDB queries
- ✅ Gzip compression
- ✅ Lazy loading for images

## Security

- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Role-based access control
- ✅ XSS protection
- ✅ SQL injection prevention (MongoDB)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feature requests:

1. Check [SETUP.md](./SETUP.md) troubleshooting section
2. Review backend/frontend README files
3. Check browser console for error messages
4. Check terminal logs for backend errors

## Authors

- **Developer**: Your Name
- **Last Updated**: December 23, 2025

---

**Start here**: [SETUP.md](./SETUP.md) for complete installation instructions.


