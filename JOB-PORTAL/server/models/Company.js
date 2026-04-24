import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: String,
    ownerName: String,
    email: { type: String, required: true, unique: true },
    phone: String,
    website: String,
    location: String,
    industry: String,
    employeesRange: String,
    establishedAt: Date,

    socialLinks: {
      facebook: String,
      twitter: String,
      whatsapp: String,
      linkedin: String,
    },

    workingDays: { type: [String], default: [] },

    description: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

companySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = String(ret._id)
    delete ret._id
    return ret
  },
})

companySchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = String(ret._id)
    delete ret._id
    return ret
  },
})

export default mongoose.model('Company', companySchema)

// Indexes for search & filters
companySchema.index({ name: 'text' })
companySchema.index({ location: 1 })
companySchema.index({ createdAt: -1 })
