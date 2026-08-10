import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  // No default Content-Type: axios sets 'application/json' automatically for JSON
  // objects, and leaves FormData unset so the browser adds the correct
  // multipart boundary (a forced 'multipart/form-data' header omits the boundary).
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin')) {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
