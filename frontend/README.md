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
- **Node.js**: v18.20.8 LTS or higher
- **npm**: v10.8.2 or higher (comes with Node.js)
- **git**: For version control

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Project/frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables:
   - Create `.env` file in the `frontend/` directory
   - Set required variables:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

4. Start the development server
```bash
npm run dev
```

The app runs on http://localhost:3000 by default.

## Dependencies & Versions

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI library for building components |
| `react-dom` | ^18.2.0 | React rendering to the DOM |
| `react-router-dom` | ^6.20.0 | Client-side routing and navigation |
| `axios` | ^1.6.2 | HTTP client for API calls |
| `react-scripts` | ^5.0.1 | Create React App build scripts |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/react` | ^18.2.43 | TypeScript type definitions for React |
| `@types/react-dom` | ^18.2.17 | TypeScript type definitions for React DOM |

### System Requirements
- Node.js: v18.20.8 (LTS Hydrogen)
- npm: v10.8.2
- Modern browser (Chrome, Firefox, Safari, Edge)

## Available Scripts

### Development Mode
```bash
npm run dev
```
- Starts the development server with hot module reloading
- Watches for file changes and auto-refreshes the browser
- Source maps enabled for debugging
- Slower compilation (optimized for fast feedback)
- Runs on `http://localhost:3000`

### Production Build
```bash
npm run build
```
- Creates an optimized production build
- Minifies and bundles code for deployment
- Output in `build/` directory
- Significantly faster load times
- Smaller bundle size (~200KB gzipped)

### Testing
```bash
npm test
```
- Runs Jest test suite
- Watch mode enabled by default
- Coverage reporting available

### Start Server (alias)
```bash
npm start
```
- Equivalent to `npm run dev`
- Use `npm run dev` for consistency

### Eject (Advanced)
```bash
npm run eject
```
⚠️ **WARNING**: This operation is irreversible. Only use if you need to customize webpack configuration beyond Create React App's defaults.

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

- **Global styles**: `src/main.css` - Applied to entire application
- **Component-specific styles**: Each component folder has accompanying `.css` files
- **Responsive design**: Mobile-first approach with media queries
- **CSS Framework**: Custom CSS (no Bootstrap or Tailwind)
- **Media queries**:
  - Mobile: 480px and below
  - Tablet: 481px - 768px
  - Desktop: 768px and above
  - Large desktop: 1200px and above

## Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Optional: Chatbot API
REACT_APP_CHATBOT_API_URL=http://localhost:5000/api/chatbot

# Application Name
REACT_APP_NAME=Internship Finder
```

**Note**: Variables must be prefixed with `REACT_APP_` to be accessible in the React app.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Production browsers list** (from `package.json`):
```
>0.2%           # More than 0.2% market share
not dead        # Still receives updates
not op_mini all # Exclude Opera Mini
```

## Build for Production

### Build Command
```bash
npm run build
```

### Build Output
- Location: `build/` directory
- Size: ~200KB gzipped
- Files:
  - `index.html` - Entry point
  - `static/js/` - JavaScript bundles
  - `static/css/` - CSS files
  - `static/media/` - Images and fonts

### Build Optimization
- Code minification and obfuscation
- CSS and JavaScript bundling
- Removal of development code
- Asset optimization
- Source maps for production debugging

### Local Production Testing
```bash
npm run build
npx serve -s build -l 3000
```

This serves the production build locally on `http://localhost:3000`.

## Troubleshooting

### Development Server Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Reinstall with exact versions
npm install --legacy-peer-deps
```

### Build Failures
- Check Node.js version: `node -v` (should be v18.20.8+)
- Check npm version: `npm -v` (should be v10.8.2+)
- Ensure all environment variables are set
- Look for syntax errors in component files

### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Performance Optimization

- **Code splitting**: Automatic via Create React App
- **Lazy loading**: Implement with `React.lazy()` and `Suspense`
- **Memoization**: Use `React.memo()` for expensive components
- **Image optimization**: Use modern formats (WebP, AVIF)
- **Bundle analysis**: `npm run build` with source maps

## Deployment

### Deployment Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
- Auto-deploys on git push
- Built-in optimizations
- Free tier available

#### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy with one click

#### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

Build and run:
```bash
docker build -t internova-frontend .
docker run -p 3000:3000 internova-frontend
```

### Environment Variables for Production
- Update `REACT_APP_API_URL` to point to production backend
- Ensure all sensitive data is stored in `.env.production`
- Use secrets management for API keys (Vercel/Netlify secrets)

## Debugging

### Browser DevTools
- React Developer Tools browser extension
- Redux DevTools (if using Redux)
- Network tab for API calls
- Console for errors and warnings

### Local Debugging
```bash
# Start dev server with inspect
node --inspect-brk ./node_modules/.bin/react-scripts start

# VSCode: Use built-in debugger
# Add to .vscode/launch.json:
{
  "type": "chrome",
  "request": "attach",
  "name": "Attach Chrome",
  "port": 9222,
  "urlFilter": "*://localhost:3000/*"
}
```

### API Debugging
- Check `REACT_APP_API_URL` configuration
- Use network tab to inspect requests
- Verify backend is running and accessible
- Check for CORS errors in console

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details
