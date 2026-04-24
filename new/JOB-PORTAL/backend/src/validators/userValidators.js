const { body } = require('express-validator');

const updateUserValidator = [
  body('name').optional().isString().trim().notEmpty(),
  body('role').optional().isIn(['admin', 'candidate', 'company', 'publisher']),
  body('isApproved').optional().isBoolean(),
  body('profile').optional().isObject(),
];

const updateProfileValidator = [
  body('phone').optional().isString().trim(),
  body('location').optional().isString().trim(),
  body('bio').optional().isString().trim(),
  body('skills').optional().isArray(),
  body('resumeUrl').optional().isString().trim(),
  body('companyName').optional().isString().trim(),
  body('website').optional().isString().trim(),
];

module.exports = { updateUserValidator, updateProfileValidator };
