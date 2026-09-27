import api from './axios';

export const tasksApi = {
  listAll: () => api.get('/tasks').then((r) => r.data),
  list: (projectId) =>
    api.get(`/projects/${projectId}/tasks`).then((r) => r.data),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/tasks`, data).then((r) => r.data),
  update: (taskId, data) =>
    api.put(`/tasks/${taskId}`, data).then((r) => r.data),
  delete: (taskId) =>
    api.delete(`/tasks/${taskId}`).then((r) => r.data),
};