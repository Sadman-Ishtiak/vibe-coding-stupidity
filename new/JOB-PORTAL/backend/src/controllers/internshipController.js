const mongoose = require('mongoose');

const { Internship } = require('../models/Internship');
const { Application } = require('../models/Application');
const { User } = require('../models/User');
const { Notification } = require('../models/Notification');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

function buildFilters(query) {
  const filters = {};
  if (query.keyword) {
    filters.$or = [
      { title: new RegExp(query.keyword, 'i') },
      { companyName: new RegExp(query.keyword, 'i') },
      { location: new RegExp(query.keyword, 'i') },
    ];
  }
  if (query.location) filters.location = new RegExp(query.location, 'i');
  if (query.type) filters.type = new RegExp(query.type, 'i');
  if (query.status) filters.status = query.status;
  return filters;
}

const getAllInternships = asyncHandler(async (req, res) => {
  const filters = buildFilters(req.query);
  const internships = await Internship.find(filters)
    .populate('postedBy', 'name email role')
    .sort({ createdAt: -1 });
  res.json(internships.map((i) => i.toJSON()));
});

const getInternshipById = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id).populate('postedBy', 'name email role');
  if (!internship) throw new ApiError(404, 'Internship not found');
  res.json(internship.toJSON());
});

const createInternship = asyncHandler(async (req, res) => {
  const payload = { ...req.body, postedBy: req.user.id };
  const internship = await Internship.create(payload);
  res.status(201).json(internship.toJSON());
});

const updateInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) throw new ApiError(404, 'Internship not found');

  if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  Object.assign(internship, req.body);
  await internship.save();
  res.json(internship.toJSON());
});

const deleteInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) throw new ApiError(404, 'Internship not found');

  if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  await internship.deleteOne();
  res.json({ message: 'Internship deleted' });
});

const applyToInternship = asyncHandler(async (req, res) => {
  if (req.user.role !== 'candidate') {
    throw new ApiError(403, 'Only candidates can apply');
  }

  const internship = await Internship.findById(req.params.id);
  if (!internship) throw new ApiError(404, 'Internship not found');
  if (internship.status !== 'open') throw new ApiError(400, 'Internship is closed');

  const { coverLetter, resumeUrl } = req.body;

  try {
    const application = await Application.create({
      internship: internship.id,
      candidate: req.user.id,
      coverLetter,
      resumeUrl,
    });

    // Notify the company/poster
    await Notification.create({
      recipient: internship.postedBy,
      title: 'New Application',
      message: `${req.user.name} applied for ${internship.title}`,
      type: 'info',
      relatedLink: `/dashboard/internships/${internship.id}`,
    });

    res.status(201).json({ message: 'Applied successfully', application: application.toJSON() });
  } catch (err) {
    if (err && err.code === 11000) {
      throw new ApiError(409, 'You already applied to this internship');
    }
    throw err;
  }
});

const getApplicants = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.internshipId);
  if (!internship) throw new ApiError(404, 'Internship not found');

  if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  const apps = await Application.find({ internship: internship.id })
    .populate('candidate', 'name email role profile')
    .sort({ createdAt: -1 });

  res.json(apps.map((a) => a.toJSON()));
});

const getBestMatches = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.internshipId);
  if (!internship) throw new ApiError(404, 'Internship not found');

  if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  const skills = Array.isArray(internship.skills) ? internship.skills.map((s) => String(s).toLowerCase()) : [];

  const candidates = await User.find({ role: 'candidate' }).select('-passwordHash');

  const scored = candidates
    .map((c) => {
      const candidateSkills = (c.profile?.skills || []).map((s) => String(s).toLowerCase());
      const overlap = skills.filter((s) => candidateSkills.includes(s));
      return {
        candidate: c.toJSON(),
        score: skills.length ? overlap.length / skills.length : 0,
        matchedSkills: overlap,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  res.json({ internshipId: internship.id, matches: scored });
});

module.exports = {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  applyToInternship,
  getApplicants,
  getBestMatches,
};
