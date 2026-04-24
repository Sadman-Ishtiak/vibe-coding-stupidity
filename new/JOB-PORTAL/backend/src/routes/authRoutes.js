const express = require('express');

const { register, login, me, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { registerValidator, loginValidator, updatePasswordValidator } = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', protect, me);
router.put('/password', protect, updatePasswordValidator, validate, updatePassword);

module.exports = router;
