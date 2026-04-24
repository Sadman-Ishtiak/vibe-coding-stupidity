import api from '@/config/api';

/**
 * Job Service
 * Handles all job-related API calls with proper error handling
 */

/**
 * Build query params from filter object
 * @param {Object} filters - Filter parameters
 * @returns {string} - URL query string
 */
const buildQueryParams = (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value);
    }
  });
  
  return params.toString();
};

/**
 * Normalize API error response
 * @param {Error} error - Error object
 * @returns {Error} - Normalized error
 */
const normalizeError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'An error occurred';
    const normalizedError = new Error(message);
    normalizedError.status = error.response.status;
    normalizedError.data = error.response.data;
    return normalizedError;
  } else if (error.request) {
    // Request made but no response received
    return new Error('Network error. Please check your connection.');
  } else {
    // Error in request setup
    return error;
  }
};

/**
 * Get all jobs with optional filters and pagination
 * @param {Object} filters - Filter parameters (keyword, location, category, experience, jobType, datePosted, page, limit)
 * @param {Object} options - Request options (signal for AbortController)
 * @returns {Promise} - Job list response with pagination metadata
 */
export async function listJobs(filters = {}, options = {}) {
  try {
    const queryString = buildQueryParams(filters);
    const url = queryString ? `/jobs?${queryString}` : '/jobs';
    
    const response = await api.get(url, {
      signal: options.signal
    });
    
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Get single job by ID
 * @param {string} jobId - Job ID
 * @param {Object} options - Request options (signal for AbortController)
 * @returns {Promise} - Job details with populated company data
 */
export async function getJob(jobId, options = {}) {
  if (!jobId) {
    throw new Error('jobId is required');
  }
  
  try {
    const response = await api.get(`/jobs/${jobId}`, {
      signal: options.signal
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Create a new job (Recruiter only)
 * @param {Object} jobData - Job details
 * @returns {Promise} - Created job response
 */
export async function createJob(jobData) {
  if (!jobData) {
    throw new Error('Job data is required');
  }
  
  try {
    const response = await api.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Update an existing job (Recruiter only)
 * @param {string} jobId - Job ID
 * @param {Object} jobData - Updated job details
 * @returns {Promise} - Updated job response
 */
export async function updateJob(jobId, jobData) {
  if (!jobId) {
    throw new Error('jobId is required');
  }
  if (!jobData) {
    throw new Error('Job data is required');
  }
  
  try {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Delete a job (Recruiter only)
 * @param {string} jobId - Job ID
 * @returns {Promise} - Deletion response
 */
export async function deleteJob(jobId) {
  if (!jobId) {
    throw new Error('jobId is required');
  }
  
  try {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Get jobs posted by the authenticated recruiter
 * @param {Object} options - Request options (signal for AbortController)
 * @returns {Promise} - My jobs response
 */
export async function getMyJobs(options = {}) {
  try {
    const response = await api.get('/jobs/recruiter/my-jobs', {
      signal: options.signal
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Get job statistics for dashboard (Recruiter only)
 * @param {Object} options - Request options (signal for AbortController)
 * @returns {Promise} - Job stats response
 */
export async function getJobStats(options = {}) {
  try {
    const response = await api.get('/jobs/recruiter/stats', {
      signal: options.signal
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Update job status (active/paused/closed) - Recruiter only
 * @param {string} jobId - Job ID
 * @param {string} status - New status (active, paused, closed)
 * @returns {Promise} - Status update response
 */
export async function updateJobStatus(jobId, status) {
  if (!jobId) {
    throw new Error('jobId is required');
  }
  if (!['active', 'paused', 'closed'].includes(status)) {
    throw new Error('Invalid status. Must be: active, paused, or closed');
  }
  
  try {
    const response = await api.patch(`/jobs/${jobId}/status`, { status });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Apply to a job (Candidate only)
 * @param {string} jobId - Job ID
 * @param {Object} applicationData - Application data
 * @param {Object} options - Request options (signal for AbortController)
 * @returns {Promise} - Application response
 */
export async function applyToJob(jobId, applicationData, options = {}) {
  if (!jobId) {
    throw new Error('jobId is required');
  }
  if (!applicationData) {
    throw new Error('Application data is required');
  }
  
  try {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData, {
      signal: options.signal
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Get featured jobs for home page
 * Returns latest active jobs (limited to 8), sorted by createdAt desc
 * @param {Object} options - Request options (signal for AbortController)
 * @returns {Promise} - Home jobs response with latest active jobs
 */
export async function getHomeJobs(options = {}) {
  try {
    const response = await api.get('/jobs?limit=8&status=active', {
      signal: options.signal
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}



