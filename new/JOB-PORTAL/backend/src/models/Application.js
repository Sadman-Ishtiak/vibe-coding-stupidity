const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    status: { type: String, enum: ['applied', 'reviewing', 'shortlisted', 'rejected', 'accepted'], default: 'applied' },
  },
  { timestamps: true }
);

ApplicationSchema.index({ internship: 1, candidate: 1 }, { unique: true });

ApplicationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = { Application };
