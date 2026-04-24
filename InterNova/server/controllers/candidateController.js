const Candidate = require('../models/Candidate');
const { calculateCandidateProfileCompletion } = require('../utils/profileCompletion');

/**
 * @desc    Get current candidate profile
 * @route   GET /api/candidates/me
 * @access  Private (Candidate)
 */
exports.getMyProfile = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] GET /api/candidates/me - Candidate: ${req.candidate._id}`);
    
    // Format profile image URL
    const profileImageRaw = req.candidate.profileImage || '';
    const profileImage = profileImageRaw && !profileImageRaw.startsWith('http') 
      ? `${req.protocol}://${req.get('host')}/${profileImageRaw.replace(/^\//, '')}`
      : profileImageRaw;

    const candidateData = {
      _id: req.candidate._id,
      firstName: req.candidate.firstName || '',
      lastName: req.candidate.lastName || '',
      email: req.candidate.email,
      designation: req.candidate.designation || '',
      profileImage: profileImage || '',
      category: req.candidate.category || '',
      about: req.candidate.about || '',
      location: req.candidate.location || '',
      phone: req.candidate.phone || '',
      education: req.candidate.education || [],
      experience: req.candidate.experience || [],
      skills: req.candidate.skills || [],
      languages: req.candidate.languages || [],
      projects: req.candidate.projects || [],
      social: {
        facebook: req.candidate.social?.facebook || '',
        linkedin: req.candidate.social?.linkedin || '',
        whatsapp: req.candidate.social?.whatsapp || '',
        phoneCall: req.candidate.social?.phoneCall || ''
      },
      bookmarks: req.candidate.bookmarks || [],
      resume: req.candidate.resume || { fileName: '', fileUrl: '', fileSize: '' },
      role: req.candidate.role || 'candidate'
    };

    console.log(`[${requestId}] Profile loaded successfully`);

    // Calculate profile completion dynamically
    const profileCompletion = calculateCandidateProfileCompletion(req.candidate || {});

    res.status(200).json({
      success: true,
      data: { ...candidateData, profileCompletion }
    });
  } catch (error) {
    console.error(`[${requestId}] Get profile error:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update candidate profile
 * @route   PUT /api/candidates/me
 * @access  Private (Candidate)
 */
exports.updateMyProfile = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] PUT /api/candidates/me - Candidate: ${req.candidate._id}`);
    console.log(`[${requestId}] Update data received:`, req.body);
    
    // ✅ Email is immutable - ignore any email update attempts
    if (req.body.email && req.body.email !== req.candidate.email) {
      console.warn(`[${requestId}] Attempted to change email - rejected`);
      delete req.body.email;
    }

    // Update Candidate model directly
    const updateData = {};
    
    // Update firstName/lastName
    if (req.body.firstName !== undefined) updateData.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) updateData.lastName = req.body.lastName;
    
    // Update simple profile fields
    const allowedFields = ['designation', 'category', 'about', 'location', 'phone', 'profileImage'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });
    
    // Handle arrays
    if (req.body.skills !== undefined) {
      updateData.skills = Array.isArray(req.body.skills) 
        ? req.body.skills.filter(s => s && s.trim())
        : [];
    }
    if (req.body.languages !== undefined) {
      updateData.languages = Array.isArray(req.body.languages)
        ? req.body.languages.filter(l => l && l.trim())
        : [];
    }
    if (req.body.experience !== undefined) updateData.experience = req.body.experience;
    if (req.body.education !== undefined) updateData.education = req.body.education;
    if (req.body.projects !== undefined) updateData.projects = req.body.projects;
    
    // Handle social fields
    if (req.body.social !== undefined) {
      updateData.social = {
        linkedin: req.body.social.linkedin || req.candidate.social?.linkedin || '',
        facebook: req.body.social.facebook || req.candidate.social?.facebook || '',
        whatsapp: req.body.social.whatsapp || req.candidate.social?.whatsapp || '',
        phoneCall: req.body.social.phoneCall || req.candidate.social?.phoneCall || ''
      };
    }
    
    console.log(`[${requestId}] Fields to update:`, Object.keys(updateData));

    const candidate = await Candidate.findByIdAndUpdate(
      req.candidate._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const profileImageRaw = candidate.profileImage || '';
    const profileImage = profileImageRaw && !profileImageRaw.startsWith('http') 
      ? `${req.protocol}://${req.get('host')}/${profileImageRaw.replace(/^\//, '')}`
      : profileImageRaw;
    
    const response = {
      _id: candidate._id,
      firstName: candidate.firstName || '',
      lastName: candidate.lastName || '',
      email: candidate.email,
      profileImage: profileImage || '',
      role: candidate.role,
      designation: candidate.designation || '',
      category: candidate.category || '',
      about: candidate.about || '',
      location: candidate.location || '',
      phone: candidate.phone || '',
      education: candidate.education || [],
      experience: candidate.experience || [],
      skills: candidate.skills || [],
      languages: candidate.languages || [],
      projects: candidate.projects || [],
      social: {
        facebook: candidate.social?.facebook || '',
        linkedin: candidate.social?.linkedin || '',
        whatsapp: candidate.social?.whatsapp || '',
        phoneCall: candidate.social?.phoneCall || ''
      },
      bookmarks: candidate.bookmarks || [],
      resume: candidate.resume || { fileName: '', fileUrl: '', fileSize: '' }
    };

    const profileCompletion = calculateCandidateProfileCompletion(candidate || {});
    
    console.log(`[${requestId}] Profile updated successfully`);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { ...response, profileCompletion }
    });
  } catch (error) {
    console.error(`[${requestId}] Update profile error:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Change candidate password
 * @route   PUT /api/candidates/change-password
 * @access  Private (Candidate)
 */
exports.changePassword = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] PUT /api/candidates/change-password - User: ${req.candidate._id}`);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all password fields'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Fetch Candidate with password
    const candidate = await Candidate.findById(req.candidate._id).select('+password');
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const isMatch = await candidate.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    candidate.password = newPassword;
    await candidate.save();

    console.log(`[${requestId}] Password changed successfully`);
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.log(`[${requestId}] Change password error:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get candidate bookmarks
 * @route   GET /api/candidates/bookmarks
 * @access  Private (Candidate)
 */
exports.getBookmarks = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] GET /api/candidates/bookmarks - Candidate: ${req.candidate._id}`);
    
    const Company = require('../models/Company');
    
    // Fetch candidate with bookmarks
    const candidate = await Candidate.findById(req.candidate._id)
      .populate({
        path: 'bookmarks',
        populate: {
          path: 'company',
          select: 'username email profilePicture companyName logo'
        }
      });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
    }

    // Filter out null bookmarks (deleted jobs)
    const validBookmarks = (candidate.bookmarks || []).filter(job => job !== null);
    
    // ✅ Format bookmarks with proper company data
    const formattedBookmarks = await Promise.all(validBookmarks.map(async (job) => {
      let companyName = 'N/A';
      let companyLogo = null;

      // job.company may be populated or a reference to Company._id
      if (job.company) {
        try {
          // If company is populated object, use its fields; otherwise fetch it.
          if (typeof job.company === 'object' && job.company.companyName) {
            companyName = job.company.companyName;
            companyLogo = job.company.logo || null;
          } else {
            const companyDoc = await Company.findById(job.company).select('companyName logo');
            if (companyDoc) {
              companyName = companyDoc.companyName;
              companyLogo = companyDoc.logo;
            }
          }
        } catch (err) {
          console.warn(`[${requestId}] Company lookup failed for job ${job._id}:`, err.message);
        }
      }

      return {
        ...job.toObject(),
        companyName,
        companyLogo
      };
    }));
    
    console.log(`[${requestId}] Retrieved ${formattedBookmarks.length} bookmarks`);

    res.status(200).json({
      success: true,
      data: formattedBookmarks
    });
  } catch (error) {
    console.error(`[${requestId}] Get bookmarks error:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Add job to bookmarks
 * @route   POST /api/candidates/bookmarks/:jobId
 * @access  Private (Candidate)
 */
exports.addBookmark = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] POST /api/candidates/bookmarks/${req.params.jobId} - User: ${req.candidate._id}`);
    
    const Candidate = require('../models/Candidate');
    const Job = require('../models/Job');
    const { jobId } = req.params;

    // Validate jobId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already bookmarked on Candidate profile
    const candidate = await Candidate.findById(req.candidate._id);
    
    const isAlreadyBookmarked = candidate && (candidate.bookmarks || []).some(id => id.toString() === jobId);

    if (isAlreadyBookmarked) {
      return res.status(200).json({
        success: true,
        message: 'Job already bookmarked',
        isBookmarked: true
      });
    }

    // Add to bookmarks on Candidate profile using $addToSet to prevent duplicates
    await Candidate.findByIdAndUpdate(
      req.candidate._id,
      { $addToSet: { bookmarks: jobId } },
      { new: true }
    );

    console.log(`[${requestId}] Bookmark added successfully`);
    res.status(200).json({
      success: true,
      message: 'Job bookmarked successfully',
      isBookmarked: true
    });
  } catch (error) {
    console.error(`[${requestId}] Add bookmark error:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Remove job from bookmarks
 * @route   DELETE /api/candidates/bookmarks/:jobId
 * @access  Private (Candidate)
 */
exports.removeBookmark = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] DELETE /api/candidates/bookmarks/${req.params.jobId} - User: ${req.candidate._id}`);
    
    const Candidate = require('../models/Candidate');
    const { jobId } = req.params;

    // Validate jobId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // Remove from bookmarks on Candidate profile using $pull (atomic operation)
    await Candidate.findByIdAndUpdate(
      req.candidate._id,
      { $pull: { bookmarks: jobId } },
      { new: true }
    );

    console.log(`[${requestId}] Bookmark removed successfully`);
    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully',
      isBookmarked: false
    });
  } catch (error) {
    console.error(`[${requestId}] Remove bookmark error:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get candidate's applied jobs
 * @route   GET /api/candidates/applied-jobs
 * @access  Private (Candidate)
 */
exports.getAppliedJobs = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] GET /api/candidates/applied-jobs - User: ${req.candidate._id}`);
    const Application = require('../models/Application');

    const applications = await Application.find({ candidateId: req.candidate._id })
      .populate({
        path: 'jobId',
        select: 'title company location salaryRange employmentType description createdAt',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort({ appliedAt: -1 });

    // ✅ Filter out applications where job was deleted
    const validApplications = applications.filter(app => app.jobId !== null);
    const filteredOut = applications.length - validApplications.length;
    if (filteredOut > 0) {
      console.warn(`[${requestId}] Filtered out ${filteredOut} applications because jobId was null`);
    }
    console.log(`[${requestId}] Retrieved ${validApplications.length} applications`);

    // Normalize to consistent response shape so frontend can rely on same fields
    const formatted = validApplications.map(app => ({
      _id: app._id,
      id: app._id,
      jobId: app.jobId?._id ? String(app.jobId._id) : null,
      jobTitle: app.jobId?.title || 'N/A',
      company: app.jobId?.company?.name || (app.jobId?.company ? String(app.jobId.company) : 'N/A'),
      companyLogo: app.jobId?.company?.logo || null,
      location: app.jobId?.location || '',
      salary: app.jobId?.salaryRange || '',
      type: app.jobId?.employmentType || '',
      status: app.status || 'pending',
      appliedAt: app.appliedAt
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error(`[${requestId}] Get applied jobs error:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Upload/Update profile image
 * @route   POST /api/candidates/me/profile-image
 * @access  Private (Candidate)
 */
exports.uploadProfileImage = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] POST /api/candidates/me/profile-image - User: ${req.candidate._id}`);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { processUploadedImage, deleteOldImage } = require('../middlewares/imageResize');

    // Get current candidate to check for old image
    const currentCandidate = await Candidate.findById(req.candidate._id);
    const oldProfileImage = currentCandidate.profileImage;

    // Process image with Sharp (resize to 200x200, optimize)
    const processedImagePath = await processUploadedImage(req.file, 'profile');
    
    // Delete old image if exists
    if (oldProfileImage) {
      await deleteOldImage(oldProfileImage);
    }

    // Update candidate with new profile picture path
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.candidate._id,
      { profileImage: processedImagePath },
      { new: true }
    ).select('-password');

    if (!updatedCandidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Normalize profileImage URL
    const profileImageRaw = updatedCandidate.profileImage || '';
    const profileImage = profileImageRaw && !profileImageRaw.startsWith('http') 
      ? `${req.protocol}://${req.get('host')}/${profileImageRaw.replace(/^\//, '')}`
      : profileImageRaw;

    console.log(`[${requestId}] Profile image uploaded successfully`);
    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: profileImage
      }
    });
  } catch (error) {
    console.error(`[${requestId}] Upload profile image error:`, error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload profile image'
    });
  }
};

