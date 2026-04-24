const express = require('express');

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  getApplications,
  approveUser,
  recordProfileView,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { updateUserValidator, updateProfileValidator } = require('../validators/userValidators');

const router = express.Router();

// Public or Protected? Usually viewing a profile is public or protected.
// If protected, we use 'protect'.
// Let's make it protected for now as the app seems to require login.
router.use(protect);

router.post('/:id/view', recordProfileView);

router.get('/', requireRole('admin'), getAllUsers);
router.get('/applications', requireRole('candidate'), getApplications);
router.put('/profile', updateProfileValidator, validate, updateProfile);

router.get('/:id', requireRole('admin'), getUserById);
router.put('/:id', requireRole('admin'), updateUserValidator, validate, updateUser);
router.delete('/:id', requireRole('admin'), deleteUser);
router.put('/:id/approve', requireRole('admin'), approveUser);

module.exports = router;
