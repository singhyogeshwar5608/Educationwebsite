import api from './api';

export const coursesService = {
  list: (params?: Record<string, any>) => api.get('/admin/courses', { params }).then((r) => r.data),
  show: (id: number) => api.get(`/admin/courses/${id}`).then((r) => r.data),
  create: (data: FormData) => api.post('/admin/courses', data).then((r) => r.data),
  // Laravel/PHP parse multipart FormData only with POST. Update (PUT) therefore uses
  // method spoofing: send POST + `_method: PUT`, which Laravel maps back to PUT.
  update: (id: number, data: FormData) => {
    const fd = new FormData()
    data.forEach((value, key) => fd.append(key, value))
    fd.append('_method', 'PUT')
    return api.post(`/admin/courses/${id}`, fd).then((r) => r.data)
  },
  delete: (id: number) => api.delete(`/admin/courses/${id}`).then((r) => r.data),
  categories: {
    list: () => api.get('/admin/course-categories').then((r) => r.data),
    create: (data: any) => api.post('/admin/course-categories', data).then((r) => r.data),
    update: (id: number, data: any) => api.put(`/admin/course-categories/${id}`, data).then((r) => r.data),
    delete: (id: number) => api.delete(`/admin/course-categories/${id}`).then((r) => r.data),
  },
  subjects: {
    list: (courseId?: number) => api.get('/admin/subjects', { params: { course_id: courseId } }).then((r) => r.data),
    create: (data: any) => api.post('/admin/subjects', data).then((r) => r.data),
    update: (id: number, data: any) => api.put(`/admin/subjects/${id}`, data).then((r) => r.data),
    delete: (id: number) => api.delete(`/admin/subjects/${id}`).then((r) => r.data),
  },
};
