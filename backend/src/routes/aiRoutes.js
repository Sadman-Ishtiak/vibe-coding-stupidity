import express from 'express';
import * as aiController from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', authMiddleware, aiController.analyzeResume);
router.post('/chat', authMiddleware, aiController.chatWithAI);

export default router;
