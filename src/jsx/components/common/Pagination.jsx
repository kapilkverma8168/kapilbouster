import React from "react";
import { Button } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange, pageWindow = 2 }) => {
  if (!totalPages || totalPages <= 1) return null;

  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const start = Math.max(1, currentPage - pageWindow);
  const end = Math.min(totalPages, currentPage + pageWindow);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="pagination-controls d-flex align-items-center justify-content-end gap-2 mt-3">
      <Button
        variant="outline-primary"
        disabled={currentPage === 1}
        onClick={handlePreviousPage}
        className="px-3"
      >
        Previous
      </Button>

      {/* {start > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? "primary" : "light"}
            className="px-3"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {start > 2 && <span className="text-muted">…</span>}
        </>
      )} */}

      {/* {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "primary" : "light"}
          className="px-3"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))} */}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-muted">…</span>}
          <Button
            variant={currentPage === totalPages ? "primary" : "light"}
            className="px-3"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline-primary"
        disabled={currentPage === totalPages}
        onClick={handleNextPage}
        className="px-3"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
