const Application = require('../models/Application');
const Job = require('../models/Job');
const Company = require('../models/Company');
const { sendApplicationStatusEmail } = require('../utils/emailService');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications
 * @access  Private (Candidate)
 */
exports.apply = async (req, res, next) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] POST /api/applications - User: ${req.candidate._id}, Job: ${req.body.jobId}`);
    const { jobId, resume } = req.body;

    if (!jobId) {
      console.warn(`[${requestId}] Job ID missing`);
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // ✅ Validate jobId format
    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      console.warn(`[${requestId}] Job not found: ${jobId}`);
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // ✅ Validate job is active
    if (job.status !== 'active') {
      console.warn(`[${requestId}] Job is not active: ${job.status}`);
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      candidateId: req.candidate._id,
      jobId: jobId
    });

    if (existingApplication) {
      console.warn(`[${requestId}] Duplicate application attempt`);
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application with companyId for better query support
    // ✅ job.company now directly references Company model (not User)
    let companyId = null;
    let companyName = 'N/A';
    let companyLogo = null;
    
    try {
      // job.company is now Company._id directly
      const companyDoc = await Company.findById(job.company).select('_id companyName logo');
      if (companyDoc) {
        companyId = companyDoc._id;
        companyName = companyDoc.companyName;
        companyLogo = companyDoc.logo;
        console.log(`[${requestId}] Found company: ${companyName} (${companyId})`);
      } else {
        // Fallback if company not found
        companyId = job.company;
        companyName = 'Unknown Company';
        console.warn(`[${requestId}] Company not found for ID: ${companyId}`);
      }
    } catch (err) {
      console.error(`[${requestId}] Company lookup failed for job.company ${job.company}:`, err.message);
      // Absolute fallback
      companyId = job.company;
    }

    const application = await Application.create({
      candidateId: req.candidate._id,
      jobId: jobId,
      companyId: companyId,
      // recruiterId should be the user that posted the job (job.company)
      recruiterId: job.company,
      resume: resume || req.candidate.resume?.fileUrl
    });
    console.log(`[${requestId}] Application created successfully: ${application._id}`);

    // Format response with the company data we already fetched
    const formatted = {
      _id: application._id,
      id: application._id,
      jobId: job._id ? String(job._id) : null,
      jobTitle: job.title || 'N/A',
      company: companyName,
      companyLogo: companyLogo,
      location: job.location || '',
      salary: job.salaryRange || '',
      type: job.employmentType || '',
      status: application.status,
      appliedAt: application.appliedAt
    };

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: formatted
    });
  } catch (err) {
    console.error(`[${requestId}] Apply error:`, err);
    
    // ✅ Handle duplicate key error from unique index (MongoDB level)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

/**
 * Public apply (guest) — accepts name, email, message and creates an application
 * Route: POST /api/applications/apply-public
 * Access: Public
 */
exports.publicApply = async (req, res, next) => {
  const requestId = `REQ-PUB-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;

  try {
    console.log(`[${requestId}] POST /api/applications/apply-public - payload:`, req.body);
    const { jobId, name, email, message, resume } = req.body;

    if (!jobId || !email) {
      return res.status(400).json({ success: false, message: 'jobId and email are required' });
    }

    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Prevent duplicate guest applications by same email for the same job
    const existing = await Application.findOne({ applicantEmail: email.toLowerCase(), jobId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already applied for this job with this email' });
    }

    // ✅ job.company now directly references Company model
    let companyId = null;
    try {
      const companyDoc = await Company.findById(job.company).select('_id');
      if (companyDoc) {
        companyId = companyDoc._id;
      } else {
        // Fallback to using the company ID from job
        companyId = job.company || null;
      }
    } catch (err) {
      console.warn(`[${requestId}] Company lookup failed for public apply job ${jobId}:`, err.message);
      companyId = job.company || null;
    }

    const application = await Application.create({
      candidateId: null,
      jobId,
      companyId: companyId,
      recruiterId: job.company || job.recruiter || null,
      resume: resume || null,
      applicantName: name || '',
      applicantEmail: email.toLowerCase(),
      coverLetter: message || ''
    });

    console.log(`[${requestId}] Public application created: ${application._id}`);

    res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (err) {
    console.error(`[${requestId}] publicApply error:`, err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already applied for this job' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * @desc    Get applications for a specific job (Recruiter)
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Recruiter)
 */
exports.getApplicationsForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    console.log('📋 Get Applications for Job:', jobId, '| Recruiter:', req.user._id);
    
    // Verify job exists and belongs to recruiter
    const Job = require('../models/Job');
    const job = await Job.findById(jobId);
    
    if (!job) {
      console.warn('❌ Job not found:', jobId);
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    console.log('🔍 Job found. Owner:', job.company, '| Requester:', req.user._id);
    
    // ✅ SECURITY: Verify ownership
    if (job.company.toString() !== req.user._id.toString()) {
      console.error('❌ Ownership mismatch - Job owner:', job.company, '| Requester:', req.user._id);
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view applications for your own jobs.'
      });
    }
    
    const Candidate = require('../models/Candidate');
    const User = require('../models/User');
    
    const applications = await Application.find({ jobId })
      .sort({ appliedAt: -1 });
    
    // Manually populate candidate data from either Candidate or User model
    const populatedApplications = await Promise.all(
      applications.map(async (app) => {
        let candidateData = null;
        
        // Try to get from Candidate model first
        const candidate = await Candidate.findById(app.candidateId)
          .select('firstName lastName email phone designation profileImage category location');
        
        if (candidate) {
          candidateData = {
            _id: candidate._id,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            name: `${candidate.firstName} ${candidate.lastName}`,
            email: candidate.email,
            phone: candidate.phone,
            designation: candidate.designation,
            profileImage: candidate.profileImage,
            category: candidate.category,
            location: candidate.location
          };
        } else {
          // Fallback to User model
          const user = await User.findById(app.candidateId)
            .select('username email profilePicture designation location');
          
          if (user) {
            candidateData = {
              _id: user._id,
              name: user.username,
              email: user.email,
              profileImage: user.profilePicture,
              designation: user.designation || '',
              location: user.location || ''
            };
          }
        }
        
        return {
          _id: app._id,
          candidateId: app.candidateId,
          candidate: candidateData,
          jobId: app.jobId,
          job: {
            _id: job._id,
            title: job.title,
            location: job.location
          },
          status: app.status,
          resume: app.resume,
          appliedAt: app.appliedAt,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt
        };
      })
    );

    console.log('✅ Applications retrieved:', populatedApplications.length, 'for job:', job.title);

    res.status(200).json({
      success: true,
      data: populatedApplications,
      meta: {
        total: populatedApplications.length,
        jobTitle: job.title
      }
    });
  } catch (err) {
    console.error('Get job applications error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

/**
 * @desc    Get candidate's own applications
 * @route   GET /api/applications/my
 * @access  Private (Candidate)
 */
exports.getMyApplications = async (req, res, next) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${requestId}] GET /api/applications/my - User: ${req.candidate._id}`);
    const applications = await Application.find({ candidateId: req.candidate._id })
      .populate({
        path: 'jobId',
        select: 'title company location salaryRange employmentType description createdAt',
        populate: {
          path: 'company',
          select: 'username email'
        }
      })
      .populate({
        path: 'companyId',
        select: 'name logo'
      })
      .sort({ appliedAt: -1 });

    // ✅ Filter out applications where job was deleted
    const validApplications = applications.filter(app => app.jobId !== null);
    const filteredOut = applications.length - validApplications.length;
    if (filteredOut > 0) {
      console.warn(`[${requestId}] Filtered out ${filteredOut} applications because jobId was null`);
    }

    // Format response for frontend (normalized shape)
    // ✅ Enhanced: Get company name from multiple sources with proper fallback
    const formattedApplications = await Promise.all(validApplications.map(async (app) => {
      let companyName = 'N/A';
      let companyLogo = null;

      // Priority 1: Try companyId (Company model)
      if (app.companyId && app.companyId.name) {
        companyName = app.companyId.name;
        companyLogo = app.companyId.logo || null;
      } 
      // Priority 2: Try to find Company by owner (job.company is User ID)
      else if (app.jobId?.company) {
        try {
          const companyDoc = await Company.findById(app.jobId.company).select('companyName logo');
          if (companyDoc) {
            companyName = companyDoc.companyName;
            companyLogo = companyDoc.logo || null;
          } else if (app.jobId.company.username) {
            // Priority 3: Use recruiter username if populated
            companyName = app.jobId.company.username;
          }
        } catch (err) {
          console.warn(`[${requestId}] Company lookup failed for application ${app._id}:`, err.message);
        }
      }

      return {
        _id: app._id,
        id: app._id,
        jobId: app.jobId?._id ? String(app.jobId._id) : null,
        jobTitle: app.jobId?.title || 'N/A',
        company: companyName,
        companyName: companyName,
        companyLogo: companyLogo,
        location: app.jobId?.location || '',
        salary: app.jobId?.salaryRange || '',
        type: app.jobId?.employmentType || '',
        status: app.status || 'pending',
        appliedAt: app.appliedAt,
        appliedDate: app.appliedAt
      };
    }));

    console.log(`[${requestId}] Retrieved ${formattedApplications.length} valid applications`);
    res.status(200).json({
      success: true,
      data: formattedApplications
    });
  } catch (err) {
    console.error(`[${requestId}] Get my applications error:`, err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

/**
 * @desc    Update application status (Recruiter)
 * @route   PUT /api/applications/:id/status
 * @access  Private (Recruiter)
 */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'shortlisted', 'rejected', 'accepted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Find application and verify ownership
    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Store old status to detect changes
    const oldStatus = application.status;
    
    // Verify job ownership
    const Job = require('../models/Job');
    const job = await Job.findById(application.jobId);
    
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
        message: 'Access denied. You can only update applications for your own jobs.'
      });
    }
    
    // Update status
    application.status = status;
    await application.save();

    // ✅ SEND EMAIL NOTIFICATION IF STATUS CHANGED TO ACCEPTED OR REJECTED
    // Only send email if status actually changed and is accepted/rejected
    if (oldStatus !== status && (status === 'accepted' || status === 'rejected')) {
      try {
        // Determine candidate contact info
        // Priority: guest applicant email (`applicantEmail`) -> registered candidate's User email via Candidate.userId
        let candidateEmail = null;
        let candidateName = 'Candidate';

        if (application.applicantEmail) {
          // Guest applicant (public apply)
          candidateEmail = application.applicantEmail;
          candidateName = application.applicantName || candidateName;
        } else if (application.candidateId) {
          const Candidate = require('../models/Candidate');
          const User = require('../models/User');

          const candidate = await Candidate.findById(application.candidateId).select('firstName lastName userId');
          if (candidate) {
            const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
            if (fullName) candidateName = fullName;

            // If Candidate references a User, fetch email from User model
            if (candidate.userId) {
              try {
                const user = await User.findById(candidate.userId).select('email username');
                if (user && user.email) {
                  candidateEmail = user.email;
                  // Use username if candidate name was missing
                  if (!fullName && user.username) candidateName = user.username;
                }
              } catch (uErr) {
                console.warn('Failed to fetch User for candidate:', uErr.message);
              }
            }
          }
        }
        
        // Get company name
        let companyName = 'Our Company';
        try {
          const Company = require('../models/Company');
          const companyDoc = await Company.findById(job.company).select('companyName');
          if (companyDoc) {
            companyName = companyDoc.companyName;
          }
        } catch (err) {
          console.warn('Could not fetch company name:', err.message);
        }
        
        // Send email notification (async, non-blocking)
        if (candidateEmail) {
          sendApplicationStatusEmail(
            candidateEmail,
            candidateName,
            job.title,
            companyName,
            status
          ).catch(err => {
            // Log error but don't fail the request
            console.error('Failed to send application status email:', err);
          });
        } else {
          console.warn('Cannot send email: candidate email not found for application', id);
        }
      } catch (emailError) {
        // Log error but don't fail the status update
        console.error('Error preparing email notification:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: {
        _id: application._id,
        status: application.status,
        candidateId: application.candidateId,
        jobId: application.jobId
      }
    });
  } catch (err) {
    console.error('Update application status error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

/**
 * @desc    Delete/Cancel an application
 * @route   DELETE /api/applications/:id
 * @access  Private (Candidate - own applications only)
 */
exports.deleteApplication = async (req, res, next) => {
  const requestId = `REQ-DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const { id } = req.params;
    console.log(`[${requestId}] DELETE /api/applications/${id} - User: ${req.candidate._id}`);

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID'
      });
    }

    // Find the application
    const application = await Application.findById(id);

    if (!application) {
      console.warn(`[${requestId}] Application not found: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify the application belongs to the current candidate
    if (application.candidateId.toString() !== req.candidate._id.toString()) {
      console.warn(`[${requestId}] Unauthorized delete attempt - Application belongs to ${application.candidateId}, user is ${req.candidate._id}`);
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own applications'
      });
    }

    // Optional: Prevent deletion if application is already accepted
    if (application.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an accepted application. Please contact the company directly.'
      });
    }

    // Delete the application
    await Application.findByIdAndDelete(id);
    console.log(`[${requestId}] Application deleted successfully`);

    res.status(200).json({
      success: true,
      message: 'Application cancelled successfully',
      data: {
        _id: id,
        deletedAt: new Date()
      }
    });
  } catch (err) {
    console.error(`[${requestId}] Delete application error:`, err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
