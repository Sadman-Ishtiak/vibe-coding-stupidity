import { body } from 'express-validator'

export const candidateUpdateValidator = [
  body('name').optional().isString().isLength({ min: 2 }),
  body('title').optional().isString(),
  body('location').optional().isString(),
  body('category').optional().isString(),
  body('skills').optional().isArray(),
  body('experienceYears').optional().isNumeric(),
  body('bio').optional().isString(),

  body('socialLinks.facebook').optional().isURL(),
  body('socialLinks.twitter').optional().isURL(),
  body('socialLinks.linkedin').optional().isURL(),
  body('socialLinks.whatsapp').optional().isString(),
]

export default { candidateUpdateValidator }
