import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { authorizeRole } from '../middleware/roleMiddleware.js'
import { upload } from '../middleware/upload.js'
import {
  uploadResume,
  downloadResumeByUser,
  downloadResumeByApplication,
} from '../controllers/fileController.js'

const router = express.Router()

// Candidate uploads their resume
router.post('/resume', authenticateToken, authorizeRole(['candidate']), upload.single('resume'), uploadResume)

// Download resume for a user (owner/recruiter/admin)
router.get('/resume/:userId', authenticateToken, downloadResumeByUser)

// Download resume attached to an application (recruiter/admin)
router.get('/application/:applicationId/resume', authenticateToken, downloadResumeByApplication)

export default router
