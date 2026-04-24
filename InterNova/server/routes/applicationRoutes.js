const express = require('express');
const router = express.Router();
const {
  apply,
  publicApply,
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');
const auth = require('../middlewares/authMiddleware');
const { protectCandidate } = require('../middlewares/candidateAuthMiddleware');
const { isCandidate, isRecruiter } = require('../middlewares/roleMiddleware');

// Candidate routes
router.post('/apply', protectCandidate, apply);
// Public apply endpoint (for guests)
router.post('/apply-public', publicApply);
router.get('/my', protectCandidate, getMyApplications);
router.delete('/:id', protectCandidate, deleteApplication);

// Recruiter routes
router.get('/job/:jobId', auth, isRecruiter, getApplicationsForJob);
router.put('/:id/status', auth, isRecruiter, updateApplicationStatus);

module.exports = router;
