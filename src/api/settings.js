import api from './axios';

export const settingsApi = {
  updateProfile: (data) =>
    api.put('/settings/profile', data).then((r) => r.data),
  updatePassword: (data) =>
    api.put('/settings/password', data).then((r) => r.data),
};