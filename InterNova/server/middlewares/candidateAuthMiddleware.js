const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');
const { authLog } = require('../utils/authLogger');

/**
 * Candidate Authentication Middleware
 * Verifies JWT token and ensures user has role='candidate'
 */
const protectCandidate = async (req, res, next) => {
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
    
    // ❌ BLOCK: If JWT has role other than 'candidate', reject immediately
    if (decoded.role !== 'candidate') {
      authLog.roleAuthorizationFailed(decoded.id, 'candidate', decoded.role);
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. This endpoint is for candidates only.' 
      });
    }
    
    // Find Candidate by ID and populate userId to get email
    const candidate = await Candidate.findById(decoded.id)
      .populate('userId', 'email role')
      .select('-password');
    
    if (!candidate) {
      authLog.tokenVerifyFailed('Candidate not found', decoded.id);
      return res.status(401).json({ 
        success: false,
        message: 'Candidate not found' 
      });
    }

    // Check if account is active
    if (candidate.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Flatten email and role from populated userId for easier access
    if (candidate.userId) {
      candidate.email = candidate.userId.email;
      candidate.role = candidate.userId.role;
    }
    
    // ✅ Attach candidate to request
    req.candidate = candidate;
    req.user = candidate;
    
    next();
  } catch (err) {
    // Handle JWT errors
    if (err.name === 'TokenExpiredError') {
      authLog.tokenExpired();
      return res.status(401).json({ 
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      authLog.tokenVerifyFailed('Invalid token');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    authLog.tokenVerifyFailed(err.message);
    
    res.status(401).json({ 
      success: false,
      message: 'Not authorized' 
    });
  }
};

module.exports = { protectCandidate };
