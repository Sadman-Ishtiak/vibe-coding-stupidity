import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted'],
      default: 'Applied',
    },
    appliedAt: { type: Date, default: Date.now },
    coverLetter: { type: String },
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

// Ensure one candidate can only apply once per internship
applicationSchema.index({ internship: 1, candidate: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
