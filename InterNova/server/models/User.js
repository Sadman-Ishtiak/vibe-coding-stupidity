const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter'],
      required: true,
    },
    profilePicture: {
      type: String, // local file path
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    refreshTokenExpiry: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // ================= EMAIL OTP VERIFICATION =================
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTP: {
      type: String,
      default: null,
    },
    emailOTPExpires: {
      type: Date,
      default: null,
    },
    emailOTPPurpose: {
      type: String,
      enum: ['signup', 'reset', null],
      default: null,
    },
    otpVerifyAttempts: {
      type: Number,
      default: 0,
    },
    otpResendCount: {
      type: Number,
      default: 0,
    },
    otpResendResetAt: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true }
);

// ==================== PRE-SAVE HOOK ====================
// Hash password ONLY when modified (on create or password update)
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==================== INSTANCE METHOD ====================
// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
