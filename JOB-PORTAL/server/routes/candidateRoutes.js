import express from 'express'
import {
  getCandidateProfile,
  updateCandidateProfile,
  listCandidates,
  rankedCandidates,
} from '../controllers/candidateController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { candidateUpdateValidator } from '../validators/candidateValidator.js'

const router = express.Router()

router.get('/profile', authenticateToken, getCandidateProfile)
router.put('/profile', authenticateToken, candidateUpdateValidator, updateCandidateProfile)

// Candidate list/grid
router.get('/', listCandidates)

// Ranked candidates for a job (company only)
router.get('/ranked', authenticateToken, authorizeRoles('company'), rankedCandidates)

export default router

