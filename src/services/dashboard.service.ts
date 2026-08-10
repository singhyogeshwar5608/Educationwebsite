import api from './api';

export const dashboardService = {
  stats: () => api.get('/admin/dashboard/stats').then((r) => r.data),
  enrollmentTrend: () => api.get('/admin/dashboard/enrollment-trend').then((r) => r.data),
  courseDistribution: () => api.get('/admin/dashboard/course-distribution').then((r) => r.data),
  recentAdmissions: () => api.get('/admin/dashboard/recent-admissions').then((r) => r.data),
  recentActivities: () => api.get('/admin/dashboard/recent-activities').then((r) => r.data),
};
