import path from 'path'
import fs from 'fs'
import User from '../models/User.js'
import Application from '../models/Application.js'
import { sendSuccess, sendError } from '../utils/response.js'

// Upload handler expects multer middleware to have placed file on disk
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, 'No file uploaded')

    const fileInfo = {
      path: req.file.path,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { resume: fileInfo },
      { new: true }
    ).select('-password')

    return sendSuccess(res, 200, 'Resume uploaded', { user: updated, resume: fileInfo })
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

// Download resume for a given userId. Access control: owner, recruiter, admin.
export const downloadResumeByUser = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) return sendError(res, 400, 'User ID required')

    const target = await User.findById(userId).select('resume role')
    if (!target || !target.resume || !target.resume.path) return sendError(res, 404, 'Resume not found')

    const requesterId = req.user?.id
    const requesterRole = req.user?.role || req.user?.accountType
    const isOwner = requesterId === userId
    const isRecruiter = (requesterRole === 'recruiter' || requesterRole === 'company')
    const isAdmin = requesterRole === 'admin'

    if (!isOwner && !isRecruiter && !isAdmin) return sendError(res, 403, 'Not authorized to download this resume')

    const filePath = path.resolve(target.resume.path)
    if (!fs.existsSync(filePath)) return sendError(res, 404, 'File missing on server')

    return res.download(filePath, target.resume.originalName || path.basename(filePath))
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

// Download resume attached to an application (recruiter/company owners can access)
export const downloadResumeByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params
    if (!applicationId) return sendError(res, 400, 'Application ID required')

    const application = await Application.findById(applicationId).populate('applicant')
    if (!application) return sendError(res, 404, 'Application not found')
    if (!application.resume || !application.resume.path) return sendError(res, 404, 'Resume not attached to this application')

    // Only recruiter who owns the job (or admin) should download via application
    const requesterRole = req.user?.role || req.user?.accountType
    if (requesterRole !== 'recruiter' && requesterRole !== 'admin' && requesterRole !== 'company') {
      return sendError(res, 403, 'Not authorized to download this resume')
    }

    const filePath = path.resolve(application.resume.path)
    if (!fs.existsSync(filePath)) return sendError(res, 404, 'File missing on server')

    return res.download(filePath, application.resume.originalName || path.basename(filePath))
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export default { uploadResume, downloadResumeByUser, downloadResumeByApplication }
