import { body, param, validationResult } from 'express-validator'

/**
 * Auth Validation
 */
export const validateSignUp = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('accountType')
    .optional()
    .isIn(['candidate', 'recruiter', 'company', 'admin'])
    .withMessage('Invalid account type'),
]

export const validateSignIn = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]

/**
 * Job Validation
 */
export const validateCreateJob = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required'),
  body('companyId')
    .notEmpty()
    .withMessage('Company ID is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('salaryText')
    .trim()
    .notEmpty()
    .withMessage('Salary information is required'),
  body('experienceText')
    .trim()
    .notEmpty()
    .withMessage('Experience requirement is required'),
]

/**
 * Application Validation
 */
export const validateJobApplication = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required'),
  body('resumeUrl')
    .trim()
    .notEmpty()
    .withMessage('Resume URL is required'),
]

/**
 * Candidate Profile Validation
 */
export const updateProfileSchema = [
  body('firstName').optional({ checkFalsy: true }).isString().trim(),
  body('lastName').optional({ checkFalsy: true }).isString().trim(),
  body('designation').optional({ checkFalsy: true }).isString().trim(),
  body('phone').optional({ checkFalsy: true }).isString(),
  body('location').optional({ checkFalsy: true }).isString(),
  body('about').optional({ checkFalsy: true }).isString(),

  body('skills').optional().isArray(),
  body('languages').optional().isArray(),

  body('education').optional().isArray(),
  body('education.*.degree').optional({ checkFalsy: true }).isString(),
  body('education.*.institute').optional({ checkFalsy: true }).isString(),
  body('education.*.duration').optional({ checkFalsy: true }).isString(),
  body('education.*.description').optional({ checkFalsy: true }).isString(),

  body('experience').optional().isArray(),
  body('experience.*.title').optional({ checkFalsy: true }).isString(),
  body('experience.*.company').optional({ checkFalsy: true }).isString(),
  body('experience.*.duration').optional({ checkFalsy: true }).isString(),
  body('experience.*.description').optional({ checkFalsy: true }).isString(),

  body('socials.facebook').optional({ checkFalsy: true }).isURL(),
  body('socials.twitter').optional({ checkFalsy: true }).isURL(),
  body('socials.whatsapp').optional({ checkFalsy: true }).isString(),
  body('socials.phoneCall').optional({ checkFalsy: true }).isString(),
]

export const changePasswordSchema = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
]

/**
 * ID Validation
 */
export const validateMongooseId = (paramName = 'id') => [
  param(paramName)
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage(`Invalid ${paramName}`),
]

/**
 * Validation Error Handler Middleware
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    })
  }
  next()
}
