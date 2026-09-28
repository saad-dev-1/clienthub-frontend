import api from './axios';

export const projectsApi = {
  list: () => api.get('/projects').then((r) => r.data),
  get: (id) => api.get(`/projects/${id}`).then((r) => r.data),
  create: (data) => api.post('/projects', data).then((r) => r.data),
  update: (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/projects/${id}`).then((r) => r.data),
  share: (id) => api.post(`/projects/${id}/share`).then((r) => r.data),
  unshare: (id) => api.delete(`/projects/${id}/unshare`).then((r) => r.data),
  clearFeedback: (id) =>
    api.delete(`/projects/${id}/feedback`).then((r) => r.data),
};