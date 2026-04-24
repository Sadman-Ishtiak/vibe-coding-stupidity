/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Provides clean, reusable middleware for protecting routes by user role.
 * Must be used AFTER authMiddleware to ensure req.user is populated.
 */

const { authLog } = require('../utils/authLogger');

/**
 * Generic role-based access control middleware
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user's role is allowed
    const userRole = req.user.role?.toLowerCase();
    const hasPermission = allowedRoles.some(
      role => role.toLowerCase() === userRole
    );

    if (!hasPermission) {
      authLog.roleAuthorizationFailed(
        req.user._id,
        allowedRoles.join(' or '),
        userRole
      );
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource requires ${allowedRoles.join(' or ')} role.`,
      });
    }

    next();
  };
};

/**
 * Middleware to restrict access to recruiters/companies only
 * Supports both legacy User model (role='recruiter') and new Company model (role='company'/'recruiter')
 * Usage: router.post('/jobs', authMiddleware, isRecruiter, createJob);
 */
const isRecruiter = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const userRole = req.user.role?.toLowerCase();
  
  // Allow both 'recruiter' (legacy User) and 'company' (new Company model)
  if (userRole !== 'recruiter' && userRole !== 'company') {
    authLog.roleAuthorizationFailed(
      req.user._id,
      'recruiter or company',
      userRole
    );
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only recruiters/companies can access this resource.',
    });
  }

  next();
};

/**
 * Middleware to restrict access to candidates only
 * Usage: router.post('/jobs/:id/apply', authMiddleware, isCandidate, applyToJob);
 */
const isCandidate = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role?.toLowerCase() !== 'candidate') {
    authLog.roleAuthorizationFailed(
      req.user._id,
      'candidate',
      req.user.role?.toLowerCase()
    );
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only candidates can access this resource.',
    });
  }

  next();
};

module.exports = {
  requireRole,
  isRecruiter,
  isCandidate,
};
