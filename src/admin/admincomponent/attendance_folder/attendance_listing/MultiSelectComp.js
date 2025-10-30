import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Button, ButtonGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";

const MultiSelectButton = ({ options, onSelectionChange, placeholder }) => {
  const [selectedOptions, setSelectedOptions] = useState(["UserType", "Sport", "Gender"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOption = (option) => {
    let updatedSelection;
    if (selectedOptions.includes(option)) {
      updatedSelection = selectedOptions.filter((item) => item !== option);
    } else {
      updatedSelection = [...selectedOptions, option];
    }

    setSelectedOptions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  const selectAll = () => {
    setSelectedOptions(options);
    onSelectionChange(options);
  };

  const deselectAll = () => {
    setSelectedOptions(["UserType", "Sport", "Gender"]);
    onSelectionChange(["UserType", "Sport", "Gender"]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Dropdown
      as={ButtonGroup}
      className="multi-select-dropdown"
      show={dropdownOpen}
      ref={dropdownRef}
    >
      <Button
        variant="secondary"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {"Select Filters"}
      </Button>

      <Dropdown.Toggle
        split
        variant="secondary"
        id="dropdown-split-basic"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      />

      <Dropdown.Menu>
        <Dropdown.Item onClick={selectAll}>Select All</Dropdown.Item>
        <Dropdown.Item onClick={deselectAll}>Deselect All</Dropdown.Item>
        <Dropdown.Divider />
        {options.map((option, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => toggleOption(option)}
            active={selectedOptions.includes(option)}
          >
            {selectedOptions.includes(option) ? "✓ " : ""} {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

MultiSelectButton.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default MultiSelectButton;
