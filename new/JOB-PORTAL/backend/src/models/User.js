const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    bio: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    resumeUrl: { type: String, trim: true },
    companyName: { type: String, trim: true },
    website: { type: String, trim: true },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'candidate', 'company', 'publisher'],
      default: 'candidate',
    },
    isApproved: { type: Boolean, default: true },
    profileViews: { type: Number, default: 0 },
    viewsHistory: [
      {
        date: { type: Date },
        count: { type: Number },
      },
    ],
    profile: { type: ProfileSchema, default: {} },
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.viewsHistory;
    // frontend sometimes expects `approved`
    ret.approved = ret.isApproved;
    return ret;
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
