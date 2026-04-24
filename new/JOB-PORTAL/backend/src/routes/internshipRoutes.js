const express = require('express');

const {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  applyToInternship,
  getApplicants,
  getBestMatches,
} = require('../controllers/internshipController');

const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { createInternshipValidator, updateInternshipValidator, applyValidator } = require('../validators/internshipValidators');

const router = express.Router();

router.get('/', getAllInternships);
router.get('/:id', getInternshipById);

router.post('/', protect, requireRole('company', 'publisher', 'admin'), createInternshipValidator, validate, createInternship);
router.put('/:id', protect, requireRole('company', 'publisher', 'admin'), updateInternshipValidator, validate, updateInternship);
router.delete('/:id', protect, requireRole('company', 'publisher', 'admin'), deleteInternship);

router.post('/:id/apply', protect, requireRole('candidate'), applyValidator, validate, applyToInternship);
router.get('/:internshipId/applicants', protect, requireRole('company', 'publisher', 'admin'), getApplicants);
router.get('/:internshipId/best-matches', protect, requireRole('company', 'publisher', 'admin'), getBestMatches);

module.exports = router;
