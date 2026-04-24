const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const internshipRoutes = require('./internshipRoutes');
const chatbotRoutes = require('./chatbotRoutes');
const notificationRoutes = require('./notificationRoutes');
const applicationRoutes = require('./applicationRoutes');
const statsRoutes = require('./statsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/internships', internshipRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/notifications', notificationRoutes);
router.use('/applications', applicationRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
