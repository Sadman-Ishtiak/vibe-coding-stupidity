const { Notification } = require('../models/Notification');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications.map((n) => n.toJSON()));
});

const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);

  if (!notification) throw new ApiError(404, 'Notification not found');
  if (notification.recipient.toString() !== req.user.id) {
    throw new ApiError(403, 'Forbidden');
  }

  notification.isRead = true;
  await notification.save();

  res.json(notification.toJSON());
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { $set: { isRead: true } }
  );
  res.json({ message: 'All marked as read' });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);

  if (!notification) throw new ApiError(404, 'Notification not found');
  if (notification.recipient.toString() !== req.user.id) {
    throw new ApiError(403, 'Forbidden');
  }

  await notification.deleteOne();
  res.json({ message: 'Notification deleted' });
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
