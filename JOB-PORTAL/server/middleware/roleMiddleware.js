const normalizeRole = (role) => {
  if (!role) return ''
  if (role === 'company') return 'recruiter'
  return role
}

const getUserRole = (req) => {
  // New tokens use `role`; older code may still set `accountType`.
  return normalizeRole(req?.user?.role || req?.user?.accountType)
}

export const authorizeRole = (allowedRoles) => {
  const normalizedAllowed = (allowedRoles || []).map(normalizeRole)
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'User not authenticated' })
    const userRole = getUserRole(req)
    if (userRole === 'admin') return next()
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to access this resource' })
    }
    next()
  }
}

// Convenience alias supporting variadic arguments: authorizeRoles('candidate','recruiter')
export const authorizeRoles = (...roles) => authorizeRole(roles)
