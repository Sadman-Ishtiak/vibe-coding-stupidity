import api from './api';

export const internshipService = {
  getAllInternships: async (filters = {}) => {
    const response = await api.get('/internships', { params: filters });
    return response.data;
  },

  getMyInternships: async () => {
    const response = await api.get('/internships/my');
    return response.data;
  },

  getInternshipById: async (id) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },

  createInternship: async (internshipData) => {
    const response = await api.post('/internships', internshipData);
    return response.data;
  },

  updateInternship: async (id, internshipData) => {
    const response = await api.put(`/internships/${id}`, internshipData);
    return response.data;
  },

  deleteInternship: async (id) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
  },
};
