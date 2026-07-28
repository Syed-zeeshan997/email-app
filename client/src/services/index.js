import API from './api';

export const authService = {
  register: (data) => API.post('/register', data),
  login: (data) => API.post('/login', data),
  logout: () => API.post('/logout'),
  forgotPassword: (email) => API.post('/forgot-password', { email }),
  resetPassword: (token, data) => API.post(`/reset-password/${token}`, data),
  verifyEmail: (token) => API.get(`/verify-email/${token}`),
  getMe: () => API.get('/me'),
};

export const userService = {
  getProfile: () => API.get('/profile'),
  updateProfile: (formData) =>
    API.put('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  changePassword: (data) => API.put('/change-password', data),
  deleteAccount: (password) => API.delete('/account', { data: { password } }),
};

export const emailService = {
  sendEmail: (formData) =>
    API.post('/send-email', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getSentMails: (params) => API.get('/sent-mails', { params }),
  getMailById: (id) => API.get(`/mail/${id}`),
};

export const adminService = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  updateUserStatus: (id, suspended) =>
    API.put(`/admin/users/${id}/status`, { suspended }),
  getEmailLogs: (params) => API.get('/admin/emails', { params }),
};
