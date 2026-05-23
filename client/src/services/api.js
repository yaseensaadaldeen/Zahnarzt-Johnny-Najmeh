import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('dentistToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const appointmentsApi = {
  getPublic: async () => (await api.get('/appointments/public')).data,
  getTimeslots: async (date) => (await api.get(`/appointments/timeslots?date=${date}`)).data,
  getAll: async (params = {}) => (await api.get('/appointments', { params })).data,
  create: async (payload) => (await api.post('/appointments', payload)).data,
  update: async (id, payload) => (await api.put(`/appointments/${id}`, payload)).data,
  delete: async (id) => (await api.delete(`/appointments/${id}`)).data,
  updateStatus: async (id, status) => (await api.patch(`/appointments/${id}/status`, { status })).data,
  bulkDelete: async (ids) => (await api.post('/appointments/bulk-delete', { ids })).data,
  bulkApprove: async (ids) => (await api.post('/appointments/bulk-approve', { ids })).data,
};

export const settingsApi = {
  get: async () => (await api.get('/settings')).data,
  update: async (payload) => (await api.put('/settings', payload)).data,
};

export const authApi = {
  verifyDentistCode: async (code) => (await api.post('/auth/dentist-code', { code })).data,
  verify: async () => (await api.post('/auth/verify', { token: sessionStorage.getItem('dentistToken') })).data,
};

let availabilityCache = null;

export const availabilityApi = {
  get: async () => {
    try {
      const data = (await api.get('/availability')).data;
      availabilityCache = data;
      return data;
    } catch (err) {
      if (availabilityCache) return availabilityCache;
      throw err;
    }
  },
  updateWeekly: async (weeklyShifts) => (await api.put('/availability/weekly', { weeklyShifts })).data,
  addOutTime: async (payload) => (await api.post('/availability/out-times', payload)).data,
  updateOutTime: async (id, payload) => (await api.put(`/availability/out-times/${id}`, payload)).data,
  deleteOutTime: async (id) => (await api.delete(`/availability/out-times/${id}`)).data,
};

export const contactApi = {
  send: async (payload) => (await api.post('/contact', payload)).data,
};

export default api;
