import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, adminController.getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, adminController.getUserById);
router.put('/users/:id/approve', authMiddleware, adminMiddleware, adminController.approveUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, adminController.deleteUser);
router.get('/analytics', authMiddleware, adminMiddleware, adminController.getAnalytics);

export default router;
