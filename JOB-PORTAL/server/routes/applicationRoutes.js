import express from 'express'
import {
  getApplicants,
  updateStatus,
  deleteApplication,
  getMyApplications,
  shortlistCandidate,
  getShortlistedCandidates,
} from '../controllers/applicationController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { authorizeRole, authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

/**
 * @route GET /applications/job/:jobId
 * @desc Get all applications for a job (Recruiter only)
 * @auth Required, Role: recruiter
 */
router.get('/job/:jobId', authenticateToken, authorizeRole(['recruiter']), getApplicants)

/**
 * @route PUT /applications/:applicationId/status
 * @desc Update application status (Recruiter only)
 * @auth Required, Role: recruiter
 */
router.patch('/:id/status', authenticateToken, authorizeRoles('company'), updateStatus)

/**
 * @route DELETE /applications/:applicationId
 * @desc Delete an application
 * @auth Required
 */
router.delete('/:applicationId', authenticateToken, deleteApplication)

/**
 * @route GET /applications/my
 * @desc Get my applications (candidate)
 * @auth Required, Role: candidate
 */
router.get('/my', authenticateToken, authorizeRole(['candidate']), getMyApplications)

// Shortlist a candidate (company)
router.put('/:id/shortlist', authenticateToken, authorizeRoles('company'), shortlistCandidate)

// Get shortlisted candidates for company
router.get('/shortlisted', authenticateToken, authorizeRoles('company'), getShortlistedCandidates)

export default router
