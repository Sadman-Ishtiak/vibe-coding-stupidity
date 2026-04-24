import express from 'express'
import path from 'path'
import User from '../models/User.js'
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
} from '../controllers/userController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { authorizeRole } from '../middleware/roleMiddleware.js'
import { upload } from '../middleware/upload.js'
import {
  updateProfileSchema,
  changePasswordSchema,
  handleValidationErrors,
} from '../validations/schemas.js'

const router = express.Router()

// ===== CURRENT USER PROFILE =====
router.get('/me', authenticateToken, authorizeRole(['candidate']), getMyProfile)
router.put(
  '/me',
  authenticateToken,
  authorizeRole(['candidate']),
  updateProfileSchema,
  handleValidationErrors,
  updateMyProfile
)

router.put(
  '/me/change-password',
  authenticateToken,
  changePasswordSchema,
  handleValidationErrors,
  changePassword
)

// Profile picture upload
router.post(
  '/me/profile-picture',
  authenticateToken,
  authorizeRole(['candidate']),
  upload.single('profilePicture'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    await User.findByIdAndUpdate(req.user.id, {
      profilePicture: `/uploads/profile-pictures/${req.file.filename}`,
    })

    return res.json({ success: true, message: 'Profile picture updated' })
  }
)

// Resume upload
router.post(
  '/me/resume',
  authenticateToken,
  authorizeRole(['candidate']),
  upload.single('resume'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    await User.findByIdAndUpdate(req.user.id, {
      resume: `/uploads/resumes/${req.file.filename}`,
    })

    return res.json({ success: true, message: 'Resume uploaded' })
  }
)

// Resume download (auth required)
router.get(
  '/me/resume',
  authenticateToken,
  authorizeRole(['candidate']),
  async (req, res) => {
    const user = await User.findById(req.user.id).select('resume')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const resumePath = String(user.resume || '')
    if (!resumePath) return res.status(404).json({ success: false, message: 'No resume uploaded' })
    if (!resumePath.startsWith('/uploads/')) {
      return res.status(400).json({ success: false, message: 'Invalid resume path' })
    }

    const rel = resumePath.replace(/^\//, '')
    const absolute = path.join(process.cwd(), rel)
    return res.download(absolute)
  }
)

export default router
