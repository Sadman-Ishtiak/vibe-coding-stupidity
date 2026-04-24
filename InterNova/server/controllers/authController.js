const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} = require('../utils/generateToken');
const { authLog } = require('../utils/authLogger');
const {
  sendPasswordResetEmail,
  generateResetToken,
  hashResetToken,
} = require('../utils/emailService');
const {
  generateOTP,
  hashOTP,
  verifyOTP,
  isOTPExpired,
  getOTPExpiry,
  isMaxVerifyAttemptsExceeded,
  canResendOTP,
  getResendResetTime,
  sendOTPEmail,
  clearOTPData,
} = require('../utils/otpService');

exports.register = async (req, res) => {
  try {
    /* ---------------- VALIDATION ---------------- */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // ❗ Remove uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }

      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg, // Return first error message
        errors: errors.array(), // Keep full errors for debugging
      });
    }

    const { username, email, password, accountType } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    /* ---------------- ROUTE BASED ON ACCOUNT TYPE ---------------- */
    // Company/Recruiter → User + Company model
    // Candidate → User + Candidate model
    
    if (accountType === 'company' || accountType === 'recruiter') {
      console.log(`[REGISTER] Starting company/recruiter registration for: ${normalizedEmail}, accountType: ${accountType}`);
      /* ---------------- COMPANY/RECRUITER REGISTRATION ---------------- */

      
      // Check duplicate in User collection
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        authLog.registerFailed(normalizedEmail, 'Email already registered');
        
        if (req.file && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkError) {
            console.error('Failed to delete uploaded file:', unlinkError);
          }
        }

        return res.status(409).json({
          success: false,
          message: 'Email already registered',
        });
      }

      // Create User account first
      // ✅ Map 'company' to 'recruiter' for User model (User schema only accepts 'candidate' or 'recruiter')
      console.log(`[REGISTER] Creating User with role: 'recruiter' (mapped from accountType: '${accountType}')`);
      const user = await User.create({
        username,
        email: normalizedEmail,
        password, // Will be hashed by User model's pre-save hook
        role: 'recruiter', // Always use 'recruiter' for company/recruiter accounts in User model
        profilePicture: req.file
          ? (req.file.processedPath || `/uploads/profile-pics/${req.file.filename}`)
          : null,
        isVerified: false,
        isEmailVerified: false, // Require email verification
      });
      console.log(`[REGISTER] User created successfully. ID: ${user._id}, role: ${user.role}, isEmailVerified: ${user.isEmailVerified}`);


      // Generate OTP for email verification
      const otp = generateOTP();
      const hashedOTP = hashOTP(otp);

      // Store OTP data in User model
      user.emailOTP = hashedOTP;
      user.emailOTPExpires = getOTPExpiry();
      user.emailOTPPurpose = 'signup';
      user.otpVerifyAttempts = 0;
      user.otpResendCount = 1;
      user.otpResendResetAt = getResendResetTime();
      await user.save();

      authLog.registerSuccess(user._id, user.email);

      // Create Company profile linked to User
      console.log(`[REGISTER] Creating Company profile linked to userId: ${user._id}`);
      const company = await Company.create({
        userId: user._id,
        companyName: username, // Use username as company name during signup
        logo: req.file
          ? (req.file.processedPath || `/uploads/profile-pics/${req.file.filename}`)
          : '',
        isActive: true,
      });
      console.log(`[REGISTER] Company profile created. ID: ${company._id}, companyName: ${company.companyName}, userId: ${company.userId}`);


      // Send OTP email
      await sendOTPEmail(normalizedEmail, otp, 'signup');

      console.log(`[AUTH] Company registered: ${normalizedEmail}. OTP sent for verification.`);

      return res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email with the OTP sent.',
        user: {
          id: user._id,
          email: user.email,
          userType: 'company',
          requiresEmailVerification: true,
        },
      });
    }

    /* ---------------- CANDIDATE REGISTRATION ---------------- */
    
    // Check duplicate in User collection (unified auth)
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      authLog.registerFailed(normalizedEmail, 'Email already registered');
      
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }

      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Parse username into firstName and lastName
    const nameParts = username.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create User account first (for authentication)
    const user = await User.create({
      username,
      email: normalizedEmail,
      password, // Will be hashed by User model's pre-save hook
      role: 'candidate',
      profilePicture: req.file
        ? (req.file.processedPath || `/uploads/profile-pics/${req.file.filename}`)
        : null,
      isVerified: false,
      isEmailVerified: false, // Require email verification
    });

    // Generate OTP for email verification
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    // Store OTP data in User model
    user.emailOTP = hashedOTP;
    user.emailOTPExpires = getOTPExpiry();
    user.emailOTPPurpose = 'signup';
    user.otpVerifyAttempts = 0;
    user.otpResendCount = 1;
    user.otpResendResetAt = getResendResetTime();
    await user.save();

    authLog.registerSuccess(user._id, user.email);

    // Create Candidate profile linked to User
    const candidate = await Candidate.create({
      userId: user._id,
      firstName,
      lastName,
      profileImage: req.file
        ? (req.file.processedPath || `/uploads/profile-pics/${req.file.filename}`)
        : '',
      isActive: true,
    });

    // Send OTP email
    await sendOTPEmail(normalizedEmail, otp, 'signup');
    
    console.log(`[AUTH] Candidate registered: ${normalizedEmail}. OTP sent for verification.`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email with the OTP sent.',
      user: {
        id: user._id,
        firstName,
        lastName,
        email: user.email,
        role: user.role,
        userType: 'candidate',
        requiresEmailVerification: true,
      },
    });
  } catch (error) {
    // ❗ Cleanup uploaded file on ANY error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete uploaded file:', unlinkError);
      }
    }

    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/* ---------------- LOGIN ---------------- */
