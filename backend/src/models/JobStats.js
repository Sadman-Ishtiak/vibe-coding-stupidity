import mongoose from 'mongoose';

const jobStatsSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    totalJobs: { type: Number, default: 0 },
    avgStipend: { type: Number, default: 0 },
    topSkills: [
      {
        skill: String,
        count: Number,
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('JobStats', jobStatsSchema);
