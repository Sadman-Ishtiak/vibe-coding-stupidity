import express from 'express'
import { getAdminHealth, getAdminOverview, listUsers } from '../controllers/adminController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { authorizeRole } from '../middleware/roleMiddleware.js'

const router = express.Router()
router.get('/health', authenticateToken, authorizeRole(['admin']), getAdminHealth)
router.get('/overview', authenticateToken, authorizeRole(['admin']), getAdminOverview)
router.get('/users', authenticateToken, authorizeRole(['admin']), listUsers)
export default router
