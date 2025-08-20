import { useState, useCallback } from 'react';

interface UsePaginationProps {
  totalCount: number;
  initialPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

export const usePagination = ({ 
  totalCount, 
  initialPageSize = 100,
  onPageChange 
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    onPageChange?.(newPage, pageSize);
  }, [totalPages, pageSize, onPageChange]);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    onPageChange?.(1, newPageSize);
  }, [onPageChange]);

  const goToFirstPage = useCallback(() => goToPage(1), [goToPage]);
  const goToLastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);
  const goToPreviousPage = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);
  const goToNextPage = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    startIndex,
    endIndex,
    goToPage,
    changePageSize,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};