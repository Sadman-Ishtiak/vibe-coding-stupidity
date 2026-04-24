import api from '@/config/api';

/**
 * Get authenticated company/recruiter profile
 * @returns {Promise} Profile response
 */
export async function getMyProfile({ signal } = {}) {
  try {
    const response = await api.get('/companies/me', { signal });
    return response.data;
  } catch (error) {
    console.error('Get my profile error:', error);
    throw error;
  }
}

/**
 * Update company/recruiter profile
 * @param {FormData} formData - Profile data (can include file uploads)
 * @returns {Promise} Update response
 */
export async function updateMyProfile(formData) {
  try {
    const response = await api.patch('/companies/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update my profile error:', error);
    throw error;
  }
}

/**
 * Upload company logo only
 * @param {File} logoFile - Logo image file
 * @returns {Promise} Upload response with logo URL
 */
export async function uploadCompanyLogo(logoFile) {
  try {
    const formData = new FormData();
    formData.append('profilePicture', logoFile);
    const response = await api.patch('/companies/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload company logo error:', error);
    throw error;
  }
}

/**
 * Change password
 * @param {Object} passwords - { currentPassword, newPassword, confirmPassword }
 * @returns {Promise} Change password response
 */
export async function changePassword(passwords) {
  try {
    const response = await api.patch('/companies/change-password', passwords);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
}

/**
 * List all companies (public)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.sortBy - Sort field (companyName, createdAt)
 * @param {string} options.order - Sort order (asc, desc)
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise} Companies list with pagination
 */
export async function listCompanies({ page = 1, limit = 12, sortBy = 'createdAt', order = 'desc', signal } = {}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      order
    });
    
    const response = await api.get(`/companies?${params.toString()}`, { signal });
    return response.data;
  } catch (error) {
    console.error('List companies error:', error);
    throw error;
  }
}

/**
 * Get company by ID (public)
 * @param {string} companyId - Company ID
 * @param {Object} options - Request options
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise} Company details
 */
export async function getCompany(companyId, { signal } = {}) {
  if (!companyId) throw new Error('companyId is required');
  
  try {
    const response = await api.get(`/companies/${companyId}`, { signal });
    return response.data;
  } catch (error) {
    console.error('Get company error:', error);
    throw error;
  }
}

/**
 * Get jobs by company ID (public)
 * @param {string} companyId - Company ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise} Company jobs with pagination
 */
export async function getCompanyJobs(companyId, { page = 1, limit = 10, signal } = {}) {
  if (!companyId) throw new Error('companyId is required');
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await api.get(`/companies/${companyId}/jobs?${params.toString()}`, { signal });
    return response.data;
  } catch (error) {
    console.error('Get company jobs error:', error);
    throw error;
  }
}
