import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['candidate', 'company', 'admin'],
      required: true,
    },
    phone: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    isApproved: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    
    // Company-specific fields
    companyName: { type: String },
    companyWebsite: { type: String },
    companyLocation: { type: String },
    
    // Candidate-specific fields
    skills: [{ type: String }],
    education: {
      school: String,
      degree: String,
      field: String,
      graduationYear: Number,
    },
    resume: { type: String }, // URL to resume file
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

// Method to return user without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);
