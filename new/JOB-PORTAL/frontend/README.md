# InterNova - Internship Management Platform Frontend

My web-based project frontend for managing internships, candidates, companies, and admins.

## Overview
This is the frontend application for the MERN Internship Management Platform. It provides interfaces for candidates, companies, and administrators to manage internships and applications.

## Tech Stack
- React 18 - UI library
- React Router v6 - Client-side routing
- Axios - HTTP client
- Context API - State management
- Create React App (react-scripts) for development/build

## Folder Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, icons, styles
│   ├── components/      # React components
│   │   ├── shared/      # Reusable components
│   │   ├── publisher/   # Public-facing components
│   │   ├── company/     # Company dashboard components
│   │   ├── admin/       # Admin panel components
│   │   └── candidate/   # Candidate dashboard components
│   ├── context/         # React Context providers
│   ├── pages/           # Page components
│   ├── routes/          # Route protection components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service functions
│   ├── App.jsx          # Main App component
│   ├── index.js         # Entry point
│   └── main.css         # Global styles
├── .env                 # Environment variables
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1) Install dependencies
```bash
npm install
```

2) Configure environment variables:
   - Create `.env` at project root
   - Set `REACT_APP_API_URL` to your backend URL

3) Start development server
```bash
npm start
```

The app runs on http://localhost:3000 by default.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Features

### For Candidates
- Browse available internships
- Apply to internships
- Track application status
- AI-powered chatbot assistance
- Resume tips and suggestions

### For Companies
- Post internship opportunities
- Manage posted internships
- View and filter applicants
- AI-powered candidate matching
- Best candidate suggestions

### For Administrators
- Manage users (approve/delete)
- Manage all internships
- View platform analytics
- User list management
- Content moderation

## Component Architecture

### Shared Components
- `Navbar` - Top navigation bar
- `Sidebar` - Side navigation menu
- `ChatbotWidget` - AI chatbot interface
- `Footer` - Page footer

### Context Providers
- `AuthContext` - Authentication state
- `CompanyContext` - Company-specific state
- `CandidateContext` - Candidate-specific state
- `AdminContext` - Admin-specific state
- `ChatbotContext` - Chatbot state

### Route Protection
- `PrivateRoute` - Requires authentication
- `AdminRoute` - Requires admin role
- `CompanyRoute` - Requires company role
- `CandidateRoute` - Requires candidate role

## API Integration

All API calls are centralized in the `services/` directory:
- `api.js` - Axios instance with interceptors
- `authService.js` - Authentication endpoints
- `internshipService.js` - Internship CRUD operations
- `userService.js` - User management
- `chatbotService.js` - AI chatbot integration

## State Management

The application uses React Context API for state management:
- Authentication state (user, token)
- Role-based state (company, candidate, admin)
- Chatbot conversation state

## Styling

- Global styles in `main.css`
- Component-specific styles can be added as CSS modules
- Responsive design for mobile and desktop

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Internship Management Platform
```

## Build for Production

```bash
npm run build
```

The optimized build is created in the `build/` directory.

## Deployment

The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details
