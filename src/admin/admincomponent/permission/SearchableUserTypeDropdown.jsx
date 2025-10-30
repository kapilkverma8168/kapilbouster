import React, { useState, useRef, useEffect } from "react";

// Add CSS for rotation animation
const rotationStyle = `
  .rotate-180 {
    transform: rotate(180deg) !important;
  }
`;

// Inject the style
if (typeof document !== 'undefined' && !document.getElementById('searchable-dropdown-styles')) {
  const style = document.createElement('style');
  style.id = 'searchable-dropdown-styles';
  style.textContent = rotationStyle;
  document.head.appendChild(style);
}

const SearchableUserTypeDropdown = ({ 
  userTypes = [], 
  value, 
  onChange, 
  placeholder = "Select User Type",
  required = false,
  disabled = false,
  className = "form-select select-brand w-100"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTypes, setFilteredTypes] = useState(userTypes);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter user types based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTypes(userTypes);
    } else {
      const filtered = userTypes.filter(type =>
        type.sub_category_name_view.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTypes(filtered);
    }
    setHighlightedIndex(-1); // Reset highlight when filtering
  }, [searchTerm, userTypes]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    }
  };

  const handleSelect = (type) => {
    onChange(type.sub_category_id);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredTypes.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredTypes.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredTypes[highlightedIndex]);
    }
  };

  const selectedType = userTypes.find(type => String(type.sub_category_id) === String(value));
  
  console.log("SearchableUserTypeDropdown - value:", value, "selectedType:", selectedType, "userTypes:", userTypes);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <div
        className={`form-control form-control-sm ${isOpen ? "show" : ""}`}
        onClick={handleToggle}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: disabled ? "#e9ecef" : "#fff",
          opacity: disabled ? 0.65 : 1,
          height: "31px",
          position: "relative",
          paddingRight: "30px",
          fontSize: "0.875rem",
          lineHeight: "1.5"
        }}
      >
        <span style={{ 
          color: selectedType ? "#000" : "#6c757d",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1
        }}>
          {selectedType ? selectedType.sub_category_name_view : placeholder}
        </span>
        <div style={{ 
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none"
        }}>
          <i className={`fas fa-chevron-down ${isOpen ? "rotate-180" : ""}`} 
             style={{ 
               fontSize: "10px",
               color: "#6c757d",
               transition: "transform 0.2s ease"
             }}></i>
        </div>
      </div>

      {isOpen && (
        <div
          className="position-absolute w-100 border border-top-0 rounded-bottom"
          style={{
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
            boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
            maxHeight: "300px",
            overflow: "hidden"
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-bottom bg-light">
            <div className="position-relative">
              <input
                ref={searchInputRef}
                type="text"
                className="form-control form-control-sm"
                placeholder="Search user types..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                style={{ 
                  fontSize: "0.875rem",
                  paddingLeft: "28px"
                }}
              />
              <i className="fas fa-search position-absolute" 
                 style={{
                   left: "8px",
                   top: "50%",
                   transform: "translateY(-50%)",
                   color: "#6c757d",
                   fontSize: "12px"
                 }}></i>
            </div>
          </div>

          {/* Options List */}
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {filteredTypes.length > 0 ? (
              <>
                {/* Show total count */}
                <div className="px-3 py-2 small text-muted bg-light border-bottom">
                  {searchTerm ? `Found ${filteredTypes.length} user type${filteredTypes.length !== 1 ? 's' : ''}` : `All ${filteredTypes.length} user types`}
                </div>
                {filteredTypes.map((type, index) => {
                  const isSelected = value === type.sub_category_id;
                  const isHighlighted = index === highlightedIndex;
                  
                  return (
                    <div
                      key={type.sub_category_id}
                      className={`px-3 py-2 d-flex align-items-center ${isSelected ? 'bg-primary text-white' : isHighlighted ? 'bg-light' : ''}`}
                      onClick={() => handleSelect(type)}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        transition: "background-color 0.2s ease",
                        minHeight: "36px",
                        borderBottom: "1px solid #f8f9fa"
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected && !isHighlighted) {
                          e.target.style.backgroundColor = "#f8f9fa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected && !isHighlighted) {
                          e.target.style.backgroundColor = "transparent";
                        }
                      }}
                      onMouseMove={() => setHighlightedIndex(index)}
                    >
                      <span className="flex-grow-1">{type.sub_category_name_view}</span>
                      {isSelected && (
                        <i className="fas fa-check text-white"></i>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="px-3 py-4 text-center text-muted small">
                <div className="mb-2">
                  <i className="fas fa-search" style={{ opacity: 0.5, fontSize: "18px" }}></i>
                </div>
                No user types found
                {searchTerm && (
                  <div className="small mt-1">
                    Try a different search term
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableUserTypeDropdown;
