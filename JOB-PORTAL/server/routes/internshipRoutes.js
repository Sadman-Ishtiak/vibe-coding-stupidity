import express from 'express'
import {
  listJobs,
  listBookmarkedJobs,
  addJobBookmark,
  removeJobBookmark,
  getJobDetails,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/internshipController.js'
import { applyToJob } from '../controllers/applicationController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { authorizeRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

/**
 * @route GET /jobs
 * @desc Get all active jobs
 */
router.get('/', listJobs)

/**
 * @route GET /jobs/bookmarks
 * @desc Get bookmarked jobs (Candidate only)
 * @auth Required
 */
router.get('/bookmarks', authenticateToken, authorizeRole(['candidate']), listBookmarkedJobs)

/**
 * @route POST /jobs/:jobId/bookmark
 * @desc Bookmark a job (Candidate only)
 * @auth Required
 */
router.post('/:jobId/bookmark', authenticateToken, authorizeRole(['candidate']), addJobBookmark)

/**
 * @route DELETE /jobs/:jobId/bookmark
 * @desc Remove bookmark (Candidate only)
 * @auth Required
 */
router.delete('/:jobId/bookmark', authenticateToken, authorizeRole(['candidate']), removeJobBookmark)

/**
 * @route GET /jobs/:jobId
 * @desc Get job details
 */
router.get('/:jobId', getJobDetails)

/**
 * @route POST /jobs/:jobId/apply
 * @desc Apply to a job (Candidate only)
 * @auth Required, Role: candidate
 */
router.post('/:jobId/apply', authenticateToken, authorizeRole(['candidate']), applyToJob)

/**
 * @route POST /jobs
 * @desc Create a new job (Recruiter only)
 * @auth Required, Role: recruiter
 */
router.post('/', authenticateToken, authorizeRole(['recruiter']), createJob)

/**
 * @route PUT /jobs/:jobId
 * @desc Update job (Recruiter only)
 * @auth Required, Role: recruiter
 */
router.put('/:jobId', authenticateToken, authorizeRole(['recruiter']), updateJob)

/**
 * @route DELETE /jobs/:jobId
 * @desc Delete job (Recruiter only)
 * @auth Required, Role: recruiter
 */
router.delete('/:jobId', authenticateToken, authorizeRole(['recruiter']), deleteJob)

export default router
