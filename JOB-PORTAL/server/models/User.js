import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  startDate: Date,
  endDate: Date,
  isCurrent: Boolean,
  description: String,
})

const educationSchema = new mongoose.Schema({
  degree: String,
  institute: String,
  startYear: Number,
  endYear: Number,
})

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['candidate', 'company', 'admin'], required: true },

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    profilePicture: String,
    title: String,
    bio: String,

    // Overview
    location: String,
    category: String,
    skills: { type: [String], default: [] },
    experienceYears: Number,
    rating: { type: Number, default: 0 },

    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },

    resume: String,

    // Password reset OTP (hashed) and expiry
    resetOtp: String,
    resetOtpExpire: Date,

    // Relationships
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    bookmarkedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Internship' }],

    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      whatsapp: String,
    },
  },
  { timestamps: true }
)

userSchema.index({ name: 'text' })
userSchema.index({ location: 1 })

export default mongoose.model('User', userSchema)
