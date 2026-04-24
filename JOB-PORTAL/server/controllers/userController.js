import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/response.js'
import bcrypt from 'bcryptjs'
import { calculateProfileCompletion } from '../utils/profileCompletion.js'

const toCandidateDto = (user) => {
  if (!user) return null
  return {
    id: String(user._id),
    name: user.username,
    email: user.email,
    roles: [user.role || 'candidate'],
    createdAt: user.createdAt,
  }
}

/**
 * List candidates (public)
 */
export const listCandidates = async (req, res) => {
  try {
    const users = await User.find({ role: 'candidate' }).sort({ createdAt: -1 })
    const data = users.map(toCandidateDto)
    return sendSuccess(res, 200, 'Candidates retrieved successfully', data)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Get candidate details (public)
 */
export const getCandidateDetails = async (req, res) => {
  try {
    const { candidateId } = req.params

    if (!candidateId) {
      return sendError(res, 400, 'Candidate ID is required')
    }

    const user = await User.findOne({ _id: candidateId, role: 'candidate' })

    if (!user) {
      return sendError(res, 404, 'Candidate not found')
    }

    return sendSuccess(res, 200, 'Candidate details retrieved successfully', toCandidateDto(user))
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Get my profile (private)
 * GET /api/users/me
 */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return sendError(res, 401, 'Unauthorized')

    const user = await User.findById(userId).select('-password').lean()
    if (!user) return sendError(res, 404, 'User not found')

    const completion = calculateProfileCompletion(user)
    const data = { ...user, profileCompletion: completion }

    return sendSuccess(res, 200, 'Profile retrieved successfully', data)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

const pickDefined = (obj) => {
  const out = {}
  for (const [key, value] of Object.entries(obj || {})) {
    if (value !== undefined) out[key] = value
  }
  return out
}

/**
 * Update my profile (private)
 * PUT /api/users/me
 */
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return sendError(res, 401, 'Unauthorized')

    const update = pickDefined({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      designation: req.body.designation,
      phone: req.body.phone,
      location: req.body.location,
      about: req.body.about,
      education: req.body.education,
      experience: req.body.experience,
      skills: req.body.skills,
      languages: req.body.languages,
      socials: req.body.socials,
    })

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!updatedUser) return sendError(res, 404, 'User not found')

    return sendSuccess(res, 200, 'Profile updated successfully', updatedUser)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Change my password (private)
 * PUT /api/users/me/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return sendError(res, 401, 'Unauthorized')

    const { currentPassword, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) return sendError(res, 404, 'User not found')

    const isMatch = await bcrypt.compare(String(currentPassword || ''), user.password)
    if (!isMatch) {
      return sendError(res, 400, 'Current password incorrect')
    }

    user.password = await bcrypt.hash(String(newPassword), 10)
    await user.save()

    return sendSuccess(res, 200, 'Password updated successfully')
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}
