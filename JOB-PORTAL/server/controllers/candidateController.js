import User from '../models/User.js'
import Job from '../models/Job.js'
import { validationResult } from 'express-validator'
import { sendSuccess, sendError } from '../utils/response.js'
import { calculateMatchScore } from '../utils/matchScore.js'

export const getCandidateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('appliedJobs')
      .populate('bookmarkedJobs')

    if (!user || user.role !== 'candidate') {
      return sendError(res, 404, 'Candidate not found')
    }

    return sendSuccess(res, 200, 'Candidate profile retrieved', user)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const updateCandidateProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array())
    }

    const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true })
    return sendSuccess(res, 200, 'Profile updated', updated)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const listCandidates = async (req, res) => {
  try {
    const { search, location, category, page = 1, limit = 10 } = req.query

    const query = { role: 'candidate' }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') },
        { skills: new RegExp(search, 'i') },
      ]
    }
    if (location) query.location = location
    if (category) query.category = category

    const candidates = await User.find(query)
      .select('name title location category skills profilePicture rating')
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await User.countDocuments(query)

    return sendSuccess(res, 200, 'Candidates retrieved', {
      data: candidates,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const rankedCandidates = async (req, res) => {
  try {
    const { jobId } = req.query
    if (!jobId) return sendError(res, 400, 'jobId query parameter required')

    const job = await Job.findById(jobId)
    if (!job) return sendError(res, 404, 'Job not found')

    const candidates = await User.find({ role: 'candidate', skills: { $in: job.skills || [] } }).select('name title skills profilePicture')

    const ranked = candidates.map((candidate) => ({
      ...candidate.toObject(),
      matchScore: calculateMatchScore(candidate.skills || [], job.skills || []),
    }))

    ranked.sort((a, b) => b.matchScore - a.matchScore)

    return sendSuccess(res, 200, 'Ranked candidates', ranked)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export default { getCandidateProfile, updateCandidateProfile, listCandidates }
