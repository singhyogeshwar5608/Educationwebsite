import api from './api';

export const enquiriesService = {
  list: (params?: Record<string, any>) => api.get('/admin/enquiries', { params }).then((r) => r.data),
  show: (id: number) => api.get(`/admin/enquiries/${id}`).then((r) => r.data),
  updateStatus: (id: number, status: string) => api.put(`/admin/enquiries/${id}/status`, { status }).then((r) => r.data),
  delete: (id: number) => api.delete(`/admin/enquiries/${id}`).then((r) => r.data),
};
