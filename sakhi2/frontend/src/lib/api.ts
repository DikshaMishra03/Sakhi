// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sakhi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sakhi_token');
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/me', data),
  getUserProfile: (id: string) => api.get(`/auth/users/${id}`),
  toggleFollow: (id: string) => api.post(`/auth/follow/${id}`),
};

// ── Skills ────────────────────────────────────────────────────
export const skillsApi = {
  getAll: (params?: any) => api.get('/skills', { params }),
  getFeatured: () => api.get('/skills/featured'),
  getById: (id: string) => api.get(`/skills/${id}`),
  create: (data: any) => api.post('/skills', data),
  update: (id: string, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
  toggleSave: (id: string) => api.post(`/skills/${id}/save`),
  getSaved: () => api.get('/skills/saved'),
  search: (q: string) => api.get('/skills/search', { params: { q } }),
  getCategories: () => api.get('/skills/categories'),
  getStats: () => api.get('/skills/stats'),
  addComment: (id: string, body: string) => api.post(`/skills/${id}/comments`, { body }),
  deleteComment: (skillId: string, commentId: string) => api.delete(`/skills/${skillId}/comments/${commentId}`),
  // Voice notes
  getVoiceNotes: (skillId: string) => api.get(`/skills/${skillId}/voice`),
  uploadVoiceNote: (skillId: string, formData: FormData) =>
    api.post(`/skills/${skillId}/voice`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ── Analytics ─────────────────────────────────────────────────
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getMyAnalytics: () => api.get('/analytics/my'),
  getSkillAnalytics: (id: string) => api.get(`/analytics/skills/${id}`),
};

// ── Voice ─────────────────────────────────────────────────────
export const voiceApi = {
  getStreamUrl: (id: string) => `/api/voice/${id}/stream`,
  delete: (id: string) => api.delete(`/voice/${id}`),
};

export default api;
