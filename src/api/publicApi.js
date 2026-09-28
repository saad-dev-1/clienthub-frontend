import axios from 'axios';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const publicProjectsApi = {
  get: (token) =>
    publicApi.get(`/public/projects/${token}`).then((r) => r.data),

  submitFeedback: (token, data) =>
    publicApi
      .post(`/public/projects/${token}/feedback`, data)
      .then((r) => r.data),
};