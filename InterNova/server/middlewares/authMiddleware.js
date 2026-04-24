const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const Candidate = require('../models/Candidate');
const { authLog } = require('../utils/authLogger');

/**
 * Authentication Middleware (Multi-Model Support)
 * Verifies JWT token and attaches user/company/candidate to req.user
 * Supports Candidate, User (recruiters), and Company models
 */
module.exports = async (req, res, next) => {
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

    // ✅ jwt.verify automatically checks expiry and throws error if expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // ✅ Determine which model to fetch from based on userType flag in JWT
    // Candidate tokens have userType: 'candidate'
    // Company tokens have userType: 'company'
    
    // Check if this is a Candidate auth token
    if (decoded.userType === 'candidate') {
      // Fetch from Candidate model and populate userId to get email and role
      req.user = await Candidate.findById(decoded.id).populate('userId', 'email role');
      
      if (!req.user) {
        authLog.tokenVerifyFailed('Candidate not found', decoded.id);
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      // Check if candidate is active
      if (req.user.isActive === false) {
        return res.status(403).json({ 
          success: false,
          message: 'Account is deactivated' 
        });
      }
      
      // Flatten email and role from populated userId for easier access
      if (req.user.userId) {
        req.user.email = req.user.userId.email;
        req.user.role = req.user.userId.role;
      }
      
      req.user.userType = 'candidate'; // Flag for downstream middleware
    } else if (decoded.userType === 'company') {
      // Fetch from Company model and populate userId to get email and role
      req.user = await Company.findById(decoded.id).populate('userId', 'email role');
      
      if (!req.user) {
        authLog.tokenVerifyFailed('Company not found', decoded.id);
        return res.status(401).json({ 
          success: false,
          message: 'Company not found' 
        });
      }
      
      // Check if company is active
      if (req.user.isActive === false) {
        return res.status(403).json({ 
          success: false,
          message: 'Account is deactivated' 
        });
      }
      
      // Flatten email and role from populated userId for easier access
      if (req.user.userId) {
        req.user.email = req.user.userId.email;
        req.user.role = req.user.userId.role;
      }
      
      req.user.userType = 'company'; // Flag for downstream middleware
    } else {
      // Fetch from User model (recruiters and legacy users)
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
      
      if (!req.user) {
        authLog.tokenVerifyFailed('User not found', decoded.id);
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      req.user.userType = 'user'; // Flag for downstream middleware
    }
    
    next();
  } catch (err) {
    // ✅ Handle specific JWT errors
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
    
    // Generic auth failure
    res.status(401).json({ 
      success: false,
      message: 'Not authorized' 
    });
  }
};
