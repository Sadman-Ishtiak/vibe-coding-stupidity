const express = require('express');
const { body } = require('express-validator');
const upload = require('../middlewares/uploadMiddleware');
const { processImageMiddleware } = require('../middlewares/imageResize');
const fs = require('fs');
const authMiddleware = require('../middlewares/authMiddleware');
const { rateLimit } = require('../middlewares/rateLimitMiddleware');
const {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  companyRegister,
  companyLogin,
  companyGetMe,
  sendOTP,
  verifyOTP,
  resendOTP,
} = require('../controllers/authController');

const router = express.Router();

/**
 * REGISTER
 */
router.post(
  '/register',
  (req, res, next) => {
    upload.single('profilePicture')(req, res, (err) => {
      if (err) {
        // Remove any partially uploaded file if present
        if (req.file && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkErr) {
            console.error('Failed to delete uploaded file after upload error:', unlinkErr);
          }
        }

        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error',
        });
      }
      next();
    });
  },
  processImageMiddleware('avatar', 'profilePicture'), // Process image to 33x33px
  [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),

    body('password')
      .isLength({ min: 8 })
      .matches(/(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters and include letters and numbers'),

    body('accountType')
      .isIn(['candidate', 'recruiter', 'company'])
      .withMessage('Invalid account type'),
  ],
  register
);

router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);

/**
 * FORGOT PASSWORD
 * Rate limited: 5 requests per 15 minutes per IP
 */
router.post(
  '/forgot-password',
  rateLimit(5, 15 * 60 * 1000), // 5 requests per 15 minutes
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
  ],
  forgotPassword
);

/**
 * RESET PASSWORD
 * Rate limited: 10 requests per 15 minutes per IP
 * Now uses OTP-based flow instead of token
 */
router.post(
  '/reset-password',
  rateLimit(10, 15 * 60 * 1000), // 10 requests per 15 minutes
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
    
    body('password')
      .isLength({ min: 8 })
      .matches(/(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters and include letters and numbers'),
  ],
  resetPassword
);

/* ===============================================================
   EMAIL OTP VERIFICATION ROUTES
   =============================================================== */

/**
 * SEND OTP
 * Rate limited: 5 requests per 15 minutes per IP
 */
router.post(
  '/otp/send',
  rateLimit(5, 15 * 60 * 1000),
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
    
    body('purpose')
      .isIn(['signup', 'reset'])
      .withMessage('Purpose must be signup or reset'),
  ],
  sendOTP
);

/**
 * VERIFY OTP
 * Rate limited: 10 requests per 15 minutes per IP
 */
router.post(
  '/otp/verify',
  rateLimit(10, 15 * 60 * 1000),
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
    
    body('otp')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('OTP must be a 6-digit number'),
    
    body('purpose')
      .isIn(['signup', 'reset'])
      .withMessage('Purpose must be signup or reset'),
  ],
  verifyOTP
);

/**
 * RESEND OTP
 * Rate limited: 3 requests per 15 minutes per IP
 */
router.post(
  '/otp/resend',
  rateLimit(3, 15 * 60 * 1000),
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
    
    body('purpose')
      .isIn(['signup', 'reset'])
      .withMessage('Purpose must be signup or reset'),
  ],
  resendOTP
);

/* ===============================================================
   COMPANY AUTH ROUTES (Standalone Company Model)
   =============================================================== */

/**
 * COMPANY REGISTER
 */
router.post(
  '/company/register',
  [
    body('companyName')
      .trim()
      .isLength({ min: 3, max: 150 })
      .withMessage('Company name must be between 3 and 150 characters'),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),

    body('password')
      .isLength({ min: 8 })
      .matches(/(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters and include letters and numbers'),

    body('ownerName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Owner name must not exceed 100 characters'),
  ],
  companyRegister
);

/**
 * COMPANY LOGIN
 */
router.post('/company/login', companyLogin);

/**
 * COMPANY GET ME
 */
router.get('/company/me', authMiddleware, companyGetMe);

module.exports = router;
