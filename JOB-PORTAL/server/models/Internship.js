import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Job title is required'], trim: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: [true, 'Company is required'] },
    companyName: { type: String, required: [true, 'Company name is required'] },
    companyLogoUrl: { type: String, required: [true, 'Company logo URL is required'] },
    location: { type: String, required: [true, 'Location is required'] },
    salaryText: { type: String, required: [true, 'Salary information is required'] },
    badges: { type: [String], default: [] },
    experienceText: { type: String, required: [true, 'Experience requirement is required'] },
    notes: String,
    descriptionHtml: String,
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Recruiter is required'] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

jobSchema.set('toJSON', { virtuals: true, versionKey: false, transform: (_, ret) => { ret.id = String(ret._id); delete ret._id; return ret } })
jobSchema.set('toObject', { virtuals: true, versionKey: false, transform: (_, ret) => { ret.id = String(ret._id); delete ret._id; return ret } })

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema)

export default Job
