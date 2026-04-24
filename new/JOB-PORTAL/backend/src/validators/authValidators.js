const { body } = require('express-validator');

const registerValidator = [
  body('name').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'candidate', 'company', 'publisher']),
];

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
];

const updatePasswordValidator = [
  body('currentPassword').isString().isLength({ min: 6 }),
  body('newPassword').isString().isLength({ min: 6 }),
];

module.exports = { registerValidator, loginValidator, updatePasswordValidator };
