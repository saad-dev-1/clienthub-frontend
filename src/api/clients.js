import api from './axios';

export const clientsApi = {
  list: () => api.get('/clients').then((r) => r.data),
  get: (id) => api.get(`/clients/${id}`).then((r) => r.data),
  create: (data) => api.post('/clients', data).then((r) => r.data),
  update: (id, data) => api.put(`/clients/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/clients/${id}`).then((r) => r.data),
};