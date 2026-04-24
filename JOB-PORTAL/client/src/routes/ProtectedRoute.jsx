import { Navigate, useLocation } from 'react-router-dom'
import { getAccountType, isAuthenticated } from '@/services/auth.session'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }

  if (requireAdmin && getAccountType() !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
