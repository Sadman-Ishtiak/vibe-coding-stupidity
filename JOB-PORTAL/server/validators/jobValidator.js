import { query } from 'express-validator'

export const validateJobFilters = [
  query('location').optional().isString().withMessage('Location must be a string'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('salaryMin').optional().isNumeric().withMessage('salaryMin must be a number'),
  query('salaryMax').optional().isNumeric().withMessage('salaryMax must be a number'),
  query('skills').optional().isString().withMessage('skills must be a comma-separated string'),
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('page must be an integer >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('limit must be an integer 1-100'),
  query('sortBy').optional().isString().withMessage('sortBy must be a string'),
  query('order').optional().isIn(['asc', 'desc', '1', '-1']).withMessage('order must be asc or desc'),
]

export default validateJobFilters
import { body } from 'express-validator'

export const createJobValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('vacancy').isInt({ min: 1 }).withMessage('Vacancy must be an integer >= 1'),
  body('salaryMin').optional().isNumeric().withMessage('salaryMin must be numeric'),
  body('salaryMax').optional().isNumeric().withMessage('salaryMax must be numeric'),
]
