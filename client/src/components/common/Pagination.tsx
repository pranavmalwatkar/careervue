import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Settings } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showJumpToPage?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showJumpToPage = true
}) => {
  const [jumpToPage, setJumpToPage] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpToPage('');
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // if (totalPages <= 1) return null;

  return (
    <div className="mt-8 space-y-4">
      {/* Items Info and Page Size Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
        
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Jump to Page */}
        {showJumpToPage && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJumpToPage()}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Page"
            />
            <button
              onClick={handleJumpToPage}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go
            </button>
          </div>
        )}

        {/* Pagination Navigation */}
        <div className="flex items-center space-x-1">
          {/* First Page Button */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`p-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>

        {/* Page Info */}
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Mobile Optimized Pagination */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}; 