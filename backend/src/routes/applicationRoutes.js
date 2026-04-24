import express from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { authMiddleware, candidateMiddleware, companyMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/:internshipId/apply',
  authMiddleware,
  candidateMiddleware,
  applicationController.applyToInternship
);
router.get('/candidate/applications', authMiddleware, candidateMiddleware, applicationController.getApplicationsByCandidate);
router.get('/company/applications', authMiddleware, companyMiddleware, applicationController.getApplicationsByCompany);
router.get('/:id', authMiddleware, applicationController.getApplicationById);
router.put('/:id/status', authMiddleware, companyMiddleware, applicationController.updateApplicationStatus);

export default router;
