const express = require('express');
const router = express.Router();
const { 
  createCompany, 
  getCompanies, 
  getCompany,
  getCompanyJobs,
  getMyProfile,
  updateMyProfile,
  changePassword
} = require('../controllers/companyController');
const auth = require('../middlewares/authMiddleware');
const { isRecruiter } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { processImageMiddleware } = require('../middlewares/imageResize');
const { validateMultipleDistricts } = require('../utils/districtValidator');

// Public routes
router.get('/', getCompanies);

// Protected routes (recruiters only) - must be before /:id to avoid conflicts
router.get('/me', auth, isRecruiter, getMyProfile);
router.patch('/me', 
  auth, 
  isRecruiter,
  validateMultipleDistricts(['location', 'companyLocation']), 
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'galleryImages', maxCount: 3 }
  ]),
  processImageMiddleware('logo', 'profilePicture'),
  processImageMiddleware('gallery', 'galleryImages'),
  updateMyProfile
);
router.patch('/change-password', auth, isRecruiter, changePassword);
router.post('/', auth, isRecruiter, createCompany);

// Public route with ID param (must be last)
router.get('/:id', getCompany);
router.get('/:id/jobs', getCompanyJobs);

module.exports = router;
