const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const connectDB = require('../server/config/db');
const mongoose = require('mongoose');
const User = require('../server/models/User');
const Company = require('../server/models/Company');
const { updateMyProfile } = require('../server/controllers/companyController');

(async () => {
  try {
    await connectDB();

    // Find or create a recruiter user to test with
    let user = await User.findOne({ role: 'recruiter' });
    if (!user) {
      console.log('No recruiter user found. Creating test recruiter...');
      user = await User.create({
        username: 'test-recruiter',
        email: `test-recruiter-${Date.now()}@example.com`,
        password: 'Password123',
        role: 'recruiter'
      });
    }
    user = user.toObject ? user.toObject() : user;

    console.log('Using user:', user.email, user._id.toString());

    // Ensure upload directories
    const uploadsProfile = path.join(process.cwd(), 'uploads', 'profile-pics');
    const uploadsGallery = path.join(process.cwd(), 'uploads', 'gallery');
    await fs.mkdir(uploadsProfile, { recursive: true });
    await fs.mkdir(uploadsGallery, { recursive: true });

    // Create two temporary images
    const profileImageName = `test-profile-${Date.now()}.jpeg`;
    const galleryImageName = `test-gallery-${Date.now()}.jpeg`;
    const profileImagePath = path.join(uploadsProfile, profileImageName);
    const galleryImagePath = path.join(uploadsGallery, galleryImageName);

    await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 200, g: 50, b: 50 }
      }
    }).jpeg().toFile(profileImagePath);

    await sharp({
      create: {
        width: 800,
        height: 600,
        channels: 3,
        background: { r: 50, g: 200, b: 50 }
      }
    }).jpeg().toFile(galleryImagePath);

    // Prepare mocked req/res
    const req = {
      user: { _id: user._id },
      body: {
        companyName: 'Test Company From Script',
        companyDescription: 'Updated by test script',
      },
      // Simulate files as Multer objects with processedPath
      files: {
        profilePicture: [
          {
            fieldname: 'profilePicture',
            originalname: profileImageName,
            filename: profileImageName,
            path: profileImagePath,
            processedPath: `/uploads/profile-pics/${profileImageName}`
          }
        ],
        galleryImages: [
          {
            fieldname: 'galleryImages',
            originalname: galleryImageName,
            filename: galleryImageName,
            path: galleryImagePath,
            processedPath: `/uploads/gallery/${galleryImageName}`
          }
        ]
      }
    };

    const res = {
      status(code) {
        this._status = code;
        return this;
      },
      json(payload) {
        console.log('Response:', JSON.stringify(payload, null, 2));
      }
    };

    const next = (err) => {
      if (err) console.error('Next called with error:', err);
    };

    // Call controller
    await updateMyProfile(req, res, next);

    // Verify DB changes
    const company = await Company.findOne({ owner: user._id }).lean();
    console.log('Company after update:', company ? {
      id: company._id.toString(),
      name: company.name,
      logo: company.logo,
      gallery: company.gallery
    } : null);

    // Done
    await mongoose.disconnect();
    console.log('Test script finished.');
    process.exit(0);
  } catch (err) {
    console.error('Test script error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
})();
