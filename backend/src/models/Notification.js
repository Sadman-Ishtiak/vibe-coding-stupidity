import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['status_update', 'new_application', 'system'], 
      default: 'system' 
    },
    read: { type: Boolean, default: false },
    relatedLink: { type: String }, // e.g., "/internships/123"
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
