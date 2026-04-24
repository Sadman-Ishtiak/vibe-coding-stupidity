const { User } = require('../models/User');
const { Internship } = require('../models/Internship');
const { Application } = require('../models/Application');
const { asyncHandler } = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  const stats = {};

  if (role === 'admin') {
    stats.totalUsers = await User.countDocuments();
    stats.totalInternships = await Internship.countDocuments();
    stats.totalApplications = await Application.countDocuments();
    stats.candidates = await User.countDocuments({ role: 'candidate' });
    stats.companies = await User.countDocuments({ role: { $in: ['company', 'publisher'] } });
  } else if (role === 'candidate') {
    stats.applications = await Application.countDocuments({ candidate: id });
    const apps = await Application.find({ candidate: id }).select('status');
    stats.shortlisted = apps.filter((a) => a.status === 'shortlisted').length;
    stats.accepted = apps.filter((a) => a.status === 'accepted').length;

    const user = await User.findById(id).select('profileViews viewsHistory');
    stats.profileViews = user.profileViews || 0;
    stats.viewsHistory = user.viewsHistory || [];
  } else if (role === 'company' || role === 'publisher') {
    stats.postedInternships = await Internship.countDocuments({ postedBy: id });
    
    // Find all internships posted by this user
    const internships = await Internship.find({ postedBy: id }).select('_id');
    const internshipIds = internships.map(i => i._id);

    stats.totalApplicants = await Application.countDocuments({ internship: { $in: internshipIds } });
    stats.newApplicants = await Application.countDocuments({ 
        internship: { $in: internshipIds },
        status: 'applied' // Assuming 'applied' is the initial status
    });
  }

  res.json(stats);
});

module.exports = { getStats };
