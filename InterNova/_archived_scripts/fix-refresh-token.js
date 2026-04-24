const mongoose = require('mongoose');
const User = require('./models/User');
const Candidate = require('./models/Candidate');
const { generateRefreshToken, getRefreshTokenExpiry } = require('./utils/generateToken');

async function fixRefreshToken() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/internova');
    
    const candidate = await Candidate.findOne().populate('userId');
    if (candidate && candidate.userId) {
      const user = candidate.userId;
      console.log('Current user state:');
      console.log('Email:', user.email);
      console.log('Has refreshToken:', !!user.refreshToken);
      console.log('Has refreshTokenExpiry:', !!user.refreshTokenExpiry);
      
      // Manually add tokens
      const refreshToken = generateRefreshToken(candidate._id, user.role, 'candidate');
      const refreshTokenExpiry = getRefreshTokenExpiry(7);
      
      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = refreshTokenExpiry;
      await user.save();
      
      console.log('\n✅ Manually added refresh token to user');
      console.log('User can now use token refresh!');
      console.log('Refresh token expires:', refreshTokenExpiry);
      
      // Also save to localStorage format for manual update
      console.log('\n📋 New refresh token (save this to localStorage):');
      console.log(refreshToken);
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixRefreshToken();
