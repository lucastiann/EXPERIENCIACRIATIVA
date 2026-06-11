// Cliente HTTP — wrapper em volta do axios.
// O token JWT eh injetado automaticamente em todas as requisicoes.

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('xf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // 401 -> token expirou, limpa
    if (err.response?.status === 401) {
      localStorage.removeItem('xf_token');
      localStorage.removeItem('xf_user');
    }
    return Promise.reject(err);
  }
);

export default api;
