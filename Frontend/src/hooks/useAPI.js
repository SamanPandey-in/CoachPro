import { useState, useEffect, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

/**
 * Custom hook for API calls with loading, error, and caching
 * @param {Function} apiFunction - API function to call
 * @param {string} cacheKey - Key for caching (optional)
 * @param {Object} options - Configuration options
 */
export const useAPI = (apiFunction, cacheKey = null, options = {}) => {
  const {
    immediate = false,
    showErrorToast = true,
    cacheTime = 5 * 60 * 1000,
    dependencies = [],
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { getCachedData, setCachedData } = useData();
  const { showToast } = useToast();

  const execute = useCallback(async (...args) => {
    // Check cache first
    if (cacheKey) {
      const cached = getCachedData(cacheKey, cacheTime);
      if (cached) {
        setData(cached);
        return cached;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      const responseData = result.data || result;
      
      setData(responseData);
      
      // Cache the result
      if (cacheKey) {
        setCachedData(cacheKey, responseData);
      }

      return responseData;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorToast) {
        showToast('error', errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, cacheKey, cacheTime, getCachedData, setCachedData, showErrorToast, showToast]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, ...dependencies]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
  };
};
