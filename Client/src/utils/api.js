import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ───────────────────────────────────────────────
export const loginAdmin = (data) => API.post('/admin/login', data);

// ─── News ────────────────────────────────────────────────
export const getAllNews = (page = 1, limit = 10) =>
  API.get(`/news?page=${page}&limit=${limit}`);

export const getSingleNews = (id) => API.get(`/news/${id}`);

export const searchNews = (q) => API.get(`/news/search?q=${q}`);

export const getNewsByCategory = (category) =>
  API.get(`/news/category/${category}`);

export const createNews = (formData) =>
  API.post('/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateNews = (id, data) => API.put(`/news/${id}`, data);

export const deleteNews = (id) => API.delete(`/news/${id}`);

export default API;
