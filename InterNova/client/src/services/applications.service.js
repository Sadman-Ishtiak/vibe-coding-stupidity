import api from '@/config/api';

/**
 * Get candidate's own applications
 * @param {Object} options - Request options (signal for cancellation)
 * @returns {Promise} Applications response
 */
export async function fetchMyApplications({ signal } = {}) {
  try {
    const response = await api.get('/applications/my', { signal });
    return response.data;
  } catch (error) {
    console.error('Fetch my applications error:', error);
    throw error;
  }
}

/**
 * Check if user has applied to a specific job
 * @param {string} jobId - Job ID
 * @returns {Promise<boolean>} True if user has applied
 */
export async function checkIfApplied(jobId) {
  try {
    const response = await fetchMyApplications();
    if (response.success && response.data) {
      return response.data.some(app => {
        // Normalize possible shapes: jobId may be string, ObjectId, or populated object
        const candidateJobId = app.jobId?._id ? String(app.jobId._id) : String(app.jobId || '');
        return String(jobId) === candidateJobId;
      });
    }
    return false;
  } catch (error) {
    console.error('Check if applied error:', error);
    return false;
  }
}

/**
 * Apply for a job
 * @param {string} jobId - Job ID
 * @param {string} resume - Resume URL (optional)
 * @returns {Promise} Application response
 */
export async function applyForJob(jobId, resume) {
  try {
    const response = await api.post('/applications/apply', { jobId, resume });
    return response.data;
  } catch (error) {
    console.error('Apply for job error:', error);
    throw error;
  }
}

/**
 * Public apply (guest) — name, email, message
 */
export async function applyPublic(payload) {
  try {
    const response = await api.post('/applications/apply-public', payload);
    return response.data;
  } catch (error) {
    console.error('Public apply error:', error);
    throw error;
  }
}

/**
 * Delete application (if supported)
 * @param {string} applicationId - Application ID
 * @returns {Promise} Delete response
 */
export async function deleteApplication(applicationId) {
  if (!applicationId) throw new Error('applicationId is required');
  
  try {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error('Delete application error:', error);
    throw error;
  }
}

/**
 * Get applications for a specific job (Recruiter)
 * @param {string} jobId - Job ID
 * @param {string} status - Filter by status (optional)
 * @param {Object} options - Request options
 * @returns {Promise} Applications response
 */
export const fetchApplicants = async (jobId, status, { signal } = {}) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get(`/applications/job/${jobId}`, { params, signal });
    return response.data;
  } catch (error) {
    console.error('Fetch applicants error:', error);
    throw error;
  }
};

/**
 * Update application status (Recruiter)
 * @param {string} id - Application ID
 * @param {string} status - New status
 * @returns {Promise} Update response
 */
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Update application status error:', error);
    throw error;
  }
};


