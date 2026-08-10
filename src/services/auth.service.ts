import api from './api';

export const authService = {
  login: (email: string, password: string, rememberMe = false) =>
    api.post('/admin/auth/login', { email, password, remember_me: rememberMe }).then((r) => r.data),

  logout: () => api.post('/admin/auth/logout').then((r) => r.data),

  user: () => api.get('/admin/auth/user').then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/admin/auth/password', { current_password: currentPassword, new_password: newPassword, new_password_confirmation: newPassword }).then((r) => r.data),
};
