const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const companySchema = new mongoose.Schema(
  {
    /* ================= USER REFERENCE ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    /* ================= COMPANY BASIC INFO ================= */
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    ownerName: {
      type: String,
      trim: true,
      maxlength: 100
    },

    /* ================= COMPANY PROFILE ================= */
    establishedDate: {
      type: Date
    },

    companyWebsite: {
      type: String,
      trim: true
    },

    companyDescription: {
      type: String,
      maxlength: 3000
    },

    /* ================= BRANDING ================= */
    logo: {
      type: String,
      default: ''
    },

    gallery: [
      {
        type: String // image URL/path
      }
    ],

    /* ================= COMPANY STATS ================= */
    employees: {
      type: String, // e.g. "400-500"
      trim: true
    },

    companyLocation: {
      type: String, // Bangladesh district
      trim: true
    },

    /* ================= WORKING TIME ================= */
    workingSchedule: {
      monday: {
        isOpen: { type: Boolean, default: true },
        from: { type: String, default: '9AM' },
        to: { type: String, default: '5PM' }
      },
      tuesday: {
        isOpen: { type: Boolean, default: true },
        from: { type: String, default: '9AM' },
        to: { type: String, default: '5PM' }
      },
      wednesday: {
        isOpen: { type: Boolean, default: true },
        from: { type: String, default: '9AM' },
        to: { type: String, default: '5PM' }
      },
      thursday: {
        isOpen: { type: Boolean, default: true },
        from: { type: String, default: '9AM' },
        to: { type: String, default: '5PM' }
      },
      friday: {
        isOpen: { type: Boolean, default: true },
        from: { type: String, default: '9AM' },
        to: { type: String, default: '5PM' }
      },
      saturday: {
        isOpen: { type: Boolean, default: true },
        from: { type: String, default: '9AM' },
        to: { type: String, default: '5PM' }
      },
      sunday: {
        isOpen: { type: Boolean, default: false },
        from: { type: String, default: '' },
        to: { type: String, default: '' }
      }
    },

    /* ================= CONTACT ================= */
    phone: {
      type: String,
      trim: true
    },

    /* ================= SOCIAL LINKS ================= */
    socialLinks: {
      facebook: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      whatsapp: { type: String, trim: true }
    },

    /* ================= STATUS ================= */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/* ================= INSTANCE METHODS ================= */
companySchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { 
      id: this._id,
      userId: this.userId,
      role: 'company',
      userType: 'company' // ✅ Critical flag for authMiddleware
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' }
  );
};

module.exports = mongoose.model('Company', companySchema);
