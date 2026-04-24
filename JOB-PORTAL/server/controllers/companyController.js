import Company from '../models/Company.js'
import { sendSuccess, sendError } from '../utils/response.js'

/**
 * List all companies
 */
export const listCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('user', 'username email')

    return sendSuccess(res, 200, 'Companies retrieved successfully', companies)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Get company details
 */
export const getCompanyDetails = async (req, res, next) => {
  try {
    const { companyId } = req.params
    
    if (!companyId) {
      return sendError(res, 400, 'Company ID is required')
    }
    
    const company = await Company.findById(companyId).populate('user', 'username email')
    
    if (!company) {
      return sendError(res, 404, 'Company not found')
    }
    
    return sendSuccess(res, 200, 'Company details retrieved successfully', company)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Create a company (Recruiter only)
 */
export const createCompany = async (req, res, next) => {
  try {
    const { name, logo, location, website, description, email } = req.body

    if (!name || !email) {
      return sendError(res, 400, 'Name and email are required')
    }

    const company = new Company({
      name,
      logo,
      location,
      website,
      description,
      email,
      user: req.user.id,
    })

    await company.save()

    return sendSuccess(res, 201, 'Company created successfully', company)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Update company (Recruiter only)
 */
export const updateCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params
    
    if (!companyId) {
      return sendError(res, 400, 'Company ID is required')
    }
    
    const company = await Company.findById(companyId)
    
    if (!company) {
      return sendError(res, 404, 'Company not found')
    }
    
    // Check if user is the owner who created this company
    if (company.user.toString() !== req.user.id) {
      return sendError(res, 403, 'You do not have permission to update this company')
    }
    
    // Update fields
    const allowedFields = ['name', 'logo', 'location', 'website', 'description', 'email', 'ownerName', 'phone', 'industry', 'employeesRange', 'establishedAt', 'socialLinks', 'workingDays']
    
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field]
      }
    })
    
    await company.save()
    
    return sendSuccess(res, 200, 'Company updated successfully', company)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Delete company (Recruiter only)
 */
export const deleteCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params
    
    if (!companyId) {
      return sendError(res, 400, 'Company ID is required')
    }
    
    const company = await Company.findById(companyId)
    
    if (!company) {
      return sendError(res, 404, 'Company not found')
    }
    
    // Check if user is the owner who created this company
    if (company.user.toString() !== req.user.id) {
      return sendError(res, 403, 'You do not have permission to delete this company')
    }
    
    await Company.findByIdAndDelete(companyId)
    
    return sendSuccess(res, 200, 'Company deleted successfully')
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

// New helper: get companies with filters, sorting and pagination
export const getCompanies = async (req, res) => {
  try {
    const { search, location, sort, page = 1, limit = 8 } = req.query

    const filter = {}
    if (search) filter.name = { $regex: search, $options: 'i' }
    if (location) filter.location = location

    let query = Company.find(filter)

    if (sort === 'newest') query = query.sort({ createdAt: -1 })
    if (sort === 'oldest') query = query.sort({ createdAt: 1 })

    const companies = await query.skip((page - 1) * limit).limit(Number(limit))

    return sendSuccess(res, 200, 'Companies retrieved successfully', companies)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

// Get the company for the authenticated user (profile/me)
export const getMyCompany = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return sendError(res, 401, 'Unauthorized')

    const company = await Company.findOne({ user: userId })
    if (!company) return sendError(res, 404, 'Company not found')

    return sendSuccess(res, 200, 'Company retrieved', company)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

// Update authenticated user's company profile
export const updateMyCompany = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return sendError(res, 401, 'Unauthorized')

    const company = await Company.findOne({ user: userId })
    if (!company) return sendError(res, 404, 'Company not found')

    const allowedFields = ['name', 'logo', 'location', 'website', 'description', 'email', 'ownerName', 'phone', 'industry', 'employeesRange', 'establishedAt', 'socialLinks', 'workingDays']
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) company[field] = req.body[field]
    })

    await company.save()
    return sendSuccess(res, 200, 'Company updated successfully', company)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}
