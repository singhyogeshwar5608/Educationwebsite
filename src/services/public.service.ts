import api from './api';

export const publicService = {
  courses: {
    list: (params?: Record<string, any>) => api.get('/courses', { params }).then((r) => r.data),
    show: (slug: string) => api.get(`/courses/${slug}`).then((r) => r.data),
  },
  categories: {
    list: () => api.get('/course-categories').then((r) => r.data),
  },
  results: {
    search: (registrationNumber: string) => api.get('/results/search', { params: { registration_number: registrationNumber } }).then((r) => r.data),
  },
  certificates: {
    verify: (registrationNumber: string) => api.get('/certificates/verify', { params: { registration_number: registrationNumber } }).then((r) => r.data),
  },
  enquiries: {
    submit: (data: any) => api.post('/enquiries', data).then((r) => r.data),
  },
  admissions: {
    submit: (data: any) => api.post('/admissions', data).then((r) => r.data),
  },
  gallery: {
    list: (params?: Record<string, any>) => api.get('/gallery', { params }).then((r) => r.data),
  },
};
