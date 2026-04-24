import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      alias: 'candidate',
    },
    resume: {
      path: String,
      originalName: String,
      mimeType: String,
      size: Number,
    },

    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },

    shortlistedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },

    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],

    matchScore: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
)

// Unique per job/applicant
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

// Performance indexes
applicationSchema.index({ job: 1 })
applicationSchema.index({ applicant: 1 })
applicationSchema.index({ status: 1 })

export default mongoose.model('Application', applicationSchema)
