const { ChatMessage } = require('../models/ChatMessage');
const { User } = require('../models/User');
const { Internship } = require('../models/Internship');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Save user message
  await ChatMessage.create({ user: req.user.id, role: 'user', content: message });

  // Minimal placeholder assistant (swap with real LLM later)
  const reply = `Thanks! I received: ${message}`;

  const assistantMsg = await ChatMessage.create({ user: req.user.id, role: 'assistant', content: reply });

  res.json({ reply, message: assistantMsg.toJSON() });
});

const getConversationHistory = asyncHandler(async (req, res) => {
  const msgs = await ChatMessage.find({ user: req.user.id }).sort({ createdAt: 1 });
  res.json(msgs.map((m) => m.toJSON()));
});

const clearHistory = asyncHandler(async (req, res) => {
  await ChatMessage.deleteMany({ user: req.user.id });
  res.json({ message: 'Chat history cleared' });
});

const getResumeTips = asyncHandler(async (req, res) => {
  // Placeholder endpoint (no external calls). You can later integrate OpenAI or similar.
  const tips = [
    'Use a one-line summary targeted to the role.',
    'Quantify impact (numbers, scope, results).',
    'List skills that match the internship requirements.',
    'Keep formatting consistent and ATS-friendly.',
  ];
  res.json({ tips });
});

const analyzeCandidateMatch = asyncHandler(async (req, res) => {
  const { candidateId, internshipId } = req.body;

  const candidate = await User.findById(candidateId).select('-passwordHash');
  if (!candidate) throw new ApiError(404, 'Candidate not found');

  const internship = await Internship.findById(internshipId);
  if (!internship) throw new ApiError(404, 'Internship not found');

  const internshipSkills = (internship.skills || []).map((s) => String(s).toLowerCase());
  const candidateSkills = (candidate.profile?.skills || []).map((s) => String(s).toLowerCase());

  const matched = internshipSkills.filter((s) => candidateSkills.includes(s));
  const score = internshipSkills.length ? matched.length / internshipSkills.length : 0;

  res.json({
    candidateId: candidate.id,
    internshipId: internship.id,
    score,
    matchedSkills: matched,
    summary: score >= 0.6 ? 'Strong match' : score >= 0.3 ? 'Moderate match' : 'Weak match',
  });
});

module.exports = { sendMessage, getConversationHistory, clearHistory, getResumeTips, analyzeCandidateMatch };
