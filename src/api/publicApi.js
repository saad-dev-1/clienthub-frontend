import axios from 'axios';

const publicApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const publicProjectsApi = {
  get: (token) =>
    publicApi.get(`/public/projects/${token}`).then((r) => r.data),
};
