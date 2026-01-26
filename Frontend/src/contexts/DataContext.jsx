import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState({});

  // Generic cache setter
  const setCachedData = useCallback((key, data) => {
    setCache((prev) => ({ ...prev, [key]: { data, timestamp: Date.now() } }));
  }, []);

  // Generic cache getter with expiry
  const getCachedData = useCallback((key, maxAge = 5 * 60 * 1000) => {
    const cached = cache[key];
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      // Cache expired
      return null;
    }

    return cached.data;
  }, [cache]);

  // Clear specific cache
  const clearCache = useCallback((key) => {
    setCache((prev) => {
      const newCache = { ...prev };
      delete newCache[key];
      return newCache;
    });
  }, []);

  // Clear all cache
  const clearAllCache = useCallback(() => {
    setCache({});
  }, []);

  // Set loading state for specific key
  const setLoadingState = useCallback((key, isLoading) => {
    setLoading((prev) => ({ ...prev, [key]: isLoading }));
  }, []);

  const value = useMemo(
    () => ({
      cache,
      loading,
      setCachedData,
      getCachedData,
      clearCache,
      clearAllCache,
      setLoadingState,
    }),
    [cache, loading, setCachedData, getCachedData, clearCache, clearAllCache, setLoadingState]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
