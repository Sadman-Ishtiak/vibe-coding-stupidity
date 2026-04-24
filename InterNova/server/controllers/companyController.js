const Company = require('../models/Company');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { deleteOldImage } = require('../middlewares/imageResize');
const { calculateCompanyProfileCompletion } = require('../utils/profileCompletion');

/**
 * Normalize image URLs to be consistent
 * @param {string} imagePath - Image path from database
 * @returns {string|null} - Normalized URL or null if no image
 */
const normalizeImageUrl = (imagePath) => {
  if (!imagePath || imagePath === '') return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Remove leading slash if exists
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `/${cleanPath}`;
};

/**
 * Get authenticated company/recruiter profile
 * @route GET /api/company/me
 * @access Private - Recruiter only
 */
exports.getMyProfile = async (req, res, next) => {
  try {
    console.log('📊 Get My Profile - User ID:', req.user._id, 'Type:', req.user.userType || 'legacy');
    
    // ✅ Support BOTH old hybrid model (User + Company) AND new standalone Company model
    
    // Check if this is a new Company-based auth (userType='company')
    if (req.user.userType === 'company') {
      // NEW: req.user is already the Company document
      const company = req.user;
      
      console.log('✅ Profile loaded (New Company Model) - Company:', company.email);
      
      // Calculate profile completion for new Company model
      const profileCompletion = calculateCompanyProfileCompletion(company || {});

      return res.json({
        success: true,
        data: {
          id: company._id,
          companyName: company.companyName,
          ownerName: company.ownerName,
          email: company.email,
          role: company.role,
          phone: company.phone || '',
          companyLocation: company.companyLocation || '',
          companyDescription: company.companyDescription || '',
          companyWebsite: company.companyWebsite || '',
          logo: normalizeImageUrl(company.logo),
          employees: company.employees || '',
          establishedDate: company.establishedDate,
          workingSchedule: company.workingSchedule,
          socialLinks: {
            facebook: company.socialLinks?.facebook || '',
            linkedin: company.socialLinks?.linkedin || '',
            whatsapp: company.socialLinks?.whatsapp || ''
          },
          gallery: company.gallery ? company.gallery.map(img => normalizeImageUrl(img)) : [],
          twoStepVerification: company.twoStepVerification,
          isActive: company.isActive,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt,
          profileCompletion
        }
      });
    }
    
    // LEGACY: Old hybrid model (User with role='recruiter' + optional Company profile)
    // req.user is from User model
    const user = await User.findById(req.user._id)
      .select('-password -refreshToken -resetPasswordToken');

    if (!user) {
      console.error('❌ User not found:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find associated company profile if exists
    const company = await Company.findOne({ owner: user._id });
    
    console.log('✅ Profile loaded (Legacy Model) - User:', user.email, 'Company:', company?.companyName || 'None');

    // Return user profile with optional company data (legacy format)
    // Determine profile completion for legacy model
    let profileCompletion = 0;
    if (company) {
      profileCompletion = calculateCompanyProfileCompletion(company || {});
    } else {
      // Try to compute from user object as fallback
      profileCompletion = calculateCompanyProfileCompletion(user || {});
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePicture: normalizeImageUrl(user.profilePicture),
          phone: user.phone || '',
          location: user.location || '',
          about: user.about || ''
        },
        company: company ? {
          id: company._id,
          companyName: company.companyName,
          description: company.companyDescription,
          logo: normalizeImageUrl(company.logo),
          website: company.companyWebsite,
          location: company.companyLocation,
          employees: company.employees,
          establishedDate: company.establishedDate,
          workingDays: company.workingDays,
          weekend: company.weekend,
          facebook: company.socialLinks?.facebook || '',
          linkedin: company.socialLinks?.linkedin || '',
          whatsapp: company.socialLinks?.whatsapp || '',
          gallery: company.gallery ? company.gallery.map(img => normalizeImageUrl(img)) : [],
          createdAt: company.createdAt
        } : null,
        profileCompletion
      }
    });
  } catch (err) {
    console.error('❌ Get my profile error:', err);
    next(err);
  }
};

/**
 * Update company/recruiter profile
 * @route PATCH /api/company/me
 * @access Private - Recruiter only
 */
