import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    vacancy: { type: Number, required: true },
    employmentType: String,
    position: String,
    location: String,

    salaryMin: Number,
    salaryMax: Number,

    description: String,
    responsibilities: String,
    qualifications: String,
    skills: { type: [String], default: [] },

    status: {
      type: String,
      enum: ['active', 'paused', 'closed'],
      default: 'active',
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
)

jobSchema.set('toJSON', { virtuals: true, versionKey: false, transform: (_, ret) => { ret.id = String(ret._id); delete ret._id; return ret } })
jobSchema.set('toObject', { virtuals: true, versionKey: false, transform: (_, ret) => { ret.id = String(ret._id); delete ret._id; return ret } })

export default mongoose.model('Job', jobSchema)

// Indexes for common queries
jobSchema.index({ company: 1 })
jobSchema.index({ status: 1 })
jobSchema.index({ category: 1 })
jobSchema.index({ location: 1 })
jobSchema.index({ createdAt: -1 })
