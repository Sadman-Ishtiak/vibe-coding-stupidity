const { body } = require('express-validator');

const sendMessageValidator = [body('message').isString().trim().notEmpty()];

const resumeTipsValidator = [
  body('name').optional().isString().trim(),
  body('skills').optional().isArray(),
  body('experience').optional().isString(),
  body('education').optional().isString(),
];

const analyzeMatchValidator = [
  body('candidateId').isString().trim().notEmpty(),
  body('internshipId').isString().trim().notEmpty(),
];

module.exports = { sendMessageValidator, resumeTipsValidator, analyzeMatchValidator };
