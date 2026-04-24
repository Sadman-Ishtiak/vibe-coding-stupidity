import Internship from '../models/Internship.js'
import Company from '../models/Company.js'
import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/response.js'

/**
 * List all active jobs
 */
export const listJobs = async (req, res, next) => {
  try {
    // Frontend expects `companyId` to be a string (used in URL query params).
    // Avoid populating `companyId` to prevent it from becoming an object.
    const jobs = await Internship.find({ isActive: true })
    
    return sendSuccess(res, 200, 'Jobs retrieved successfully', jobs)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Get job details
 */
export const getJobDetails = async (req, res, next) => {
  try {
    const { jobId } = req.params
    
    if (!jobId) {
      return sendError(res, 400, 'Job ID is required')
    }
    
    // Keep `companyId` as a string for frontend routing.
    const job = await Internship.findById(jobId)
    
    if (!job) {
      return sendError(res, 404, 'Job not found')
    }
    
    return sendSuccess(res, 200, 'Job details retrieved successfully', job)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * List bookmarked jobs (Candidate only)
 * Frontend has a constant for this route even if UI is minimal.
 */
export const listBookmarkedJobs = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return sendError(res, 401, 'Unauthorized')

    const user = await User.findById(userId).select('bookmarkedJobIds')
    if (!user) return sendError(res, 404, 'User not found')

    const ids = Array.isArray(user.bookmarkedJobIds) ? user.bookmarkedJobIds : []
    if (ids.length === 0) {
      return sendSuccess(res, 200, 'Bookmarked jobs retrieved successfully', [])
    }

    // Keep companyId as string (no populate) to match frontend expectations.
    const jobs = await Internship.find({ _id: { $in: ids } })
    return sendSuccess(res, 200, 'Bookmarked jobs retrieved successfully', jobs)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Add a job to bookmarks (Candidate only)
 */
export const addJobBookmark = async (req, res) => {
  try {
    const userId = req.user?.id
    const { jobId } = req.params
    if (!userId) return sendError(res, 401, 'Unauthorized')
    if (!jobId) return sendError(res, 400, 'Job ID is required')

    const job = await Internship.findById(jobId)
    if (!job) return sendError(res, 404, 'Job not found')

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookmarkedJobIds: job._id } },
      { new: true, select: 'bookmarkedJobIds' },
    )
    if (!user) return sendError(res, 404, 'User not found')

    return sendSuccess(res, 200, 'Job bookmarked successfully', {
      bookmarkedJobIds: user.bookmarkedJobIds || [],
    })
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Remove a job from bookmarks (Candidate only)
 */
export const removeJobBookmark = async (req, res) => {
  try {
    const userId = req.user?.id
    const { jobId } = req.params
    if (!userId) return sendError(res, 401, 'Unauthorized')
    if (!jobId) return sendError(res, 400, 'Job ID is required')

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarkedJobIds: jobId } },
      { new: true, select: 'bookmarkedJobIds' },
    )
    if (!user) return sendError(res, 404, 'User not found')

    return sendSuccess(res, 200, 'Job bookmark removed successfully', {
      bookmarkedJobIds: user.bookmarkedJobIds || [],
    })
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Create a job (Recruiter only)
 */
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyId,
      companyName,
      companyLogoUrl,
      location,
      salaryText,
      badges,
      experienceText,
      notes,
      descriptionHtml,
    } = req.body
    
    // Validate required fields
    if (!title || !companyId || !location || !salaryText || !experienceText) {
      return sendError(res, 400, 'Missing required fields')
    }

    // If company metadata isn't provided, derive it from the company record.
    // This keeps the API compatible with simpler frontend payloads.
    let resolvedCompanyName = companyName
    let resolvedCompanyLogoUrl = companyLogoUrl
    if (!resolvedCompanyName || !resolvedCompanyLogoUrl) {
      const company = await Company.findById(companyId)
      if (!company) return sendError(res, 404, 'Company not found')
      resolvedCompanyName = resolvedCompanyName || company.name
      resolvedCompanyLogoUrl = resolvedCompanyLogoUrl || company.logoUrl
    }
    
    const job = new Internship({
      title,
      companyId,
      companyName: resolvedCompanyName,
      companyLogoUrl: resolvedCompanyLogoUrl,
      location,
      salaryText,
      badges: badges || [],
      experienceText,
      notes,
      descriptionHtml,
      recruiter: req.user.id,
      isActive: true,
    })
    
    await job.save()
    
    return sendSuccess(res, 201, 'Job created successfully', job)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Update job (Recruiter only)
 */
export const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params
    
    if (!jobId) {
      return sendError(res, 400, 'Job ID is required')
    }
    
    const job = await Internship.findById(jobId)
    
    if (!job) {
      return sendError(res, 404, 'Job not found')
    }
    
    // Check if user is the recruiter who posted this job
    if (job.recruiter.toString() !== req.user.id) {
      return sendError(res, 403, 'You do not have permission to update this job')
    }
    
    // Update fields
    const allowedFields = [
      'title',
      'location',
      'salaryText',
      'badges',
      'experienceText',
      'notes',
      'descriptionHtml',
      'isActive',
    ]
    
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field]
      }
    })
    
    await job.save()
    
    return sendSuccess(res, 200, 'Job updated successfully', job)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Delete job (Recruiter only)
 */
export const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params
    
    if (!jobId) {
      return sendError(res, 400, 'Job ID is required')
    }
    
    const job = await Internship.findById(jobId)
    
    if (!job) {
      return sendError(res, 404, 'Job not found')
    }
    
    // Check if user is the recruiter who posted this job
    if (job.recruiter.toString() !== req.user.id) {
      return sendError(res, 403, 'You do not have permission to delete this job')
    }
    
    await Internship.findByIdAndDelete(jobId)
    
    return sendSuccess(res, 200, 'Job deleted successfully')
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}
