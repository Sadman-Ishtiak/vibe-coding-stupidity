const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const { calculateCandidateProfileCompletion, calculateCompanyProfileCompletion } = require('../utils/profileCompletion');

/**
 * Middleware to ensure candidate profile is 100% complete before applying for jobs
 */
const requireCandidateProfileComplete = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        redirectTo: '/login'
      });
    }

    if (req.user.role !== 'candidate') {
      return res.status(403).json({ 
        message: 'Only candidates can apply for jobs',
        reason: 'INVALID_ROLE'
      });
    }

    const candidate = await Candidate.findOne({ userId: req.user.id })
      .populate('userId', 'name email');

    if (!candidate) {
      return res.status(404).json({ 
        message: 'Candidate profile not found. Please create your profile first.',
        redirectTo: '/candidate/profile'
      });
    }

    const profileCompletion = calculateCandidateProfileCompletion(candidate);

    if (profileCompletion < 100) {
      return res.status(403).json({ 
        message: 'Please complete your profile to apply for jobs',
        profileCompletion,
        reason: 'INCOMPLETE_PROFILE',
        redirectTo: '/candidate/profile'
      });
    }

    req.candidate = candidate;
    req.profileCompletion = profileCompletion;
    next();
  } catch (error) {
    console.error('Profile completion check error:', error);
    res.status(500).json({ message: 'Error checking profile completion' });
  }
};

/**
 * Middleware to ensure company profile is 100% complete before posting jobs
 */
const requireCompanyProfileComplete = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        redirectTo: '/login'
      });
    }

    if (req.user.role !== 'company' && req.user.role !== 'recruiter') {
      return res.status(403).json({ 
        message: 'Only companies can post jobs',
        reason: 'INVALID_ROLE'
      });
    }

    const company = await Company.findOne({ userId: req.user.id })
      .populate('userId', 'name email');

    if (!company) {
      return res.status(404).json({ 
        message: 'Company profile not found. Please create your profile first.',
        redirectTo: '/company/profile'
      });
    }

    const profileCompletion = calculateCompanyProfileCompletion(company);

    if (profileCompletion < 100) {
      return res.status(403).json({ 
        message: 'Please complete your company profile to post jobs',
        profileCompletion,
        reason: 'INCOMPLETE_PROFILE',
        redirectTo: '/company/profile'
      });
    }

    req.company = company;
    req.profileCompletion = profileCompletion;
    next();
  } catch (error) {
    console.error('Profile completion check error:', error);
    res.status(500).json({ message: 'Error checking profile completion' });
  }
};

module.exports = {
  requireCandidateProfileComplete,
  requireCompanyProfileComplete
};
