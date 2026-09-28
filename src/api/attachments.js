import api from './axios';

export const attachmentsApi = {
  list: (projectId) =>
    api.get(`/projects/${projectId}/attachments`).then((r) => r.data),

  upload: (projectId, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return api
      .post(`/projects/${projectId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percent);
          }
        },
      })
      .then((r) => r.data);
  },

  delete: (attachmentId) =>
    api.delete(`/attachments/${attachmentId}`).then((r) => r.data),

  downloadUrl: (attachmentId) =>
    `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/attachments/${attachmentId}/download`,
};