const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

ChatMessageSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

module.exports = { ChatMessage };
