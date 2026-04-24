import express from 'express';
import * as internshipController from '../controllers/internshipController.js';
import { authMiddleware, companyMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', internshipController.getAllInternships);
router.get('/my', authMiddleware, companyMiddleware, internshipController.getMyInternships);
router.get('/:id', internshipController.getInternshipById);
router.post('/', authMiddleware, companyMiddleware, internshipController.createInternship);
router.put('/:id', authMiddleware, companyMiddleware, internshipController.updateInternship);
router.delete('/:id', authMiddleware, companyMiddleware, internshipController.deleteInternship);

export default router;
