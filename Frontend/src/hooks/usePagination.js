import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for pagination logic
 * @param {Array} data - Data array to paginate
 * @param {number} itemsPerPage - Items per page
 */
export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil((data?.length || 0) / itemsPerPage);
  }, [data, itemsPerPage]);

  const currentData = useMemo(() => {
    if (!data) return [];
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
