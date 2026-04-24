const express = require('express');
const { protectCandidate } = require('../middlewares/candidateAuthMiddleware');
const auth = require('../middlewares/authMiddleware');
const { isRecruiter } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  uploadResume,
  changePassword,
  getAppliedJobs,
  getBookmarks,
  addBookmark,
  removeBookmark,
  getCandidateById
} = require('../controllers/candidateController');

const router = express.Router();

// ✅ CANDIDATE ROUTES - Protected with protectCandidate middleware
// Profile routes
router.get('/me', protectCandidate, getMyProfile);
router.put('/me', protectCandidate, updateMyProfile);
router.post('/me/profile-image', protectCandidate, upload.single('profileImage'), uploadProfileImage);
router.post('/me/resume', protectCandidate, upload.single('resume'), uploadResume);

// Password management
router.put('/change-password', protectCandidate, changePassword);

// Applied jobs
router.get('/applied-jobs', protectCandidate, getAppliedJobs);

// Bookmark routes
router.get('/bookmarks', protectCandidate, getBookmarks);
router.post('/bookmarks/:jobId', protectCandidate, addBookmark);
router.delete('/bookmarks/:jobId', protectCandidate, removeBookmark);

// ✅ RECRUITER ROUTE - View candidate details (must come AFTER specific routes like /me)
// This route allows recruiters to view candidate profiles who applied to their jobs
router.get('/:id', auth, isRecruiter, getCandidateById);

module.exports = router;
