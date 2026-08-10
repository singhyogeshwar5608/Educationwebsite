import api from './api';

export const resultsService = {
  list: (params?: Record<string, any>) => api.get('/admin/results', { params }).then((r) => r.data),
  show: (id: number) => api.get(`/admin/results/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/admin/results', data).then((r) => r.data),
  delete: (id: number) => api.delete(`/admin/results/${id}`).then((r) => r.data),
  availableStudents: (params?: Record<string, any>) => api.get('/admin/results/available-students', { params }).then((r) => r.data),
};

export const certificatesService = {
  list: (params?: Record<string, any>) => api.get('/admin/certificates', { params }).then((r) => r.data),
  show: (id: number) => api.get(`/admin/certificates/${id}`).then((r) => r.data),
  issue: (data: any) => api.post('/admin/certificates', data).then((r) => r.data),
  delete: (id: number) => api.delete(`/admin/certificates/${id}`).then((r) => r.data),
  eligibleStudents: (params?: Record<string, any>) => api.get('/admin/certificates/eligible-students', { params }).then((r) => r.data),
};
