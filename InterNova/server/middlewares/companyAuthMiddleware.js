const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authLog } = require('../utils/authLogger');

/**
 * Company/Recruiter Authentication Middleware
 * Verifies JWT token and ensures user has role='recruiter'
 * Blocks candidate role from accessing company endpoints
 * Attaches user to req.company for consistency
 */
const protectCompany = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      authLog.tokenVerifyFailed('No token provided');
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      authLog.tokenVerifyFailed('Empty token');
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    // Verify JWT token (includes id and role)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // ❌ BLOCK: If JWT has role='candidate', reject immediately
    if (decoded.role === 'candidate') {
      authLog.roleAuthorizationFailed(decoded.id, 'recruiter', 'candidate');
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. This endpoint is for recruiters only.' 
      });
    }
    
    // Find user in database
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!user) {
      authLog.tokenVerifyFailed('User not found', decoded.id);
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // ❌ BLOCK: Double-check user role from database
    if (user.role !== 'recruiter') {
      authLog.roleAuthorizationFailed(user._id, 'recruiter', user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. This endpoint is for recruiters only.'
      });
    }
    
    // ✅ Attach company/recruiter user to request
    req.company = user;
    req.user = user; // Also set req.user for compatibility
    
    next();
  } catch (err) {
    // Handle JWT errors
    if (err.name === 'TokenExpiredError') {
      authLog.tokenExpired();
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      authLog.tokenVerifyFailed('Invalid token');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }

    // Generic error
    authLog.tokenVerifyFailed('Token verification failed', null, err.message);
    return res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};

module.exports = { protectCompany };
