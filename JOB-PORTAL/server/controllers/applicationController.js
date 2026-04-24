import Application from '../models/Application.js'
import Job from '../models/Job.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { canTransition } from '../utils/applicationWorkflow.js'
import { calculateMatchScore } from '../utils/matchScore.js'

export const getApplicants = async (req, res) => {
	try {
		const { status } = req.query

		const filter = { job: req.params.jobId }
		if (status) filter.status = status

		const applicants = await Application.find(filter).populate('applicant', 'name email')

		res.json(applicants)
	} catch (error) {
		return sendError(res, 500, error.message)
	}
}

export const applyToJob = async (req, res) => {
	try {
		const { jobId } = req.params
		if (!jobId) return sendError(res, 400, 'Job ID required')

		const job = await Job.findById(jobId)
		if (!job) return sendError(res, 404, 'Job not found')

		// Build application payload
		const appPayload = {
			job: job._id,
			applicant: req.user.id,
			status: 'Applied',
			statusHistory: [{ status: 'Applied' }],
		}

		// If resume uploaded via multipart middleware, attach
		if (req.file) {
			appPayload.resume = {
				path: req.file.path,
				originalName: req.file.originalname,
				mimeType: req.file.mimetype,
				size: req.file.size,
			}
		}

		// Optionally compute match score from candidate profile
		try {
			const user = await (await import('../models/User.js')).default.findById(req.user.id).select('skills')
			if (user && Array.isArray(user.skills)) {
				appPayload.matchScore = calculateMatchScore(user.skills, job.skills || [])
			}
		} catch (e) {
			// ignore match score failures
		}

		const application = new Application(appPayload)
		await application.save()

		return sendSuccess(res, 201, 'Application submitted', application)
	} catch (error) {
		// handle duplicate apply
		if (error && error.code === 11000) return sendError(res, 409, 'You have already applied to this job')
		return sendError(res, 500, error.message)
	}
}

export const updateStatus = async (req, res) => {
	try {
		const { status } = req.body

		const application = await Application.findById(req.params.id).populate('job')
		if (!application) return sendError(res, 404, 'Application not found')

		// Ensure requester company owns the job
		if (application.job && application.job.company && application.job.company.toString() !== req.user.companyId) {
			return sendError(res, 403, 'Unauthorized')
		}

		if (!canTransition(application.status, status)) {
			return sendError(res, 400, `Invalid transition from ${application.status} to ${status}`)
		}

		application.status = status
		application.statusHistory = application.statusHistory || []
		application.statusHistory.push({ status })

		await application.save()

		return sendSuccess(res, 200, 'Application status updated', application)
	} catch (error) {
		return sendError(res, 500, error.message)
	}
}

export const shortlistCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job')
    if (!application) return sendError(res, 404, 'Application not found')

    if (!application.job || application.job.company.toString() !== req.user.companyId) {
      return sendError(res, 403, 'Unauthorized')
    }

    application.status = 'Shortlisted'
    application.shortlistedBy = req.user.companyId
    application.statusHistory = application.statusHistory || []
    application.statusHistory.push({ status: 'Shortlisted' })

    await application.save()

    return sendSuccess(res, 200, 'Candidate shortlisted', application)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const getShortlistedCandidates = async (req, res) => {
  try {
    const applications = await Application.find({ shortlistedBy: req.user.companyId })
      .populate('applicant', 'name title skills profilePicture')
      .populate('job', 'title')

    return sendSuccess(res, 200, 'Shortlisted candidates retrieved', applications)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const deleteApplication = async (req, res) => {
	try {
		const { applicationId } = req.params

		if (!applicationId) return sendError(res, 400, 'Application ID is required')

		const application = await Application.findById(applicationId)
		if (!application) return sendError(res, 404, 'Application not found')

		// Allow deletion by applicant or by recruiter who owns the job
		const isApplicant = application.applicant.toString() === req.user?.id
		if (!isApplicant) {
			const job = await Job.findById(application.job)
			if (!job || job.company.toString() !== req.user?.companyId && job.company.toString() !== req.user?.id) {
				return sendError(res, 403, 'You do not have permission to delete this application')
			}
		}

		await Application.findByIdAndDelete(applicationId)
		return sendSuccess(res, 200, 'Application deleted successfully')
	} catch (error) {
		return sendError(res, 500, error.message)
	}
}

export const getMyApplications = async (req, res) => {
	try {
		const applications = await Application.find({ applicant: req.user.id }).populate('job')
		return sendSuccess(res, 200, 'My applications retrieved', applications)
	} catch (error) {
		return sendError(res, 500, error.message)
	}
}


