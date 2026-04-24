const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    type: { type: String, trim: true },
    duration: { type: String, trim: true },
    stipend: { type: String, trim: true },
    description: { type: String, trim: true },
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

InternshipSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Internship = mongoose.model('Internship', InternshipSchema);

module.exports = { Internship };
