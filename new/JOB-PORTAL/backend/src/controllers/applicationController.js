const { Application } = require('../models/Application');
const { Notification } = require('../models/Notification');
const { Internship } = require('../models/Internship');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('internship')
    .populate('candidate', 'name email profile');

  if (!application) throw new ApiError(404, 'Application not found');

  // Check permission: Admin, Candidate (owner), or Company (owner of internship)
  const isCandidate = application.candidate._id.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  let isCompany = false;

  if (!isCandidate && !isAdmin) {
    const internship = await Internship.findById(application.internship._id);
    if (internship && internship.postedBy.toString() === req.user.id) {
      isCompany = true;
    }
  }

  if (!isCandidate && !isAdmin && !isCompany) {
    throw new ApiError(403, 'Forbidden');
  }

  res.json(application.toJSON());
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id).populate('internship');

  if (!application) throw new ApiError(404, 'Application not found');

  // Only Admin or Company (owner of internship) can update status
  const internship = await Internship.findById(application.internship._id);
  const isCompany = internship && internship.postedBy.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isCompany && !isAdmin) {
    throw new ApiError(403, 'Forbidden');
  }

  const oldStatus = application.status;
  application.status = status;
  await application.save();

  // Notify Candidate if status changed
  if (oldStatus !== status) {
    await Notification.create({
      recipient: application.candidate,
      title: 'Application Status Update',
      message: `Your application for ${internship.title} is now ${status}.`,
      type: status === 'accepted' ? 'success' : status === 'rejected' ? 'error' : 'info',
      relatedLink: '/dashboard/applications',
    });
  }

  res.json(application.toJSON());
});

module.exports = { getApplicationById, updateApplicationStatus };
