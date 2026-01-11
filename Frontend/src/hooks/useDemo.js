import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isDemoEnabled, getDemoCredentialsByRole, DEMO_CREDENTIALS } from '../config/demo.config';

/**
 * Custom hook for demo login functionality
 * Only works when VITE_ENABLE_DEMO=true and VITE_ENV=development
 */
export const useDemo = () => {
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();

  const handleDemoLogin = useCallback(async (role) => {
    if (!isDemoEnabled()) {
      console.warn('Demo mode is not enabled');
      return { success: false, error: 'Demo mode not available' };
    }

    try {
      const demoData = getDemoCredentialsByRole(role);
      
      if (!demoData) {
        return { success: false, error: 'Invalid demo role' };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Store in localStorage (same as real auth)
      localStorage.setItem('token', demoData.token);
      localStorage.setItem('user', JSON.stringify(demoData.user));

      // Update auth context
      if (updateAuthState) {
        updateAuthState(demoData.user, demoData.token);
      }

      // Navigate to dashboard
      navigate(`/${role}/dashboard`);

      return { success: true, user: demoData.user };
    } catch (error) {
      console.error('Demo login error:', error);
      return { success: false, error: error.message };
    }
  }, [navigate, updateAuthState]);

  const getDemoEmailByRole = useCallback((role) => {
    const creds = DEMO_CREDENTIALS[role];
    return creds?.email || '';
  }, []);

  return {
    isDemoEnabled: isDemoEnabled(),
    handleDemoLogin,
    getDemoEmailByRole,
    demoCredentials: isDemoEnabled() ? DEMO_CREDENTIALS : null,
  };
};
