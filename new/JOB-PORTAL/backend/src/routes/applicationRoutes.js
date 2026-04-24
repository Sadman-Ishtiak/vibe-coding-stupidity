const express = require('express');
const { getApplicationById, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { check } = require('express-validator');

const router = express.Router();

router.use(protect);

const statusValidator = [
  check('status')
    .isIn(['applied', 'reviewing', 'shortlisted', 'rejected', 'accepted'])
    .withMessage('Invalid status'),
];

router.get('/:id', getApplicationById);
router.put('/:id/status', requireRole('company', 'publisher', 'admin'), statusValidator, validate, updateApplicationStatus);

module.exports = router;
