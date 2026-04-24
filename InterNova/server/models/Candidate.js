const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const candidateSchema = new mongoose.Schema(
  {
    /* ================= USER REFERENCE ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    /* ================= BASIC INFO ================= */
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },

    lastName: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    /* ================= PROFILE INFO ================= */
    designation: {
      type: String,
      trim: true
    },

    profileImage: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      trim: true
    },

    about: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    /* ================= PROJECTS ================= */
    projects: [
      {
        projectUrl: {
          type: String,
          required: true,
          trim: true
        },
        hoverTitle: {
          type: String,
          trim: true
        }
      }
    ],

    /* ================= DOCUMENTS ================= */
    resume: {
      fileName: String,
      fileUrl: String,
      fileSize: String
    },

    /* ================= EDUCATION ================= */
    education: [
      {
        degree: String,
        university: String,
        duration: String,
        description: String
      }
    ],

    /* ================= EXPERIENCE ================= */
    experience: [
      {
        jobTitle: String,
        companyName: String,
        duration: String,
        roleDescription: String
      }
    ],

    /* ================= SKILLS & LANGUAGES ================= */
    skills: [
      {
        type: String
      }
    ],

    languages: [
      {
        type: String
      }
    ],

    /* ================= SOCIAL LINKS ================= */
    social: {
      facebook: String,
      linkedin: String,
      whatsapp: String,
      github: String,
      twitter: String,
      portfolio: String
    },

    /* ================= BOOKMARKS ================= */
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ]
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

// ==================== INSTANCE METHODS ====================
// Generate JWT access token
candidateSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { 
      id: this._id,
      userId: this.userId,
      role: 'candidate',
      userType: 'candidate' // ✅ Critical flag for authMiddleware
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' }
  );
};

module.exports = mongoose.model('Candidate', candidateSchema);
