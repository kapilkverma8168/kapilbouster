import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      onPageChange(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center p-0 m-0">
      {/* Page Info */}
      <p className="mb-2">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </p>

      {/* Pagination Buttons */}
      <ul className="pagination pagination-gutter">
        {/* Previous Button */}
        <li
          className={`page-item page-indicator ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            <i className="la la-angle-left"></i>
          </button>
        </li>

        {/* Page Number Buttons */}
        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
          const pageNumber = Math.max(1, currentPage - 5) + i;

          if (pageNumber <= totalPages) {
            return (
              <li
                key={pageNumber}
                className={`page-item ${
                  currentPage === pageNumber ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            );
          }

          return null;
        })}

        {/* Next Button */}
        <li
          className={`page-item page-indicator ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            <i className="la la-angle-right"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;