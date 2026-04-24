const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    resume: {
      type: String
    },

    // Guest applicant fields (used when candidate is not registered/logged in)
    applicantName: {
      type: String
    },
    applicantEmail: {
      type: String,
      lowercase: true,
      trim: true
    },
    coverLetter: {
      type: String
    },
    
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// ✅ CRITICAL: Unique compound index to prevent duplicate applications for registered candidates
// Use a partial index so it only applies when candidateId exists (not for guest applications)
applicationSchema.index(
  { candidateId: 1, jobId: 1 },
  { 
    unique: true, 
    partialFilterExpression: { candidateId: { $exists: true } },
    name: 'unique_candidate_job_application'
  }
);

// Performance indexes for common queries
applicationSchema.index({ candidateId: 1, status: 1 });
applicationSchema.index({ companyId: 1, status: 1 });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ recruiterId: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
