import express from 'express'
import { signUp, login, forgotPassword, resetPassword, getMe, signOut, refresh } from '../controllers/authController.js'
import { upload } from '../middleware/upload.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { validateSignUp, validateSignIn, handleValidationErrors } from '../validations/schemas.js'

const router = express.Router()

const maybeUploadProfilePicture = (req, res, next) => {
  const contentType = String(req.headers['content-type'] || '')
  if (contentType.toLowerCase().includes('multipart/form-data')) {
    return upload.single('profilePicture')(req, res, next)
  }
  return next()
}

router.post(
  '/signup',
  maybeUploadProfilePicture,
  validateSignUp,
  handleValidationErrors,
  signUp
)

// Frontend expects dashed path (/auth/sign-up); keep both for compatibility
router.post(
  '/sign-up',
  maybeUploadProfilePicture,
  validateSignUp,
  handleValidationErrors,
  signUp
)

router.post('/login', validateSignIn, handleValidationErrors, login)
router.post('/sign-in', validateSignIn, handleValidationErrors, login)

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Refresh token endpoint (reads cookie)
router.post('/refresh', refresh)

// Frontend expects these
router.get('/me', authenticateToken, getMe)
router.post('/sign-out', signOut)

export default router
