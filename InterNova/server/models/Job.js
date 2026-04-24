const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    // ===== BASIC JOB INFO =====
    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    vacancy: {
      type: Number,
      required: true,
      min: 1
    },

    employmentType: {
      type: String,
      required: true,
      trim: true
    },

    position: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    // ===== COMPENSATION & EXPERIENCE =====
    salaryRange: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: String,
      required: true,
      trim: true // e.g. "0–1 years", "2+ years"
    },

    // ===== SKILLS =====
    skills: {
      type: [String],
      default: []
    },

    // Combined Skills + Experience Description (Single Attribute)
    skillsExperienceDescription: {
      type: String,
      trim: true
    },

    // ===== JOB DETAILS =====
    description: {
      type: String,
      required: true,
      trim: true
    },

    responsibilities: {
      type: String,
      trim: true
    },

    qualifications: {
      type: String,
      trim: true
    },

    // ===== COMPANY / RECRUITER =====
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },

    // ===== JOB STATUS =====
    status: {
      type: String,
      enum: ['active', 'paused', 'closed'],
      default: 'active'
    }
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt (Date Posted filter ready)
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for application count
jobSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId',
  count: true
});

module.exports = mongoose.model('Job', jobSchema);
