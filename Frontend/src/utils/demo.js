/**
 * Demo Utilities
 * Helper functions for demo mode
 */

/**
 * Check if a token is a demo token
 */
export const isDemoToken = (token) => {
  return token && token.startsWith('demo_');
};

/**
 * Log demo mode status
 */
export const logDemoStatus = () => {
  const isDev = import.meta.env.VITE_ENV === 'development';
  const demoEnabled = import.meta.env.VITE_ENABLE_DEMO === 'true';
  
  if (isDev && demoEnabled) {
    console.log(
      '%c🎭 Demo Mode Enabled',
      'background: #FFD700; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    );
    console.log('Quick login credentials available for testing');
  }
};

/**
 * Create demo warning banner (for development UI)
 */
export const createDemoBanner = () => {
  const isDev = import.meta.env.VITE_ENV === 'development';
  const demoEnabled = import.meta.env.VITE_ENABLE_DEMO === 'true';
  
  if (!isDev || !demoEnabled) return null;

  return {
    show: true,
    message: 'Demo Mode Active - Using development credentials',
    type: 'warning',
  };
};
