const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Optional Authentication Middleware
 * Sets req.user if valid token is present, but doesn't reject if missing
 * Used for public routes that need to show personalized data when user is logged in
 */
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // If no token, just continue without setting req.user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // Fetch user from database
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    } catch (err) {
      // Token invalid or expired - just continue without user
      req.user = null;
    }
    
    next();
  } catch (err) {
    // Any other error - just continue without user
    req.user = null;
    next();
  }
};
