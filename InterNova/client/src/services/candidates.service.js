import api from '@/config/api';

/**
 * Get candidate by ID
 * @param {string} candidateId - Candidate ID
 * @returns {Promise} Candidate profile response
 */
export const getCandidate = async (candidateId) => {
  try {
    const response = await api.get(`/candidates/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Get candidate error:', error);
    throw error;
  }
};

/**
 * Get current candidate's profile
 * @returns {Promise} Candidate profile response
 */
export const getMyProfile = async () => {
  try {
    const response = await api.get('/candidates/me');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

/**
 * Update candidate profile
 * @param {Object} data - Updated candidate data
 * @returns {Promise} Update response
 */
export const updateMyProfile = async (data) => {
  try {
    const response = await api.put('/candidates/me', data);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Change candidate password
 * @param {Object} passwords - { currentPassword, newPassword, confirmPassword }
 * @returns {Promise} Password change response
 */
export const changePassword = async (passwords) => {
  try {
    const response = await api.put('/candidates/change-password', passwords);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

/**
 * Get bookmarked jobs
 * @returns {Promise} Bookmarked jobs response
 */
export const getBookmarks = async () => {
  try {
    const response = await api.get('/candidates/bookmarks');
    return response.data;
  } catch (error) {
    console.error('Get bookmarks error:', error);
    throw error;
  }
};

/**
 * Add job to bookmarks
 * @param {string} jobId - Job ID
 * @returns {Promise} Add bookmark response
 */
export const addBookmark = async (jobId) => {
  try {
    const response = await api.post(`/candidates/bookmarks/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Add bookmark error:', error);
    throw error;
  }
};

/**
 * Remove job from bookmarks
 * @param {string} jobId - Job ID
 * @returns {Promise} Remove bookmark response
 */
export const removeBookmark = async (jobId) => {
  try {
    const response = await api.delete(`/candidates/bookmarks/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Remove bookmark error:', error);
    throw error;
  }
};

/**
 * Get candidate's applied jobs
 * @returns {Promise} Applied jobs response
 */
export const getAppliedJobs = async () => {
  try {
    const response = await api.get('/candidates/applied-jobs');
    return response.data;
  } catch (error) {
    console.error('Get applied jobs error:', error);
    throw error;
  }
};

/**
 * Upload profile image
 * @param {File} imageFile - Image file to upload
 * @returns {Promise} Upload response
 */
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const response = await api.post('/candidates/me/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload profile image error:', error);
    throw error;
  }
};

/**
 * Upload resume
 * @param {File} resumeFile - Resume file to upload (PDF)
 * @returns {Promise} Upload response
 */
export const uploadResume = async (resumeFile) => {
  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    const response = await api.post('/candidates/me/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload resume error:', error);
    throw error;
  }
};
