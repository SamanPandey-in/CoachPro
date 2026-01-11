/**
 * Demo Credentials Configuration
 * 
 * IMPORTANT: This file contains demo credentials for development/testing only.
 * These credentials are checked BEFORE making API calls when VITE_ENABLE_DEMO=true
 * 
 * Production Deployment:
 * - Set VITE_ENABLE_DEMO=false in production environment
 * - Or delete this file entirely
 */

export const isDemoEnabled = () => {
  return import.meta.env.VITE_ENABLE_DEMO === 'true' && 
         import.meta.env.VITE_ENV === 'development';
};

export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@coachpro.com',
    password: 'admin123',
    user: {
      id: 1,
      name: 'Admin User',
      email: 'admin@coachpro.com',
      role: 'admin',
      phone: '+1234567890',
    },
    token: 'demo_admin_token_' + Date.now(),
  },
  teacher: {
    email: 'sarah.johnson@coachpro.com',
    password: 'teacher123',
    user: {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@coachpro.com',
      role: 'teacher',
      phone: '+1234567891',
      teacherId: 1,
      employeeId: 'TCH001',
      subject: 'Mathematics',
    },
    token: 'demo_teacher_token_' + Date.now(),
  },
  student: {
    email: 'rahul.sharma@coachpro.com',
    password: 'student123',
    user: {
      id: 3,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@coachpro.com',
      role: 'student',
      phone: '+1234567892',
      studentId: 1,
      rollNumber: 'STD001',
      batch: 'Batch A',
    },
    token: 'demo_student_token_' + Date.now(),
  },
};

/**
 * Get demo credentials by email and password
 */
export const getDemoCredentials = (email, password) => {
  if (!isDemoEnabled()) {
    return null;
  }

  const normalizedEmail = email.toLowerCase().trim();
  
  for (const [role, creds] of Object.entries(DEMO_CREDENTIALS)) {
    if (creds.email === normalizedEmail && creds.password === password) {
      console.log('🎭 Demo Mode: Logging in as', role);
      return {
        token: creds.token,
        user: creds.user,
      };
    }
  }
  
  return null;
};

/**
 * Get demo credentials by role (for quick login)
 */
export const getDemoCredentialsByRole = (role) => {
  if (!isDemoEnabled()) {
    return null;
  }

  const creds = DEMO_CREDENTIALS[role];
  if (!creds) {
    return null;
  }

  console.log('🎭 Demo Mode: Quick login as', role);
  return {
    token: creds.token,
    user: creds.user,
  };
};
