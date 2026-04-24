export const authorize = (...roles) => (req, res, next) => {
  const userRole = req.user && (req.user.role || req.user.accountType)
  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({ success: false, message: 'Access denied' })
  }
  next()
}

export default authorize
