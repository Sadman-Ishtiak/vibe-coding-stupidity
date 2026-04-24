import api from './api';

export const applicationService = {
  apply: async (internshipId, data) => {
    // data = { coverLetter, resumeUrl }
    const response = await api.post(`/applications/${internshipId}/apply`, data);
    return response.data;
  },

  getCandidateApplications: async () => {
    const response = await api.get('/applications/candidate/applications');
    return response.data;
  },

  getCompanyApplications: async () => {
    const response = await api.get('/applications/company/applications');
    return response.data;
  },

  updateStatus: async (applicationId, status) => {
    const response = await api.put(`/applications/${applicationId}/status`, { status });
    return response.data;
  }
};