exports.updateMyProfile = async (req, res, next) => {
  try {
    console.log('📝 Update My Profile - User ID:', req.user._id, 'Type:', req.user.userType || 'legacy');
    console.log('📋 Request body:', Object.keys(req.body));
    console.log('📁 Files:', req.files ? Object.keys(req.files) : 'None');
    
    const {
      username,
      phone,
      location,
      about,
      companyName,
      companyDescription,
      companyWebsite,
      companyLocation,
      employees,
      establishedDate,
      workingSchedule,
      facebook,
      linkedin,
      whatsapp,
      ownerName
    } = req.body;
    // ✅ Parse workingSchedule if it's a JSON string (from FormData)
    let parsedWorkingSchedule = workingSchedule;
    if (typeof workingSchedule === 'string') {
      try {
        parsedWorkingSchedule = JSON.parse(workingSchedule);
      } catch (e) {
        console.error('Failed to parse workingSchedule:', e);
        parsedWorkingSchedule = undefined;
      }
    }


    // ✅ Support BOTH old hybrid model AND new standalone Company model
    
    if (req.user.userType === 'company') {
      // NEW: Update Company document directly
      const companyId = req.user._id;
      
      const companyUpdates = {};
      if (companyName !== undefined) companyUpdates.companyName = companyName;
      if (ownerName !== undefined) companyUpdates.ownerName = ownerName;
      if (phone !== undefined) companyUpdates.phone = phone;
      if (companyLocation !== undefined) companyUpdates.companyLocation = companyLocation;
      if (companyDescription !== undefined) companyUpdates.companyDescription = companyDescription;
      if (companyWebsite !== undefined) companyUpdates.companyWebsite = companyWebsite;
      if (employees !== undefined) companyUpdates.employees = employees;
      if (establishedDate !== undefined) companyUpdates.establishedDate = establishedDate;
      if (parsedWorkingSchedule !== undefined) companyUpdates.workingSchedule = parsedWorkingSchedule;
      
      // Handle social links (nested structure) - merge with existing values
      if (facebook !== undefined || linkedin !== undefined || whatsapp !== undefined) {
        const existingCompany = await Company.findById(companyId);
        companyUpdates.socialLinks = {
          facebook: facebook !== undefined ? facebook : (existingCompany?.socialLinks?.facebook || ''),
          linkedin: linkedin !== undefined ? linkedin : (existingCompany?.socialLinks?.linkedin || ''),
          whatsapp: whatsapp !== undefined ? whatsapp : (existingCompany?.socialLinks?.whatsapp || '')
        };
      }

      // Handle logo upload
      const logoFile = req.files?.profilePicture?.[0];
      if (logoFile) {
        const oldCompany = await Company.findById(companyId);
        if (oldCompany?.logo) {
          await deleteOldImage(oldCompany.logo);
        }
        // Use processedPath from middleware (set by imageResize middleware)
        if (logoFile.processedPath) {
          companyUpdates.logo = logoFile.processedPath;
          console.log('✅ Logo will be updated to:', logoFile.processedPath);
        } else {
          console.error('❌ No processed path found for logo upload');
        }
      }

      // Handle gallery images
      const galleryFiles = req.files?.galleryImages;
      if (galleryFiles && galleryFiles.length > 0) {
        const oldCompany = await Company.findById(companyId);
        if (oldCompany?.gallery?.length > 0) {
          for (const oldGalleryImage of oldCompany.gallery) {
            await deleteOldImage(oldGalleryImage);
          }
        }
        const galleryUrls = req.processedPaths?.galleryImages || 
          galleryFiles.map(file => file.processedPath || `/uploads/gallery/${file.filename}`);
        companyUpdates.gallery = galleryUrls;
      }

      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        companyUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      console.log('✅ Profile updated successfully (New Company Model)');

      // Calculate profile completion for updated company
      const profileCompletion = calculateCompanyProfileCompletion(updatedCompany || {});

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedCompany._id,
          companyName: updatedCompany.companyName,
          ownerName: updatedCompany.ownerName,
          email: updatedCompany.email,
          role: updatedCompany.role,
          phone: updatedCompany.phone,
          companyLocation: updatedCompany.companyLocation,
          companyDescription: updatedCompany.companyDescription,
          companyWebsite: updatedCompany.companyWebsite,
          logo: normalizeImageUrl(updatedCompany.logo),
          employees: updatedCompany.employees,
          establishedDate: updatedCompany.establishedDate,
          workingSchedule: updatedCompany.workingSchedule,
          socialLinks: updatedCompany.socialLinks,
          gallery: updatedCompany.gallery ? updatedCompany.gallery.map(img => normalizeImageUrl(img)) : [],
            profileCompletion
        }
      });
    }
    
    // LEGACY: Old hybrid model (User + Company)
    const userId = req.user._id;

    // ✅ SECURITY: Prevent updating email and password through this endpoint
    const userUpdates = {};
    if (username) userUpdates.username = username;
    if (phone !== undefined) userUpdates.phone = phone;
    if (location !== undefined) userUpdates.location = location;
    if (about !== undefined) userUpdates.about = about;

    // Handle profile picture upload
    const profilePictureFile = req.files?.profilePicture?.[0];
    let profilePicturePath = null;
    if (profilePictureFile) {
      const oldUser = await User.findById(userId);
      if (oldUser?.profilePicture) {
        await deleteOldImage(oldUser.profilePicture);
      }
      // Use processedPath from middleware (set by imageResize middleware)
      profilePicturePath = profilePictureFile.processedPath;
      if (profilePicturePath) {
        userUpdates.profilePicture = profilePicturePath;
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      userUpdates,
      { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken');

    // Update or create company profile
    let company = await Company.findOne({ owner: userId });
    
    // Build company updates object
    const companyUpdates = {};
    if (companyName) companyUpdates.companyName = companyName;
    if (companyDescription !== undefined) companyUpdates.companyDescription = companyDescription;
    if (companyWebsite !== undefined) companyUpdates.companyWebsite = companyWebsite;
    if (companyLocation !== undefined) companyUpdates.companyLocation = companyLocation;
    if (employees !== undefined) companyUpdates.employees = employees;
    if (establishedDate !== undefined) companyUpdates.establishedDate = establishedDate;
    if (parsedWorkingSchedule !== undefined) companyUpdates.workingSchedule = parsedWorkingSchedule;
    
    // Handle social links - merge with existing values
    if (facebook !== undefined || linkedin !== undefined || whatsapp !== undefined) {
      companyUpdates.socialLinks = {
        facebook: facebook !== undefined ? facebook : (company?.socialLinks?.facebook || ''),
        linkedin: linkedin !== undefined ? linkedin : (company?.socialLinks?.linkedin || ''),
        whatsapp: whatsapp !== undefined ? whatsapp : (company?.socialLinks?.whatsapp || '')
      };
    }

    // Handle gallery images
    const galleryFiles = req.files?.galleryImages;
    if (galleryFiles && galleryFiles.length > 0) {
      if (company?.gallery?.length > 0) {
        for (const oldGalleryImage of company.gallery) {
          await deleteOldImage(oldGalleryImage);
        }
      }
      // Use processedPaths from middleware or individual file processedPath
      const galleryUrls = req.processedPaths?.galleryImages || 
        galleryFiles.map(file => file.processedPath).filter(Boolean);
      companyUpdates.gallery = galleryUrls;
    }

    // If profile picture uploaded, use as company logo
    if (profilePicturePath) {
      if (company?.logo) {
        await deleteOldImage(company.logo);
      }
      companyUpdates.logo = profilePicturePath;
    }

    if (Object.keys(companyUpdates).length > 0) {
      if (company) {
        company = await Company.findByIdAndUpdate(
          company._id,
          companyUpdates,
          { new: true, runValidators: true }
        );
      } else if (companyName) {
        company = await Company.create({
          ...companyUpdates,
          owner: userId
        });
      }
    }

    console.log('✅ Profile updated successfully (Legacy Model)');

    // Compute profile completion for legacy model
    let profileCompletion = 0;
    if (company) {
      profileCompletion = calculateCompanyProfileCompletion(company || {});
    } else {
      profileCompletion = calculateCompanyProfileCompletion(updatedUser || {});
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          profilePicture: normalizeImageUrl(updatedUser.profilePicture),
          phone: updatedUser.phone,
          location: updatedUser.location,
          about: updatedUser.about
        },
        company: company ? {
          id: company._id,
          companyName: company.companyName,
          description: company.companyDescription,
          logo: normalizeImageUrl(company.logo),
          website: company.companyWebsite,
          location: company.companyLocation,
          employees: company.employees,
          establishedDate: company.establishedDate,
          workingDays: company.workingDays,
          weekend: company.weekend,
          facebook: company.socialLinks?.facebook || '',
          linkedin: company.socialLinks?.linkedin || '',
          whatsapp: company.socialLinks?.whatsapp || '',
          gallery: company.gallery ? company.gallery.map(img => normalizeImageUrl(img)) : []
        } : null,
        profileCompletion
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    
    // Clean up uploaded files on error
    if (req.files) {
      const allFiles = [
        ...(req.files.profilePicture || []),
        ...(req.files.galleryImages || [])
      ];
      allFiles.forEach(file => {
        if (file.path && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Failed to delete uploaded file:', unlinkError);
          }
        }
      });
    }
    
    next(err);
  }
};

