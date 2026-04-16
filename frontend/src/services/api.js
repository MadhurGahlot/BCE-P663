import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Default FastAPI port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const assignmentService = {
  upload: (formData) => api.post('/assignments/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  list: () => api.get('/assignments/list'),
  getSimilarity: (assignmentId) => api.get(`/similarity/${assignmentId}`),
};

export default api;