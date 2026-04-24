import express from 'express'
import {
  listCompanies,
  getCompanyDetails,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanies,
  getMyCompany,
  updateMyCompany,
} from '../controllers/companyController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { authorizeRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

/**
 * @route GET /companies
 * @desc Get all companies
 */
router.get('/', listCompanies)

/**
 * @route GET /companies/:companyId
 * @desc Get company details
 */
router.get('/:companyId', getCompanyDetails)

// Profile endpoints for authenticated user's company
router.get('/profile/me', authenticateToken, getMyCompany)
router.put('/profile/me', authenticateToken, updateMyCompany)

/**
 * @route POST /companies
 * @desc Create a new company (Recruiter only)
 * @auth Required, Role: recruiter
 */
router.post('/', authenticateToken, authorizeRole(['recruiter']), createCompany)

/**
 * @route PUT /companies/:companyId
 * @desc Update company (Recruiter only)
 * @auth Required, Role: recruiter
 */
router.put('/:companyId', authenticateToken, authorizeRole(['recruiter']), updateCompany)

/**
 * @route DELETE /companies/:companyId
 * @desc Delete company (Recruiter only)
 * @auth Required, Role: recruiter
 */
router.delete('/:companyId', authenticateToken, authorizeRole(['recruiter']), deleteCompany)

export default router
