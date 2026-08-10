import api from './api';

export const studentsService = {
  list: (params?: Record<string, any>) => api.get('/admin/students', { params }).then((r) => r.data),
  show: (id: number) => api.get(`/admin/students/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/admin/students', data).then((r) => r.data),
  update: (id: number, data: any) => api.put(`/admin/students/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/admin/students/${id}`).then((r) => r.data),
};

export const admissionsService = {
  list: (params?: Record<string, any>) => api.get('/admin/admissions', { params }).then((r) => r.data),
  create: (data: any) => api.post('/admin/admissions', data).then((r) => r.data),
  show: (id: number) => api.get(`/admin/admissions/${id}`).then((r) => r.data),
  updateStatus: (id: number, status: string) => api.put(`/admin/admissions/${id}/status`, { status }).then((r) => r.data),
  delete: (id: number) => api.delete(`/admin/admissions/${id}`).then((r) => r.data),
};
