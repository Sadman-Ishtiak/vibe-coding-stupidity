const { User } = require('../models/User');
const { Application } = require('../models/Application');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users.map((u) => u.toJSON()));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if (!user) throw new ApiError(404, 'User not found');
  res.json(user.toJSON());
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  const { name, role, isApproved, profile } = req.body;
  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (isApproved !== undefined) user.isApproved = isApproved;
  if (profile !== undefined) user.profile = { ...user.profile.toObject(), ...profile };

  await user.save();
  res.json(user.toJSON());
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.profile = { ...user.profile.toObject(), ...req.body };
  await user.save();

  res.json(user.toJSON());
});

const getApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ candidate: req.user.id })
    .populate('internship')
    .sort({ createdAt: -1 });
  res.json(apps.map((a) => a.toJSON()));
});

const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.isApproved = true;
  await user.save();

  res.json({ message: 'User approved', user: user.toJSON() });
});

const recordProfileView = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.profileViews = (user.profileViews || 0) + 1;

  // Update history
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const historyIndex = user.viewsHistory.findIndex(
    (h) => new Date(h.date).getTime() === today.getTime()
  );

  if (historyIndex > -1) {
    user.viewsHistory[historyIndex].count += 1;
  } else {
    user.viewsHistory.push({ date: today, count: 1 });
  }

  // Keep history manageable (last 30 days)
  if (user.viewsHistory.length > 30) {
    user.viewsHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
    user.viewsHistory = user.viewsHistory.slice(user.viewsHistory.length - 30);
  }

  await user.save();
  res.json({ views: user.profileViews });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  getApplications,
  approveUser,
  recordProfileView,
};
