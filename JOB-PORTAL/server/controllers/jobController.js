import Job from '../models/Job.js'
import Company from '../models/Company.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { validationResult } from 'express-validator'
import { filterJobs } from '../utils/filterUtil.js'

export const createJob = async (req, res) => {
  try {
    const {
      title,
      category,
      vacancy,
      employmentType,
      position,
      location,
      salaryMin,
      salaryMax,
      description,
      responsibilities,
      qualifications,
      skills,
    } = req.body

    const company = await Company.findOne({ user: req.user.id })
    if (!company) return sendError(res, 404, 'Company not found for authenticated user')

    const job = await Job.create({
      title,
      category,
      vacancy,
      employmentType,
      position,
      location,
      salaryMin,
      salaryMax,
      description,
      responsibilities,
      qualifications,
      skills,
      company: company._id,
    })

    return sendSuccess(res, 201, 'Job created', job)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id })
    if (!company) return sendError(res, 404, 'Company not found for authenticated user')

    const jobs = await Job.find({ company: company._id })
    return sendSuccess(res, 200, 'Company jobs retrieved', jobs)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

// Public job listing with optional filters
export const getJobs = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return sendError(res, 400, 'Invalid query', errors.array())
    // Build Mongo query from filters for efficiency
    const { location, category, salaryMin, salaryMax, skills, page = 1, limit = 20, sortBy, order } = req.query

    const q = { status: 'active' }
    if (location) q.location = { $regex: new RegExp(location, 'i') }
    if (category) q.category = { $regex: new RegExp(category, 'i') }
    if (salaryMin || salaryMax) q.$and = []
    if (salaryMin) q.$and.push({ salaryMin: { $gte: Number(salaryMin) } })
    if (salaryMax) q.$and.push({ salaryMax: { $lte: Number(salaryMax) } })

    if (skills) {
      const wanted = Array.isArray(skills) ? skills : String(skills).split(',').map(s => s.trim()).filter(Boolean)
      if (wanted.length) q.skills = { $all: wanted }
    }

    const pageNum = Number(page) || 1
    const perPage = Math.min(Number(limit) || 20, 100)

    const sortObj = {}
    if (sortBy) {
      const dir = ['desc', '-1'].includes(String(order)) ? -1 : 1
      sortObj[sortBy] = dir
    } else {
      sortObj.createdAt = -1
    }

    const total = await Job.countDocuments(q)
    const jobs = await Job.find(q).sort(sortObj).skip((pageNum - 1) * perPage).limit(perPage)

    return sendSuccess(res, 200, 'Jobs retrieved', { data: jobs, total, page: pageNum, pages: Math.ceil(total / perPage) })
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['active', 'paused', 'closed'].includes(status)) return sendError(res, 400, 'Invalid status')

    const job = await Job.findById(id)
    if (!job) return sendError(res, 404, 'Job not found')

    const company = await Company.findOne({ user: req.user.id })
    if (!company || job.company.toString() !== company._id.toString()) return sendError(res, 403, 'You do not have permission')

    job.status = status
    await job.save()

    return sendSuccess(res, 200, 'Job status updated', job)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params
    const job = await Job.findById(id)
    if (!job) return sendError(res, 404, 'Job not found')

    const company = await Company.findOne({ user: req.user.id })
    if (!company || job.company.toString() !== company._id.toString()) return sendError(res, 403, 'You do not have permission')

    await Job.findByIdAndDelete(id)
    return sendSuccess(res, 200, 'Job deleted')
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}
