import User from '../models/User.js'
import Company from '../models/Company.js'
import Internship from '../models/Internship.js'
import Application from '../models/Application.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getAdminHealth = (req, res) =>
  sendSuccess(res, 200, 'Admin API healthy', { status: 'ok', timestamp: new Date().toISOString() })

export const getAdminOverview = async (req, res) => {
  try {
    const [users, companies, internships, applications] = await Promise.all([
      User.estimatedDocumentCount(),
      Company.estimatedDocumentCount(),
      Internship.estimatedDocumentCount(),
      Application.estimatedDocumentCount(),
    ])
    return sendSuccess(res, 200, 'Overview ready', { totals: { users, companies, internships, applications } })
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('username email accountType createdAt')
    return sendSuccess(res, 200, 'Users retrieved successfully', users)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}
