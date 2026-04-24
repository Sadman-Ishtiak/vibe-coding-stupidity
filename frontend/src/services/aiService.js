import api from './api';

export const aiService = {
  analyzeResume: async (resumeText) => {
    const response = await api.post('/ai/analyze', { resumeText });
    return response.data;
  },
  
  chat: async (message, history) => {
    const response = await api.post('/ai/chat', { message, history });
    return response.data;
  }
};
