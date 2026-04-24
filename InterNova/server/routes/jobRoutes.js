const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  createJob, 
  getJobs, 
  getJob, 
  updateJob, 
  deleteJob, 
  getMyJobs,
  updateJobStatus,
  getMyJobStats
} = require('../controllers/jobController');
const auth = require('../middlewares/authMiddleware');
const optionalAuth = require('../middlewares/optionalAuthMiddleware');
const { isRecruiter } = require('../middlewares/roleMiddleware');
const { validateDistrict } = require('../utils/districtValidator');

// Validation middleware for job creation/update
const jobValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Job category is required'),
  
  body('vacancy')
    .isInt({ min: 1 })
    .withMessage('Vacancy must be at least 1'),
  
  body('employmentType')
    .trim()
    .notEmpty()
    .withMessage('Employment type is required'),
  
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position level is required'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('salaryRange')
    .trim()
    .notEmpty()
    .withMessage('Salary range is required'),
  
  body('experience')
    .trim()
    .notEmpty()
    .withMessage('Experience requirement is required'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 50 })
    .withMessage('Description must be at least 50 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skillsExperienceDescription')
    .optional()
    .trim(),
  
  body('responsibilities')
    .optional()
    .trim(),
  
  body('qualifications')
    .optional()
    .trim(),
  
  body('status')
    .optional()
    .isIn(['active', 'paused', 'closed'])
    .withMessage('Invalid status value')
];

// Public routes (with optional auth for bookmark status)
router.get('/', optionalAuth, getJobs);
router.get('/:id', optionalAuth, getJob);

// Protected routes - Recruiter only (must be before /:id to avoid conflicts)
router.get('/recruiter/my-jobs', auth, isRecruiter, getMyJobs);
router.get('/recruiter/stats', auth, isRecruiter, getMyJobStats);
router.post('/', auth, isRecruiter, validateDistrict('location'), jobValidation, createJob);
router.put('/:id', auth, isRecruiter, validateDistrict('location'), jobValidation, updateJob);
router.patch('/:id/status', auth, isRecruiter, updateJobStatus);
router.delete('/:id', auth, isRecruiter, deleteJob);

module.exports = router;
