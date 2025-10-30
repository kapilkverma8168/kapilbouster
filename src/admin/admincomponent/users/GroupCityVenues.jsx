import React, { useState, useEffect, useRef, useMemo } from "react";
import "./GroupCityStyles.css";

const GroupCityVenues = ({
  allCitiesAndVenues,
  setSelectedVenueIds,
  setInfinitySelected,
  selectedVenueIdsState,
  setSelectedVenueIdsState
}) => {
  // Memoize venueData to prevent recalculation on every render
  const venueData = useMemo(() => {
    return allCitiesAndVenues?.flatMap((ent) =>
      ent.venues?.map((venue) => ({
        venue: venue.venue_name,
        city: ent.city.name,
        venueId: venue.venue_id,
      }))
    );
  }, [allCitiesAndVenues]);

  
  const [filterText, setFilterText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update parent state when selectedVenueIdsState changes
  useEffect(() => {
    setSelectedVenueIds(selectedVenueIdsState);
    setInfinitySelected(selectedVenueIdsState.length === venueData.length);
  }, [selectedVenueIdsState, setSelectedVenueIds, setInfinitySelected, venueData.length]);

  const handleSelect = (venueId) => {
    setSelectedVenueIdsState((prev) =>
      prev.includes(venueId)
        ? prev.filter((id) => id !== venueId)
        : [...prev, venueId]
    );
  };

  const handleGroupSelect = (city) => {
    const cityVenueIds = venueData
      .filter((item) => item.city === city)
      .map((item) => item.venueId);
    const allSelected = cityVenueIds.every((id) =>
      selectedVenueIdsState.includes(id)
    );

    setSelectedVenueIdsState((prev) =>
      allSelected
        ? prev.filter((id) => !cityVenueIds.includes(id))
        : [...prev, ...cityVenueIds.filter((id) => !prev.includes(id))]
    );
  };

  const handleSelectAll = (e) => {
    e.preventDefault();
    const allVenueIds = venueData.map((item) => item.venueId);
    const allSelected = allVenueIds.every((id) =>
      selectedVenueIdsState.includes(id)
    );

    setSelectedVenueIdsState(allSelected ? [] : allVenueIds);
  };

  const filteredData = venueData?.filter(
    (item) =>
      item.city.toLowerCase().includes(filterText.toLowerCase()) ||
      item.venue.toLowerCase().includes(filterText.toLowerCase())
  );

  const groupedData = filteredData?.reduce((groups, item) => {
    if (!groups[item.city]) groups[item.city] = [];
    groups[item.city].push(item);
    return groups;
  }, {});

  const selectedLabels =
    selectedVenueIdsState.length === venueData.length
      ? "AVA"
      : venueData
          .filter((item) => selectedVenueIdsState.includes(item.venueId))
          .map((item) => `${item.venue} (${item.city})`)
          .join(", ");

  return (
    <div className="custom-dropdown w-100" ref={dropdownRef}>
      <input
        className="dropdown-input"
        type="text"
        readOnly
        value={selectedLabels}
        placeholder="Select Venue(s)"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      />
      {isDropdownOpen && (
        <div className="dropdown-body">
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search Cities or Venues"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <div>
              <button className="select-all-btn" onClick={handleSelectAll}>
                {selectedVenueIdsState.length === venueData.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          </div>
          <div className="dropdown-list">
            {Object.keys(groupedData).map((city) => (
              <div key={city} className="dropdown-group">
                <div className="group-header">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={groupedData[city].every((item) =>
                        selectedVenueIdsState.includes(item.venueId)
                      )}
                      onChange={() => handleGroupSelect(city)}
                    />
                    {city}
                  </label>
                </div>
                <div className="group-items">
                  {groupedData[city].map((item) => (
                    <label
                      key={item.venueId}
                      className="dropdown-item checkbox-label"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVenueIdsState.includes(item.venueId)}
                        onChange={() => handleSelect(item.venueId)}
                      />
                      {item.venue}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCityVenues;
