"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  const handlePrev = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      data-testid="pagination-controls"
      className="flex items-center justify-between border-t border-zinc-800/80 px-4 py-6 sm:px-6"
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrev}
          disabled={isFirstPage}
          data-testid="prev-page-btn-mobile"
          className={`relative inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors ${
            isFirstPage
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-zinc-800 hover:text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-sm font-medium text-zinc-400 self-center">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={handleNext}
          disabled={isLastPage}
          data-testid="next-page-btn-mobile"
          className={`relative ml-3 inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors ${
            isLastPage
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-zinc-800 hover:text-white"
          }`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-400" data-testid="pagination-indicator">
            Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
            <span className="font-semibold text-white">{totalPages || 1}</span>
          </p>
        </div>
        
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-2"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrev}
              disabled={isFirstPage}
              data-testid="prev-page-btn"
              className={`inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400 transition-colors ${
                isFirstPage
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            <button
              onClick={handleNext}
              disabled={isLastPage}
              data-testid="next-page-btn"
              className={`inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400 transition-colors ${
                isLastPage
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
