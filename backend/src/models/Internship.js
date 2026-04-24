import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Engineering',
        'Business',
        'Marketing',
        'Design',
        'Data Science',
        'Finance',
        'Human Resources',
        'Legal',
        'Sales',
        'Other',
      ],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    stipend: { type: Number },
    stipendType: {
      type: String,
      enum: ['Fixed', 'Hourly', 'None'],
      default: 'None',
    },
    duration: { type: String }, // e.g., "3 months"
    requirements: [{ type: String }],
    perks: [{ type: String }],
    isActive: { type: Boolean, default: true },
    applicationCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Internship', internshipSchema);
