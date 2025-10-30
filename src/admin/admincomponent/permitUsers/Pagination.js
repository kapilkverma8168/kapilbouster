import React from "react";

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      onPageChange(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate the range of items being displayed
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="d-flex justify-content-between align-items-center p-0 mt-5">
      {/* Items Count Info - Left side */}
      <div className="d-flex align-items-center">
        {totalItems > 0 && (
          <span className="text-muted">
            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> entries
          </span>
        )}
      </div>

      {/* Pagination Buttons - Right side */}
      <ul className="pagination pagination-gutter mb-0">
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
            Previous
          </button>
        </li>

        {/* Page Number Buttons */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNumber;
          
          if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            pageNumber = i + 1;
          } else {
            // Show pages around current page
            if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }
          }

          if (pageNumber <= totalPages && pageNumber >= 1) {
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
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;