import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
};

export const donationAPI = {
  create: (donationData) => api.post('/donations', donationData),
  getAll: () => api.get('/donations'),
  getUserDonations: () => api.get('/donations/user'),
};

export const distributionAPI = {
  create: (distributionData) => api.post('/distributions', distributionData),
  getAll: () => api.get('/distributions'),
  getNgoDistributions: () => api.get('/distributions/ngo'),
};

export default api;
