import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startNewSession = async (adminPhoneNumber) => {
  try {
    const response = await api.post('/sessions', {
      adminPhoneNumber
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deployBot = async (sessionId, phoneNumber) => {
  try {
    const response = await api.post('/deploy', {
      sessionId,
      phoneNumber
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
