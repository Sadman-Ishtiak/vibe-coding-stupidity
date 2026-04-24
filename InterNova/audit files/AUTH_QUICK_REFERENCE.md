# 🚀 Quick Reference: Authentication System

## 🔐 Authentication Flow

```
1. User enters credentials → SignIn.jsx
2. API call to /auth/login → Returns accessToken + user data
3. Store tokens → localStorage (via auth.session.js)
4. Update AuthContext → login(userData)
5. Navbar updates instantly → Shows profile menu
```

## 🛡️ Token Expiry Flow

```
1. API call returns 401 (expired token)
2. Axios interceptor attempts refresh → /auth/refresh-token
3a. If refresh succeeds → Retry original request
3b. If refresh fails:
    - Clear localStorage
    - Trigger logout event
    - Update AuthContext
    - Navbar hides profile menu
    - Redirect to /sign-in
```

## 🔒 Protected Routes Usage

### Candidate-Only Route
```jsx
<Route 
  path="/candidate-profile" 
  element={
    <ProtectedRoute allowedRoles={['candidate']}>
      <CandidateProfile />
    </ProtectedRoute>
  } 
/>
```

### Recruiter-Only Route
```jsx
<Route 
  path="/manage-jobs" 
  element={
    <ProtectedRoute allowedRoles={['recruiter']}>
      <ManageJobs />
    </ProtectedRoute>
  } 
/>
```

### Authentication-Only (Any Role)
```jsx
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>
```

## 🎣 Using Auth in Components

```jsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { isAuth, user, loading, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuth) return <div>Please log in</div>;
  
  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔧 Backend Protected Routes

### Candidate-Only Endpoint
```javascript
const auth = require('../middlewares/authMiddleware');
const { isCandidate } = require('../middlewares/roleMiddleware');

router.post('/apply', auth, isCandidate, applyToJob);
```

### Recruiter-Only Endpoint
```javascript
const auth = require('../middlewares/authMiddleware');
const { isRecruiter } = require('../middlewares/roleMiddleware');

router.post('/jobs', auth, isRecruiter, createJob);
```

### Any Authenticated User
```javascript
const auth = require('../middlewares/authMiddleware');

router.get('/me', auth, getProfile);
```

## 📊 Key Files Reference

### Frontend
- **AuthContext**: `client/src/context/AuthContext.jsx`
- **API Config**: `client/src/config/api.js`
- **Protected Route**: `client/src/routes/ProtectedRoute.jsx`
- **Session Utils**: `client/src/services/auth.session.js`
- **Navbar**: `client/src/components/layout/Navbar.jsx`

### Backend
- **Auth Middleware**: `server/middlewares/authMiddleware.js`
- **Role Middleware**: `server/middlewares/roleMiddleware.js`
- **Auth Controller**: `server/controllers/authController.js`
- **Auth Routes**: `server/routes/authRoutes.js`
- **User Model**: `server/models/User.js`

## 🔍 Debugging Tips

### Check if user is authenticated
```javascript
// In browser console
localStorage.getItem('internnova.accessToken')
localStorage.getItem('internnova.userData')
```

### Check auth state in React DevTools
```
Components → AuthProvider → hooks → State:
- user: { username, email, role, ... }
- isAuth: true/false
- loading: true/false
```

### Backend: Check JWT expiry
```javascript
// In authMiddleware.js console logs
console.log('Token decoded:', decoded);
console.log('User found:', req.user);
```

## ⚡ Common Issues & Solutions

### Issue: Navbar doesn't update after login
**Solution**: SignIn.jsx now calls `login(userData)` to update AuthContext

### Issue: User logged out unexpectedly
**Solution**: Token expired (15min). Check console for 401 errors.

### Issue: Can't access protected route
**Solution**: Check user role matches `allowedRoles` in ProtectedRoute

### Issue: "Token expired" error
**Solution**: Normal behavior. Token refresh will attempt automatically. If refresh token also expired, user must log in again.

## 🧪 Testing Commands

```bash
# Run frontend
cd client
npm run dev

# Run backend
cd server
npm run dev

# Test auth flow
1. Register new user → /sign-up
2. Login → /sign-in
3. Check Navbar → Should show profile menu
4. Refresh page → Should stay logged in
5. Wait 15 minutes → Should auto-logout on next API call
```

## 🌐 API Endpoints

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/auth/register` | POST | ❌ | - | Register new user |
| `/auth/login` | POST | ❌ | - | Login user |
| `/auth/me` | GET | ✅ | - | Get current user |
| `/auth/logout` | POST | ✅ | - | Logout user |
| `/auth/refresh-token` | POST | ❌ | - | Refresh access token |
| `/jobs` | GET | ❌ | - | List all jobs |
| `/jobs` | POST | ✅ | Recruiter | Create job |
| `/applications/apply` | POST | ✅ | Candidate | Apply to job |

## 🎯 Environment Setup

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/internova
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
CLIENT_URL=http://localhost:5173
```

---

**Last Updated**: January 12, 2026  
**Version**: 1.0 (Post-Audit)
