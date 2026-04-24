import express from 'express'
import { createJob, getCompanyJobs, updateJobStatus, deleteJob, getJobs } from '../controllers/jobController.js'
import { validateJobFilters } from '../validators/jobValidator.js'
import { validateCreateJob } from '../validations/schemas.js'
import { handleValidationErrors } from '../validations/schemas.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public listing with filters
router.get('/', validateJobFilters, getJobs)

router.post('/', authenticateToken, validateCreateJob, handleValidationErrors, createJob)
router.get('/company', authenticateToken, getCompanyJobs)
router.patch('/:id/status', authenticateToken, updateJobStatus)
router.delete('/:id', authenticateToken, deleteJob)

export default router
