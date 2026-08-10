import api from './api';

export const galleryService = {
  list: (params?: Record<string, any>) => api.get('/admin/gallery', { params }).then((r) => r.data),
  create: (formData: FormData) => api.post('/admin/gallery', formData).then((r) => r.data),
  update: (id: number, data: any) => api.put(`/admin/gallery/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/admin/gallery/${id}`).then((r) => r.data),
  albums: () => api.get('/admin/gallery/albums').then((r) => r.data),
  createAlbum: (name: string) => api.post('/admin/gallery/albums', { name }).then((r) => r.data),
};

export const settingsService = {
  get: () => api.get('/admin/settings').then((r) => r.data),
  updateInstitute: (data: any) => api.put('/admin/settings/institute', data).then((r) => r.data),
  updateNotifications: (data: any) => api.put('/admin/settings/notifications', data).then((r) => r.data),
  backup: () => api.post('/admin/system/backup').then((r) => r.data),
  clearCache: () => api.post('/admin/system/cache-clear').then((r) => r.data),
};

export const uploadService = {
  upload: (file: File, folder = 'general') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    return api.post('/admin/upload', fd).then((r) => r.data);
  },
};
