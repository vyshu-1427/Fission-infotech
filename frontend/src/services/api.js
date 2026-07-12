import axios from 'axios';

const api = axios.create({
  // Use the live backend URL in production, otherwise use the env var or fallback to localhost for local dev
  baseURL: import.meta.env.PROD 
    ? 'https://backend-pied-iota-10.vercel.app/api' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token automatically into every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
