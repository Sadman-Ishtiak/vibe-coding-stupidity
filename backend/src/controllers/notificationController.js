import Notification from '../models/Notification.js';

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Internal utility to create notification
export const createNotification = async (recipientId, message, type, relatedLink) => {
  try {
    await Notification.create({
      recipient: recipientId,
      message,
      type,
      relatedLink
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};
