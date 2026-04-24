import api from './api';

export const chatbotService = {
  sendMessage: async (message) => {
    const response = await api.post('/chatbot/message', { message });
    return response.data;
  },

  getConversationHistory: async () => {
    const response = await api.get('/chatbot/history');
    return response.data;
  },

  clearHistory: async () => {
    const response = await api.delete('/chatbot/history');
    return response.data;
  },

  getResumeTips: async (resumeData) => {
    const response = await api.post('/chatbot/resume-tips', resumeData);
    return response.data;
  },

  analyzeCandidateMatch: async (candidateId, internshipId) => {
    const response = await api.post('/chatbot/analyze-match', {
      candidateId,
      internshipId,
    });
    return response.data;
  },
};
