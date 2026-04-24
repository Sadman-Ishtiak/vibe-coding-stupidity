const express = require('express');

const {
  sendMessage,
  getConversationHistory,
  clearHistory,
  getResumeTips,
  analyzeCandidateMatch,
} = require('../controllers/chatbotController');

const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { sendMessageValidator, resumeTipsValidator, analyzeMatchValidator } = require('../validators/chatbotValidators');

const router = express.Router();

router.use(protect);

router.post('/message', sendMessageValidator, validate, sendMessage);
router.get('/history', getConversationHistory);
router.delete('/history', clearHistory);
router.post('/resume-tips', resumeTipsValidator, validate, getResumeTips);
router.post('/analyze-match', analyzeMatchValidator, validate, analyzeCandidateMatch);

module.exports = router;