/**
 * @desc    Upload/Update resume
 * @route   POST /api/candidates/me/resume
 * @access  Private (Candidate)
 */
exports.uploadResume = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] POST /api/candidates/me/resume - User: ${req.candidate._id}`);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided'
      });
    }

    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      const fs = require('fs').promises;
      await fs.unlink(req.file.path); // Delete uploaded file
      return res.status(400).json({
        success: false,
        message: 'Only PDF, DOC, and DOCX files are allowed for resume'
      });
    }

    const fs = require('fs').promises;
    const path = require('path');

    // Get current candidate to check for old resume
    const currentCandidate = await Candidate.findById(req.candidate._id);
    const oldResumeUrl = currentCandidate.resume?.fileUrl;

    // Delete old resume if exists
    if (oldResumeUrl) {
      try {
        const relativePath = oldResumeUrl.startsWith('/') ? oldResumeUrl.substring(1) : oldResumeUrl;
        const fullPath = path.join(process.cwd(), relativePath);
        await fs.unlink(fullPath);
        console.log(`[${requestId}] Old resume deleted`);
      } catch (error) {
        console.warn(`[${requestId}] Failed to delete old resume:`, error.message);
      }
    }

    // Generate resume URL
    const resumeUrl = `/${req.file.path.replace(/\\\\/g, '/')}`;
    const fileSizeInKB = Math.round(req.file.size / 1024);
    const fileSize = fileSizeInKB > 1024 
      ? `${(fileSizeInKB / 1024).toFixed(2)} MB` 
      : `${fileSizeInKB} KB`;

    // Update candidate with resume info
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.candidate._id,
      {
        resume: {
          fileName: req.file.originalname,
          fileUrl: resumeUrl,
          fileSize: fileSize
        }
      },
      { new: true }
    ).select('-password');

    if (!updatedCandidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    console.log(`[${requestId}] Resume uploaded successfully`);
    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resume: updatedCandidate.resume
      }
    });
  } catch (error) {
    console.error(`[${requestId}] Upload resume error:`, error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload resume'
    });
  }
};

/**
 * @desc    Get candidate by ID (For recruiters to view candidate details)
 * @route   GET /api/candidates/:id
 * @access  Private (Recruiter) - Can only view candidates who applied to their jobs
 */
exports.getCandidateById = async (req, res) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] GET /api/candidates/${req.params.id} - Requester: ${req.user._id}`);
    
    const { id } = req.params;
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    // ✅ SECURITY CHECK: Verify that the candidate applied to one of the recruiter's jobs
    const Application = require('../models/Application');
    const Job = require('../models/Job');
    
    // Find applications from this candidate to jobs owned by the current user
    const application = await Application.findOne({
      candidateId: id
    }).populate('jobId');
    
    if (!application || !application.jobId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view candidates who applied to your jobs.'
      });
    }
    
    // Verify the job belongs to the requesting user
    if (application.jobId.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view candidates who applied to your jobs.'
      });
    }
    
    // Fetch candidate data
    const candidate = await Candidate.findById(id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    // Format response from Candidate model
    const profileImageRaw = candidate.profileImage || '';
    const profileImage = profileImageRaw && !profileImageRaw.startsWith('http') 
      ? `${req.protocol}://${req.get('host')}/${profileImageRaw.replace(/^\//, '')}`
      : profileImageRaw;
    
    const candidateData = {
      _id: candidate._id,
      name: `${candidate.firstName} ${candidate.lastName}`,
      email: candidate.email,
      designation: candidate.designation || '',
      profileImage: profileImage || '',
      category: candidate.category || '',
      about: candidate.about || '',
      location: candidate.location || '',
      phone: candidate.phone || '',
      education: candidate.education || [],
      experience: candidate.experience || [],
      skills: candidate.skills || [],
      languages: candidate.languages || [],
      projects: candidate.projects || [],
      social: candidate.social || {},
      resume: candidate.resume || null
    };
    
    console.log(`[${requestId}] Candidate details retrieved successfully`);
    
    res.status(200).json({
      success: true,
      data: candidateData
    });
  } catch (error) {
    console.error(`[${requestId}] Get candidate error:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

