/**
 * Application Constants
 * Centralized constant values for the application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  STUDENTS: 5 * 60 * 1000,
  TEACHERS: 10 * 60 * 1000,
  DASHBOARD: 2 * 60 * 1000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

// Grade Configuration
export const GRADES = {
  'A+': { min: 90, color: 'text-green-500' },
  'A': { min: 80, color: 'text-green-400' },
  'B': { min: 70, color: 'text-blue-400' },
  'C': { min: 60, color: 'text-yellow-400' },
  'D': { min: 50, color: 'text-orange-400' },
  'F': { min: 0, color: 'text-red-400' },
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// Toast Duration
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  FULL: 'DD MMM YYYY, hh:mm A',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'],
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    STUDENTS: '/admin/students',
    TEACHERS: '/admin/teachers',
    ANALYTICS: '/admin/analytics',
    ATTENDANCE: '/admin/attendance',
    TESTS: '/admin/tests',
    AI_INSIGHTS: '/admin/ai-insights',
    NOTIFICATIONS: '/admin/notifications',
  },
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    STUDENTS: '/teacher/students',
    UPLOAD_MARKS: '/teacher/upload-marks',
    ASSIGNMENTS: '/teacher/assignments',
    LECTURES: '/teacher/lectures',
    TIMETABLE: '/teacher/timetable',
    NOTIFICATIONS: '/teacher/notifications',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    PERFORMANCE: '/student/performance',
    ATTENDANCE: '/student/attendance',
    TESTS: '/student/tests',
    ASSIGNMENTS: '/student/assignments',
    PROGRESS: '/student/progress',
    NOTIFICATIONS: '/student/notifications',
  },
};

export default {
  API_CONFIG,
  CACHE_CONFIG,
  PAGINATION,
  ROLES,
  GRADES,
  ATTENDANCE_STATUS,
  NOTIFICATION_TYPES,
  TOAST_DURATION,
  DATE_FORMATS,
  FILE_UPLOAD,
  ROUTES,
};
