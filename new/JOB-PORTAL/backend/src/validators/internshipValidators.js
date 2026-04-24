const { body } = require('express-validator');

const createInternshipValidator = [
  body('title').isString().trim().notEmpty(),
  body('companyName').isString().trim().notEmpty(),
  body('location').optional().isString().trim(),
  body('type').optional().isString().trim(),
  body('duration').optional().isString().trim(),
  body('stipend').optional().isString().trim(),
  body('description').optional().isString().trim(),
  body('requirements').optional().isArray(),
  body('skills').optional().isArray(),
];

const updateInternshipValidator = [
  body('title').optional().isString().trim().notEmpty(),
  body('companyName').optional().isString().trim().notEmpty(),
  body('location').optional().isString().trim(),
  body('type').optional().isString().trim(),
  body('duration').optional().isString().trim(),
  body('stipend').optional().isString().trim(),
  body('description').optional().isString().trim(),
  body('requirements').optional().isArray(),
  body('skills').optional().isArray(),
  body('status').optional().isIn(['open', 'closed']),
];

const applyValidator = [
  body('coverLetter').optional().isString().trim(),
  body('resumeUrl').optional().isString().trim(),
];

module.exports = { createInternshipValidator, updateInternshipValidator, applyValidator };