/**
 * Change password
 * @route PATCH /api/company/change-password
 * @access Private - Recruiter only
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }

    // Get company with password field
    const company = await Company.findById(req.user._id).select('+password');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Verify current password
    const isMatch = await company.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be hashed by pre-save hook)
    company.password = newPassword;
    await company.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('Change password error:', err);
    next(err);
  }
};

// ========== Public Company Routes ==========

/**
 * Get all companies (public, paginated, sortable)
 * @route GET /api/companies
 * @access Public
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 12)
 * @query sortBy - Sort field: companyName, createdAt (default: createdAt)
 * @query order - Sort order: asc, desc (default: desc)
 */
exports.getCompanies = async (req, res, next) => {
  try {
    // Parse query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    
    const sortOptions = {};
    if (sortBy === 'companyName') {
      sortOptions.companyName = order;
    } else if (sortBy === 'createdAt') {
      sortOptions.createdAt = order;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    // Get total count for pagination
    const total = await Company.countDocuments();
    
    // Fetch companies with pagination and sorting
    const companies = await Company.find()
      .select('companyName companyDescription logo companyLocation employees establishedDate createdAt')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get job count for each company
    const Job = require('../models/Job');
    const companiesWithJobCount = await Promise.all(
      companies.map(async (company) => {
        const openJobsCount = await Job.countDocuments({
          company: company._id, // Job.company now references Company directly
          status: 'active'
        });
        
        return {
          _id: company._id,
          companyName: company.companyName,
          description: company.companyDescription,
          logo: normalizeImageUrl(company.logo),
          location: company.companyLocation,
          employees: company.employees,
          establishedDate: company.establishedDate,
          openJobsCount,
          createdAt: company.createdAt
        };
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: companiesWithJobCount,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error('❌ Get companies error:', err);
    next(err);
  }
};

/**
 * Get company by ID (public)
 * @route GET /api/companies/:id
 * @access Public
 */
exports.getCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }

    const company = await Company.findById(id)
      .select('-__v -password')
      .lean();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get job count
    const Job = require('../models/Job');
    const openJobsCount = await Job.countDocuments({
      company: company._id, // Job.company now references Company directly
      status: 'active'
    });

    // Normalize response with new field names
    const normalizedCompany = {
      _id: company._id,
      companyName: company.companyName,
      description: company.companyDescription,
      logo: normalizeImageUrl(company.logo),
      website: company.companyWebsite,
      location: company.companyLocation,
      employees: company.employees,
      establishedDate: company.establishedDate,
      workingSchedule: company.workingSchedule,
      facebook: company.socialLinks?.facebook || '',
      linkedin: company.socialLinks?.linkedin || '',
      whatsapp: company.socialLinks?.whatsapp || '',
      gallery: company.gallery ? company.gallery.map(img => normalizeImageUrl(img)) : [],
      openJobsCount,
      email: company.email,
      phone: company.phone,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt
    };

    res.json({
      success: true,
      data: normalizedCompany
    });
  } catch (err) {
    console.error('❌ Get company error:', err);
    next(err);
  }
};

/**
 * Get jobs by company ID (public)
 * @route GET /api/companies/:id/jobs
 * @access Public
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 10)
 */
exports.getCompanyJobs = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }

    // Verify company exists
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Parse pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const Job = require('../models/Job');
    
    // Get total count of active jobs for this company
    const total = await Job.countDocuments({
      company: company._id, // Job.company now references Company directly
      status: 'active'
    });

    // Fetch active jobs only
    const jobs = await Job.find({
      company: company._id, // Job.company now references Company directly
      status: 'active'
    })
      .select('-__v')
      .populate('company', 'companyName email logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error('❌ Get company jobs error:', err);
    next(err);
  }
};

/**
 * Create company (legacy - deprecated, use /auth/company/register instead)
 * @route POST /api/companies
 * @access Private - Recruiter only
 */
exports.createCompany = async (req, res, next) => {
  try {
    return res.status(410).json({
      success: false,
      message: 'This endpoint is deprecated. Please use POST /api/auth/company/register to create a company account.'
    });
  } catch (err) {
    next(err);
  }
};
