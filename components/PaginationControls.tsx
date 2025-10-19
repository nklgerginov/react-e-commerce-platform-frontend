import React, { useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages: (number | string)[] = [];
    
    // Always show page 1
    pages.push(1);
    
    // Show ellipsis if current page is far from the start
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show pages around the current page
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Show ellipsis if current page is far from the end
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show the last page
    pages.push(totalPages);

    return pages;

  }, [currentPage, totalPages]);


  return (
    <nav className="flex items-center justify-center space-x-2 mt-10" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {pageNumbers.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
              currentPage === page
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-gray-700 dark:border-indigo-400 dark:text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default PaginationControls;