exports.login = async (req, res) => {
  try {
    const { email, identifier, password } = req.body;

    // Accept either 'identifier' (new) or 'email' (backward compatibility)
    const loginInput = identifier || email;

    // Validation
    if (!loginInput || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Normalize input
    const normalizedInput = loginInput.toLowerCase().trim();
    console.log(`[LOGIN] Attempting login for: ${normalizedInput}`);

    /* ---------------- FIND USER IN APPROPRIATE COLLECTION ---------------- */
    // Find user in User collection (now used for both candidates and companies)
    let user = await User.findOne({ email: normalizedInput }).select('+password');

    if (!user) {
      console.log(`[LOGIN] User not found: ${normalizedInput}`);

      authLog.invalidCredentials(normalizedInput);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log(`[LOGIN] User found. Role: ${user.role}, isEmailVerified: ${user.isEmailVerified}, isVerified: ${user.isVerified}`);

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[LOGIN] Password mismatch for: ${normalizedInput}`);
      authLog.invalidCredentials(normalizedInput);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log(`[LOGIN] Password verified successfully`);

    // Check email verification
    if (!user.isEmailVerified) {
      console.log(`[LOGIN] Email not verified for: ${normalizedInput}`);

      return res.status(403).json({
        success: false,
        message: 'Email not verified. Please verify your email to login.',
        requiresEmailVerification: true,
        email: user.email,
        userType: user.role === 'candidate' ? 'candidate' : 'company',
      });
    }

    console.log(`[LOGIN] Email verified. Routing based on role: ${user.role}`);

    /* ---------------- ROUTE BASED ON ROLE ---------------- */
    if (user.role === 'candidate') {
      console.log(`[LOGIN] Processing candidate login`);
      // CANDIDATE LOGIN
      const candidateProfile = await Candidate.findOne({ userId: user._id });
      if (!candidateProfile) {
        return res.status(404).json({
          success: false,
          message: 'Candidate profile not found. Please contact support.',
        });
      }
      
      if (candidateProfile.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      // Generate tokens using Candidate ID (not User ID) for userType: 'candidate'
      const accessToken = generateAccessToken(candidateProfile._id, user.role, 'candidate');
      const refreshToken = generateRefreshToken(candidateProfile._id, user.role, 'candidate');
      const refreshTokenExpiry = getRefreshTokenExpiry(7);
      
      // Store refresh token in User database
      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = refreshTokenExpiry;
      await user.save();

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      authLog.loginSuccess(user._id, user.email, 'candidate');

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: candidateProfile._id,
          userId: user._id,
          firstName: candidateProfile.firstName,
          lastName: candidateProfile.lastName,
          username: `${candidateProfile.firstName} ${candidateProfile.lastName}`,
          email: user.email,
          role: user.role,
          profilePicture: candidateProfile.profileImage,
          userType: 'candidate'
        },
      });
    }

    console.log(`[LOGIN] Processing company/recruiter login for userId: ${user._id}`);
    // COMPANY/RECRUITER LOGIN
    const companyProfile = await Company.findOne({ userId: user._id });
    if (!companyProfile) {
      console.log(`[LOGIN] Company profile not found for userId: ${user._id}`);
      return res.status(404).json({
        success: false,
        message: 'Company profile not found. Please contact support.',
      });
    }
    console.log(`[LOGIN] Company profile found: ${companyProfile.companyName}, isActive: ${companyProfile.isActive}`);

    
    if (companyProfile.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Generate tokens using Company ID (not User ID) for userType: 'company'
    const accessToken = generateAccessToken(companyProfile._id, user.role, 'company');
    const refreshToken = generateRefreshToken(companyProfile._id, user.role, 'company');
    const refreshTokenExpiry = getRefreshTokenExpiry(7);
    
    // Store refresh token in User database
    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = refreshTokenExpiry;
    await user.save();

    // Set refresh token as httpOnly cookie (secure in production)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log(`[LOGIN] Company login successful. Generating response for: ${user.email}`);
    authLog.loginSuccess(user._id, user.email, user.role);

    // Return company user response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: companyProfile._id, // Company ID, not User ID
        userId: user._id, // Reference to User model
        username: companyProfile.companyName || user.username,
        companyName: companyProfile.companyName || user.username,
        email: user.email,
        role: user.role,
        profilePicture: companyProfile.logo || user.profilePicture,
        logo: companyProfile.logo || user.profilePicture,
        userType: 'company'
      },
      data: {
        id: companyProfile._id, // Company ID, not User ID
        userId: user._id, // Reference to User model
        companyName: companyProfile.companyName || user.username,
        email: user.email,
        role: user.role,
        logo: companyProfile.logo || user.profilePicture,
        userType: 'company'
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Normalize image URLs to be consistent
 * @param {string} imagePath - Image path from database
 * @returns {string|null} - Normalized URL or null if no image
 */
const normalizeImageUrl = (imagePath) => {
  if (!imagePath || imagePath === '') return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Remove leading slash if exists, then add it back
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `/${cleanPath}`;
};

/* ---------------- GET ME ---------------- */
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      authLog.getMeFailed('No user attached to request');
      return res.status(401).json({ 
        success: false,
        message: 'Not authenticated' 
      });
    }

    authLog.getMeSuccess(req.user._id);

    // ✅ Format response to match login response structure with normalized image URLs
    let formattedUser = {};
    
    if (req.user.userType === 'candidate') {
      // Candidate response
      formattedUser = {
        id: req.user._id,
        userId: req.user.userId?._id || req.user.userId,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        role: req.user.role,
        profilePicture: normalizeImageUrl(req.user.profileImage),
        profileImage: normalizeImageUrl(req.user.profileImage),
        userType: 'candidate',
        profileCompletion: req.user.profileCompletion
      };
    } else if (req.user.userType === 'company') {
      // Company response - format to match login with normalized URLs
      formattedUser = {
        id: req.user._id,
        userId: req.user.userId?._id || req.user.userId,
        username: req.user.companyName,
        companyName: req.user.companyName,
        email: req.user.email,
        role: req.user.role,
        profilePicture: normalizeImageUrl(req.user.logo),
        logo: normalizeImageUrl(req.user.logo),
        userType: 'company',
        profileCompletion: req.user.profileCompletion
      };
    } else {
      // Legacy user response
      formattedUser = {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        profilePicture: normalizeImageUrl(req.user.profilePicture),
        userType: 'user'
      };
    }

    res.json({ 
      success: true, 
      user: formattedUser,
      data: formattedUser,
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

/* ---------------- LOGOUT ---------------- */
exports.logout = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    // Clear refresh token from database based on user type
    // Both candidates and companies now use User model for auth, so clear from User model
    if (req.user && (req.user.userType === 'candidate' || req.user.userType === 'company')) {
      // Clear from linked User model
      if (req.user.userId) {
        await User.findByIdAndUpdate(req.user.userId._id || req.user.userId, {
          refreshToken: null,
          refreshTokenExpiry: null,
        });
      }
    } else if (req.user && req.user.userType === 'user') {
      await User.findByIdAndUpdate(req.user._id, {
        refreshToken: null,
        refreshTokenExpiry: null,
      });
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    authLog.logoutSuccess(userId);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/* ---------------- REFRESH TOKEN ---------------- */
exports.refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie or request body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided',
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret'
      );
    } catch (err) {
      authLog.tokenRefreshFailed('Invalid or expired refresh token');
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    // Determine user type from token
    const userType = decoded.userType || 'candidate';
    let user;

    if (userType === 'company') {
      // Find company and populate user data
      const company = await Company.findById(decoded.id).populate('userId');
      if (!company || !company.userId) {
        authLog.tokenRefreshFailed('Company not found');
        return res.status(401).json({
          success: false,
          message: 'Company not found',
        });
      }

      const user = company.userId;

      // Check if company is active
      if (company.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      // Check if refresh token matches and is not expired (stored in User model)
      if (
        user.refreshToken !== refreshToken ||
        !user.refreshTokenExpiry ||
        new Date() > user.refreshTokenExpiry
      ) {
        authLog.tokenRefreshFailed('Token mismatch or expired');
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token',
        });
      }

      // Generate new tokens for company
      const newAccessToken = company.generateAccessToken();
      const newRefreshToken = generateRefreshToken(company._id, user.role, 'company');
      const newRefreshTokenExpiry = getRefreshTokenExpiry(7);

      // Update refresh token in User model
      user.refreshToken = newRefreshToken;
      user.refreshTokenExpiry = newRefreshTokenExpiry;
      await user.save();

      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      authLog.tokenRefreshSuccess(company._id);

      return res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: company._id,
          username: company.companyName,
          companyName: company.companyName,
          email: user.email,
          role: user.role,
          profilePicture: company.logo,
          userType: 'company'
        },
      });
    } else {
      // Find candidate and populate user data
      const candidate = await Candidate.findById(decoded.id).populate('userId');
      if (!candidate || !candidate.userId) {
        authLog.tokenRefreshFailed('Candidate not found');
        return res.status(401).json({
          success: false,
          message: 'Candidate not found',
        });
      }

      const user = candidate.userId;

      // Check if candidate is active
      if (candidate.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      // Check if refresh token matches and is not expired (stored in User model)
      if (
        user.refreshToken !== refreshToken ||
        !user.refreshTokenExpiry ||
        new Date() > user.refreshTokenExpiry
      ) {
        authLog.tokenRefreshFailed('Token mismatch or expired');
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token',
        });
      }

      // Generate new tokens for candidate
      const newAccessToken = candidate.generateAccessToken();
      const newRefreshToken = generateRefreshToken(candidate._id, user.role, 'candidate');
      const newRefreshTokenExpiry = getRefreshTokenExpiry(7);

      // Update refresh token in User model
      user.refreshToken = newRefreshToken;
      user.refreshTokenExpiry = newRefreshTokenExpiry;
      await user.save();

      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      authLog.tokenRefreshSuccess(candidate._id);

      return res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: candidate._id,
          userId: user._id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          username: `${candidate.firstName} ${candidate.lastName}`,
          email: user.email,
          role: user.role,
          profilePicture: candidate.profileImage,
          userType: 'candidate'
        },
      });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/* ---------------- FORGOT PASSWORD ---------------- */
exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Always return success response (prevent email enumeration)
    const successResponse = {
      success: true,
      message: 'If an account with that email exists, an OTP has been sent.',
    };

    // Find user in Candidate, User, then Company models
    let user = await Candidate.findOne({ email: normalizedEmail });
    if (!user) {
      user = await User.findOne({ email: normalizedEmail });
    }
    if (!user) {
      user = await Company.findOne({ email: normalizedEmail });
    }

    if (!user) {
      // Log for security monitoring but don't reveal to client
      console.log(`[SECURITY] Password reset attempted for non-existent email: ${normalizedEmail}`);
      
      // Simulate processing time to prevent timing attacks
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 100));
      
      return res.status(200).json(successResponse);
    }

    // Check resend limits
    const resendCheck = canResendOTP(user.otpResendCount || 0, user.otpResendResetAt);
    if (!resendCheck.canResend) {
      return res.status(429).json({
        success: false,
        message: resendCheck.message,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    // Store OTP data
    user.emailOTP = hashedOTP;
    user.emailOTPExpires = getOTPExpiry();
    user.emailOTPPurpose = 'reset';
    user.otpVerifyAttempts = 0;

    // Update resend count
    if (!user.otpResendResetAt || new Date() > new Date(user.otpResendResetAt)) {
      user.otpResendCount = 1;
      user.otpResendResetAt = getResendResetTime();
    } else {
      user.otpResendCount += 1;
    }

    await user.save();

    // Send OTP email
    await sendOTPEmail(normalizedEmail, otp, 'reset');

    // Log for audit
    console.log(`[AUTH] Password reset OTP sent to: ${normalizedEmail} (User ID: ${user._id})`);

    // Always return same success message
    res.status(200).json(successResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

/* ---------------- RESET PASSWORD ---------------- */
exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user in Candidate, User, then Company models (covers all account types)
    let user = await Candidate.findOne({ email: normalizedEmail });
    let userType = 'candidate';

    if (!user) {
      user = await User.findOne({ email: normalizedEmail });
    }

    if (!user) {
      user = await Company.findOne({ email: normalizedEmail });
      userType = 'company';
    }

    if (!user) {
      console.log(`[SECURITY] Password reset attempt for non-existent email: ${normalizedEmail}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }

    // Verify that OTP was verified (emailOTPPurpose should be cleared after verification)
    // This ensures user completed OTP verification before reaching this endpoint
    if (user.emailOTP || user.emailOTPPurpose) {
      return res.status(400).json({
        success: false,
        message: 'Please verify OTP first',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Log successful reset
    console.log(`[AUTH] Password reset successful for user: ${user.email} (User ID: ${user._id})`);

    // Generate new tokens to auto-login user
    let accessToken, refreshToken;
    
    if (userType === 'company') {
      accessToken = user.generateAccessToken();
      refreshToken = generateRefreshToken(user._id, user.role, 'company');
    } else {
      accessToken = generateAccessToken(user._id, user.role, 'candidate');
      refreshToken = generateRefreshToken(user._id, user.role, 'candidate');
      
      const refreshTokenExpiry = getRefreshTokenExpiry(7);
      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = refreshTokenExpiry;
      await user.save();
    }

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userData = userType === 'company' 
      ? {
          id: user._id,
          username: user.companyName,
          companyName: user.companyName,
          email: user.email,
          role: user.role,
          profilePicture: user.logo,
          userType: 'company',
        }
      : {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          userType: 'candidate',
        };

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

/* ===============================================================
   COMPANY AUTH ENDPOINTS (Standalone Company Model)
   =============================================================== */

/* ---------------- COMPANY REGISTER ---------------- */
exports.companyRegister = async (req, res) => {
  try {
    /* ---------------- VALIDATION ---------------- */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { companyName, email, password, ownerName, phone, companyLocation } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    /* ---------------- DUPLICATE CHECK ---------------- */
    const existingCompany = await Company.findOne({ email: normalizedEmail });
    if (existingCompany) {
      authLog.registerFailed(normalizedEmail, 'Email already registered');
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    /* ---------------- CREATE COMPANY ---------------- */
    // Password will be automatically hashed by Company model's pre-save hook
    const company = await Company.create({
      companyName,
      email: normalizedEmail,
      password, // Raw password - will be hashed by pre-save hook
      ownerName: ownerName || '',
      phone: phone || '',
      companyLocation: companyLocation || '',
      role: 'company', // Default role
      isActive: true
    });

    authLog.registerSuccess(company._id, company.email);

    // Generate tokens
    const accessToken = company.generateAccessToken();
    const refreshToken = generateRefreshToken(company._id, company.role, 'company');

    res.status(201).json({
      success: true,
      message: 'Company registration successful',
      accessToken,
      refreshToken,
      user: { // ✅ Add user field for frontend compatibility
        id: company._id,
        username: company.companyName,
        companyName: company.companyName,
        email: company.email,
        role: company.role,
        ownerName: company.ownerName,
        profilePicture: normalizeImageUrl(company.logo),
        logo: normalizeImageUrl(company.logo),
        userType: 'company'
      },
      company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        role: company.role,
        ownerName: company.ownerName,
        logo: normalizeImageUrl(company.logo)
      },
      data: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        role: company.role,
        ownerName: company.ownerName,
        logo: normalizeImageUrl(company.logo),
        userType: 'company'
      },
    });
  } catch (error) {
    console.error('Company register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/* ---------------- COMPANY LOGIN ---------------- */
exports.companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Normalize input
    const normalizedEmail = email.toLowerCase().trim();

    // Find company by EMAIL - password field must be explicitly selected
    const company = await Company.findOne({ email: normalizedEmail }).select('+password');

    if (!company) {
      authLog.invalidCredentials(normalizedEmail);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if company is active
    if (!company.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    // Check password using Company model's method
    const isMatch = await company.comparePassword(password);
    if (!isMatch) {
      authLog.invalidCredentials(normalizedEmail);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate tokens
    const accessToken = company.generateAccessToken();
    const refreshToken = generateRefreshToken(company._id, company.role, 'company');

    authLog.loginSuccess(company._id, company.email, company.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { // ✅ Add user field for frontend compatibility
        id: company._id,
        username: company.companyName, // Map to username for consistency
        companyName: company.companyName,
        email: company.email,
        role: company.role,
        ownerName: company.ownerName,
        phone: company.phone,
        profilePicture: normalizeImageUrl(company.logo), // Map logo to profilePicture
        logo: normalizeImageUrl(company.logo),
        userType: 'company' // ✅ Flag for frontend
      },
      company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        role: company.role,
        ownerName: company.ownerName,
        phone: company.phone,
        logo: normalizeImageUrl(company.logo)
      },
      data: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        role: company.role,
        ownerName: company.ownerName,
        phone: company.phone,
        logo: normalizeImageUrl(company.logo),
        userType: 'company'
      },
    });
  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/* ---------------- COMPANY GET ME ---------------- */
exports.companyGetMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authenticated' 
      });
    }

    // req.user is already the Company document from authMiddleware
    res.json({ 
      success: true, 
      company: {
        id: req.user._id,
        companyName: req.user.companyName,
        email: req.user.email,
        role: req.user.role,
        ownerName: req.user.ownerName,
        phone: req.user.phone,
        companyLocation: req.user.companyLocation,
        logo: normalizeImageUrl(req.user.logo),
        gallery: req.user.gallery ? req.user.gallery.map(img => normalizeImageUrl(img)) : [],
        employees: req.user.employees,
        establishedDate: req.user.establishedDate,
        companyWebsite: req.user.companyWebsite,
        companyDescription: req.user.companyDescription,
        workingSchedule: req.user.workingSchedule,
        socialLinks: req.user.socialLinks,
        isActive: req.user.isActive
      },
      data: req.user,
    });
  } catch (err) {
    console.error('Company get me error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

/* ===============================================================
   EMAIL OTP VERIFICATION ENDPOINTS
   =============================================================== */

/**
 * Send OTP for email verification (signup or password reset)
 * Rate limited: Applied in routes
 */
exports.sendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    // Validation
    if (!email || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Email and purpose are required',
      });
    }

    if (!['signup', 'reset'].includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose. Must be signup or reset',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user in Candidate, User, then Company models (covers all account types)
    let user = await Candidate.findOne({ email: normalizedEmail });
    let userType = 'candidate';

    if (!user) {
      user = await User.findOne({ email: normalizedEmail });
    }

    if (!user) {
      user = await Company.findOne({ email: normalizedEmail });
      userType = 'company';
    }

    // For signup purpose, user should NOT exist yet
    if (purpose === 'signup' && user) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // For reset purpose, user MUST exist
    if (purpose === 'reset' && !user) {
      // Return generic message to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, an OTP has been sent.',
      });
    }

    // Check resend limits
    const resendCheck = canResendOTP(user.otpResendCount || 0, user.otpResendResetAt);
    if (!resendCheck.canResend) {
      return res.status(429).json({
        success: false,
        message: resendCheck.message,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    // Update user with OTP data
    user.emailOTP = hashedOTP;
    user.emailOTPExpires = getOTPExpiry();
    user.emailOTPPurpose = purpose;
    user.otpVerifyAttempts = 0;

    // Update resend count
    if (!user.otpResendResetAt || new Date() > new Date(user.otpResendResetAt)) {
      user.otpResendCount = 1;
      user.otpResendResetAt = getResendResetTime();
    } else {
      user.otpResendCount += 1;
    }

    await user.save();

    // Send OTP email
    await sendOTPEmail(normalizedEmail, otp, purpose);

    console.log(`[OTP] Sent ${purpose} OTP to ${normalizedEmail}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 600, // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

/**
 * Verify OTP
 * Rate limited: Applied in routes
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    // Validation
    if (!email || !otp || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and purpose are required',
      });
    }

    if (!['signup', 'reset'].includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user in User model (now used for both candidates and companies)
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }
    
    const userType = user.role === 'candidate' ? 'candidate' : 'company';

    // Check if OTP exists
    if (!user.emailOTP || !user.emailOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check purpose matches
    if (user.emailOTPPurpose !== purpose) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP purpose',
      });
    }

    // Check max attempts
    if (isMaxVerifyAttemptsExceeded(user.otpVerifyAttempts)) {
      clearOTPData(user);
      await user.save();
      return res.status(429).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.',
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(user.emailOTPExpires)) {
      clearOTPData(user);
      await user.save();
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP
    const isValid = verifyOTP(otp, user.emailOTP);
    
    if (!isValid) {
      user.otpVerifyAttempts += 1;
      await user.save();
      
      const remainingAttempts = 5 - user.otpVerifyAttempts;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
      });
    }

    // OTP is valid - mark email as verified if signup
    if (purpose === 'signup') {
      user.isEmailVerified = true;
      user.isVerified = true; // Also set general verification status
      console.log(`[OTP] Setting isEmailVerified=true and isVerified=true for ${normalizedEmail} (${userType})`);
    }

    // Clear OTP data
    clearOTPData(user);
    
    try {
      const savedUser = await user.save();
      console.log(`[OTP] Successfully saved user. isEmailVerified: ${savedUser.isEmailVerified}, isVerified: ${savedUser.isVerified}`);
    } catch (saveError) {
      console.error(`[OTP] Error saving user:`, saveError);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify OTP. Please try again.',
      });
    }

    console.log(`[OTP] Successfully verified ${purpose} OTP for ${normalizedEmail}`);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      userType,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

/**
 * Resend OTP
 * Rate limited: Applied in routes
 */
exports.resendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    // Validation
    if (!email || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Email and purpose are required',
      });
    }

    if (!['signup', 'reset'].includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user in User model (now used for both candidates and companies)
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }

    // Check resend limits
    const resendCheck = canResendOTP(user.otpResendCount || 0, user.otpResendResetAt);
    if (!resendCheck.canResend) {
      return res.status(429).json({
        success: false,
        message: resendCheck.message,
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    // Update user
    user.emailOTP = hashedOTP;
    user.emailOTPExpires = getOTPExpiry();
    user.emailOTPPurpose = purpose;
    user.otpVerifyAttempts = 0;

    // Update resend count
    if (!user.otpResendResetAt || new Date() > new Date(user.otpResendResetAt)) {
      user.otpResendCount = 1;
      user.otpResendResetAt = getResendResetTime();
    } else {
      user.otpResendCount += 1;
    }

    await user.save();

    // Send OTP email
    await sendOTPEmail(normalizedEmail, otp, purpose);

    console.log(`[OTP] Resent ${purpose} OTP to ${normalizedEmail}`);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      expiresIn: 600, // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};
