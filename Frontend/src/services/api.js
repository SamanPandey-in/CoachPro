import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ message, error });
  }
);

// API Methods with retry logic
const createAPIMethod = (method) => async (url, data, config = {}) => {
  const { retry = 0, retryDelay = 1000 } = config;
  
  for (let i = 0; i <= retry; i++) {
    try {
      return await api[method](url, data, config);
    } catch (error) {
      if (i === retry) throw error;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => Promise.resolve(), // Client-side only
};

// ==================== STUDENT API ====================
export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  
  // Analytics methods
  getPerformance: (id) => api.get(`/students/${id}/performance`),
  getAttendance: (id) => api.get(`/students/${id}/attendance`),
};

// ==================== TEACHER API ====================
export const teacherAPI = {
  getAll: () => api.get('/teachers'),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
};

// ==================== ATTENDANCE API ====================
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  bulkCreate: (data) => api.post('/attendance/bulk', data),
};

// ==================== TEST API ====================
export const testAPI = {
  getAll: (params) => api.get('/tests', { params }),
  getById: (id) => api.get(`/tests/${id}`),
  create: (data) => api.post('/tests', data),
  update: (id, data) => api.put(`/tests/${id}`, data),
  delete: (id) => api.delete(`/tests/${id}`),
  publish: (id) => api.put(`/tests/${id}/publish`),
};

// ==================== MARKS API ====================
export const markAPI = {
  getAll: (params) => api.get('/marks', { params }),
  create: (data) => api.post('/marks', data),
  update: (id, data) => api.put(`/marks/${id}`, data),
  bulkCreate: (data) => api.post('/marks/bulk', data),
};

// ==================== LECTURE API ====================
export const lectureAPI = {
  getAll: (params) => api.get('/lectures', { params }),
  getById: (id) => api.get(`/lectures/${id}`),
  create: (data) => api.post('/lectures', data),
  update: (id, data) => api.put(`/lectures/${id}`, data),
  delete: (id) => api.delete(`/lectures/${id}`),
  markComplete: (id) => api.put(`/lectures/${id}/complete`),
};

// ==================== ASSIGNMENT API ====================
export const assignmentAPI = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// ==================== FEEDBACK API ====================
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  create: (data) => api.post('/feedback', data),
  markAsRead: (id) => api.put(`/feedback/${id}/read`),
};

// ==================== NOTIFICATION API ====================
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  create: (data) => api.post('/notifications', data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;
