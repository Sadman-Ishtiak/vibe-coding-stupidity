import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    res.json({
      message: 'User approved successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    ).select('-password');

    res.json({
      message: 'User deleted successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const candidates = await User.countDocuments({ role: 'candidate', isDeleted: false });
    const companies = await User.countDocuments({ role: 'company', isDeleted: false });
    const admins = await User.countDocuments({ role: 'admin', isDeleted: false });

    res.json({
      totalUsers,
      candidates,
      companies,
      admins,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
