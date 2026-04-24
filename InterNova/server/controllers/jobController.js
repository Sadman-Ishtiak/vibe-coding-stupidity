const Job = require('../models/Job');
const { validationResult } = require('express-validator');

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
 * Create a new job
 * @route POST /api/jobs
 * @access Private - Recruiter only
 */
exports.createJob = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // ✅ SECURITY: Get company ID from authenticated user (NOT from request body)
    const jobData = {
      ...req.body,
      company: req.user._id // Force company to be the authenticated user
    };

    // Remove company from body if someone tried to send it
    delete req.body.company;

    const job = await Job.create(jobData);

    // Populate company details for response
    await job.populate({
      path: 'company',
      select: 'companyName logo companyLocation phone companyWebsite establishedDate createdAt'
    });

    // Normalize logo URL in response
    const jobResponse = job.toObject();
    if (jobResponse.company && jobResponse.company.logo) {
      jobResponse.company.logo = normalizeImageUrl(jobResponse.company.logo);
    }

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: jobResponse
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all jobs with optional filters
 * @route GET /api/jobs
 * @access Public
 */
exports.getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      category,
      experience,
      jobType,
      datePosted,
      status,
      page = 1,
      limit = 10
    } = req.query;

    // Build robust MongoDB query with $and
    const conditions = [];

    // ✅ Status filter (default: active for public routes)
    if (status) {
      conditions.push({ status });
    } else {
      // Default: show only active jobs for public view
      conditions.push({ status: 'active' });
    }

    // ✅ Keyword search (title + company name via populated field)
    if (keyword) {
      const keywordRegex = new RegExp(keyword.trim(), 'i');
      conditions.push({
        $or: [
          { title: keywordRegex },
          { description: keywordRegex }
        ]
      });
    }

    // ✅ Location filter (district) - case-insensitive exact match
    if (location && location !== 'all') {
      conditions.push({ location: new RegExp(`^${location.trim()}$`, 'i') });
    }

    // ✅ Category filter - case-insensitive match
    if (category && category !== 'all') {
      conditions.push({ category: new RegExp(`^${category.trim()}$`, 'i') });
    }

    // ✅ Experience filter - flexible regex matching to handle varied DB formats
    if (experience) {
      // Matches values like "No Experience", numeric strings like "0-1 years", "2+ years", etc.
      let expCondition;
      switch (experience) {
        case 'no-experience':
          // Match explicit "no experience" text OR numeric 0 in various formats
          expCondition = {
            $or: [
              { experience: new RegExp('no\\s*-?\\s*experience', 'i') },
              { experience: new RegExp('(?:^|\\D)0(?:\\D|$)') }
            ]
          };
          break;
        case '0-3':
          // Treat 0 as 1 for this bucket: match numbers 1,2,3 (handles formats like "0-1", "1 year")
          expCondition = { experience: new RegExp('(?:^|\\D)(?:1|2|3)(?:\\D|$)') };
          break;
        case '3-6':
          expCondition = { experience: new RegExp('(?:^|\\D)(?:3|4|5|6)(?:\\D|$)') };
          break;
        case '6+':
          // match numbers 6 and above (6,7,8,9,10,11...)
          expCondition = { experience: new RegExp('(?:^|\\D)(?:[6-9]|[1-9]\\\d+)(?:\\D|$)') };
          break;
        default:
          expCondition = { experience: new RegExp(String(experience), 'i') };
      }
      conditions.push(expCondition);
    }

    // ✅ Job Type filter (employment type)
    if (jobType) {
      // Normalize job type values
      const jobTypeMap = {
        'Freelancer': 'Freelancer',
        'full-time': 'Full Time',
        'part-time': 'Part Time',
        'internship': 'Internship'
      };
      const mappedJobType = jobTypeMap[jobType.toLowerCase()] || jobType;
      conditions.push({ employmentType: mappedJobType });
    }

    // ✅ Date Posted filter (time-based)
    if (datePosted) {
      const now = new Date();
      let dateThreshold;

      switch (datePosted) {
        case '1h':
          dateThreshold = new Date(now - 60 * 60 * 1000); // 1 hour ago
          break;
        case '24h':
          dateThreshold = new Date(now - 24 * 60 * 60 * 1000); // 24 hours ago
          break;
        case '7d':
          dateThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000); // 7 days ago
          break;
        case '14d':
          dateThreshold = new Date(now - 14 * 24 * 60 * 60 * 1000); // 14 days ago
          break;
        case '30d':
          dateThreshold = new Date(now - 30 * 24 * 60 * 60 * 1000); // 30 days ago
          break;
        default:
          dateThreshold = null;
      }

      if (dateThreshold) {
        conditions.push({ createdAt: { $gte: dateThreshold } });
      }
    }

    // Combine all conditions with $and
    const query = conditions.length > 0 ? { $and: conditions } : {};

    // Pagination parameters
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit))); // Cap at 100
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination and sorting
    const [jobs, count] = await Promise.all([
      Job.find(query)
        .populate({
          path: 'company',
          select: 'companyName logo companyLocation phone companyWebsite establishedDate createdAt userId',
          populate: {
            path: 'userId',
            select: 'email'
          }
        })
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip(skip)
        .lean(),
      Job.countDocuments(query)
    ]);

    // Normalize company logo URLs in all jobs
    const normalizedJobs = jobs.map(job => {
      if (job.company && job.company.logo) {
        return {
          ...job,
          company: {
            ...job.company,
            logo: normalizeImageUrl(job.company.logo)
          }
        };
      }
      return job;
    });

    // Add isBookmarked field if user is authenticated
    let jobsWithBookmarkStatus = normalizedJobs;
    if (req.user && req.user._id) {
      // Only candidates have bookmarks; fetch Candidate profile for bookmark list
      let userBookmarks = [];
      if (req.user.role === 'candidate') {
        const Candidate = require('../models/Candidate');
        const candidateDoc = await Candidate.findById(req.user._id).select('bookmarks');
        userBookmarks = candidateDoc?.bookmarks || [];
      }

      jobsWithBookmarkStatus = jobs.map(job => ({
        ...job,
        isBookmarked: userBookmarks.some(bookmarkId => bookmarkId.toString() === job._id.toString())
      }));
    } else {
      // For unauthenticated users, set isBookmarked to false
      jobsWithBookmarkStatus = jobs.map(job => ({
        ...job,
        isBookmarked: false
      }));
    }

    res.json({
      success: true,
      data: jobsWithBookmarkStatus,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single job by ID
 * @route GET /api/jobs/:id
 * @access Public
 */
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'company',
        select: 'companyName logo phone companyLocation companyWebsite socialLinks establishedDate createdAt userId',
        populate: {
          path: 'userId',
          select: 'email'
        }
      })
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Debug: Log populated company data
    console.log('🏢 Job Company Data:', {
      companyId: job.company?._id,
      companyName: job.company?.companyName,
      logo: job.company?.logo,
      establishedDate: job.company?.establishedDate
    });

    // Normalize company logo URL
    if (job.company && job.company.logo) {
      job.company.logo = normalizeImageUrl(job.company.logo);
    }

    // Add isBookmarked field if user is authenticated
    let jobWithBookmarkStatus = job;
    if (req.user && req.user._id) {
      let userBookmarks = [];
      if (req.user.role === 'candidate') {
        const Candidate = require('../models/Candidate');
        const candidateDoc = await Candidate.findById(req.user._id).select('bookmarks');
        userBookmarks = candidateDoc?.bookmarks || [];
      }

      jobWithBookmarkStatus = {
        ...job,
        isBookmarked: userBookmarks.some(bookmarkId => bookmarkId.toString() === job._id.toString())
      };
    } else {
      jobWithBookmarkStatus = {
        ...job,
        isBookmarked: false
      };
    }

    res.json({
      success: true,
      data: jobWithBookmarkStatus
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update job
 * @route PUT /api/jobs/:id
 * @access Private - Recruiter only (owner of job)
 */
exports.updateJob = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Find the job
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // ✅ SECURITY: Verify ownership - only job owner can update
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own jobs.'
      });
    }

    // ✅ SECURITY: Prevent changing company field
    delete req.body.company;

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('company', 'companyName logo companyLocation phone companyWebsite');

    // Normalize company logo URL
    const jobResponse = updatedJob.toObject();
    if (jobResponse.company && jobResponse.company.logo) {
      jobResponse.company.logo = normalizeImageUrl(jobResponse.company.logo);
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: jobResponse
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete job
 * @route DELETE /api/jobs/:id
 * @access Private - Recruiter only (owner of job)
 */
exports.deleteJob = async (req, res, next) => {
  try {
    // Find the job
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // ✅ SECURITY: Verify ownership - only job owner can delete
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own jobs.'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get jobs posted by the authenticated recruiter
 * @route GET /api/jobs/my-jobs
 * @access Private - Recruiter only
 */
exports.getMyJobs = async (req, res, next) => {
  try {
    const Application = require('../models/Application');
    
    const jobs = await Job.find({ company: req.user._id })
      .populate('company', 'companyName logo companyLocation phone companyWebsite')
      .sort({ createdAt: -1 });

    // Get application counts for each job and normalize logo URLs
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ jobId: job._id });
        const jobObj = job.toObject();
        
        // Normalize company logo URL
        if (jobObj.company && jobObj.company.logo) {
          jobObj.company.logo = normalizeImageUrl(jobObj.company.logo);
        }
        
        return {
          ...jobObj,
          applicationCount
        };
      })
    );

    res.json({
      success: true,
      data: jobsWithCounts,
      meta: {
        total: jobsWithCounts.length
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update job status (active/paused/closed)
 * @route PATCH /api/jobs/:id/status
 * @access Private - Recruiter only (owner of job)
 */
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['active', 'paused', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: active, paused, or closed'
      });
    }

    // Find the job
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // ✅ SECURITY: Verify ownership
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own jobs.'
      });
    }

    // Update status
    job.status = status;
    await job.save();

    res.json({
      success: true,
      message: `Job ${status} successfully`,
      data: job
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get stats for recruiter dashboard
 * @route GET /api/jobs/stats
 * @access Private - Recruiter only
 */
exports.getMyJobStats = async (req, res, next) => {
  try {
    const Application = require('../models/Application');
    
    const userId = req.user._id;

    // Get all jobs count
    const totalJobs = await Job.countDocuments({ company: userId });
    
    // Get active jobs count
    const activeJobs = await Job.countDocuments({ company: userId, status: 'active' });
    
    // Get paused jobs count
    const pausedJobs = await Job.countDocuments({ company: userId, status: 'paused' });
    
    // Get closed jobs count
    const closedJobs = await Job.countDocuments({ company: userId, status: 'closed' });
    
    // Get total applications across all jobs
    const jobs = await Job.find({ company: userId }).select('_id');
    const jobIds = jobs.map(job => job._id);
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        pausedJobs,
        closedJobs,
        totalApplications
      }
    });
  } catch (err) {
    console.error('Get job stats error:', err);
    next(err);
  }
};
