import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * ProtectedRoute Component
 * Blocks unauthorized access to protected pages
 * Supports role-based access control (RBAC)
 * 
 * @param {ReactNode} children - The protected component
 * @param {string[]} allowedRoles - Array of allowed roles ['candidate', 'recruiter']
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles = null,
  requireAuth = true 
}) {
  const location = useLocation();
  const { isAuth, user, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuth) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role?.toLowerCase();
    
    // ✅ Map 'company' role to 'recruiter' for backward compatibility
    const normalizedRole = userRole === 'company' ? 'recruiter' : userRole;
    
    const hasAccess = allowedRoles.some(role => {
      const allowedRole = role.toLowerCase();
      // Allow both 'recruiter' and 'company' for recruiter routes
      if (allowedRole === 'recruiter') {
        return normalizedRole === 'recruiter' || userRole === 'company';
      }
      return allowedRole === normalizedRole;
    });
    
    if (!hasAccess) {
      // Redirect to home if role doesn't match
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
