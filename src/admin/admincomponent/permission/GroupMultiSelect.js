import React, { useState, useEffect, useRef } from "react";
import "./GroupMultiSelectStyle.css";

const GroupMultiSelect = ({
  allVenuesAndZones,
  setSelectedVenueAndZones,
  selectedVenueAndZones,
  setInfinitySelected,
  editData,
  allZoneChanges = true, // Default to multi-select mode
}) => {
  const venueData = allVenuesAndZones
    ?.map((ent) =>
      ent.zones.map((zone) => ({
        venue: (ent?.name || ent?.venue_name || "").trim().toLowerCase(),
        zone: (zone.name || zone.zone_name || "").trim().toLowerCase(),
        id: zone.id ?? zone.zone_id,
        venueId: ent?.id ?? ent?.venue_id,
      }))
    )
    .flat();

  const [selectedZones, setSelectedZones] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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

  useEffect(() => {
    if (editData && selectedVenueAndZones.length > 0) {
      const allSelectedZones = selectedVenueAndZones
        .flatMap((venue) => venue.Zones)
        .map((zoneId) => zoneId);
      setSelectedZones(allSelectedZones);
    }
  }, [selectedVenueAndZones, editData]);

  const handleSelect = (item) => {
    let newSelectedZones;

    // Always use multi-select mode for better UX
    // Multi-Select Mode - toggle individual zone
    newSelectedZones = selectedZones.includes(item.id)
      ? selectedZones.filter((zoneId) => zoneId !== item.id)
      : [...selectedZones, item.id];

    setSelectedZones(applySelection(newSelectedZones));
  };

  const handleGroupSelect = (venue) => {
    const normalizedVenueName = venue.toLowerCase().trim();
    const venueItems = venueData
      .filter((item) => item.venue.toLowerCase().trim() === normalizedVenueName)
      .map((item) => item.id);

    // Check if all zones in this venue are selected
    const allSelected = venueItems.every((id) => selectedZones.includes(id));
    
    let newSelectedZones;
    if (allSelected) {
      // If all are selected, deselect all zones in this venue
      newSelectedZones = selectedZones.filter((id) => !venueItems.includes(id));
    } else {
      // If not all are selected, select all zones in this venue
      newSelectedZones = [...selectedZones, ...venueItems.filter((id) => !selectedZones.includes(id))];
    }

    setSelectedZones(applySelection(newSelectedZones));
  };

  const handleSelectAll = (e) => {
    e.preventDefault();
    const allItems = venueData.map((item) => item.id);
    const allSelected = allItems.every((id) => selectedZones.includes(id));
    const newSelectedZones = allSelected ? [] : allItems;
    setSelectedZones(applySelection(newSelectedZones));
  };

  const applySelection = (newSelectedZones) => {
    const updatedVenueZones = venueData
      .filter((zone) => newSelectedZones.includes(zone.id))
      .reduce((acc, zone) => {
        const { venueId, id } = zone;
        if (!acc[venueId]) acc[venueId] = [];
        acc[venueId].push(id);
        return acc;
      }, {});

    const formattedVenueZones = Object.keys(updatedVenueZones).map((key) => ({
      venueId: parseInt(key),
      Zones: updatedVenueZones[key],
    }));

    setSelectedVenueAndZones(formattedVenueZones);
    setInfinitySelected(newSelectedZones.length === venueData.length);
    return newSelectedZones;
  };

  const filteredData = venueData.filter(
    (item) =>
      item.zone.includes(filterText.toLowerCase().trim()) ||
      item.venue.includes(filterText.toLowerCase().trim())
  );

  const groupedData = filteredData.reduce((groups, item) => {
    if (!groups[item.venue]) groups[item.venue] = [];
    groups[item.venue].push(item);
    return groups;
  }, {});

  const selectedLabels =
    selectedZones.length === venueData.length
      ? "AVA"
      : venueData
          .filter((item) => selectedZones.includes(item.id))
          .map((item) => `${item.zone} (${item.venue})`)
          .join(", ") || "Select Permit Zone(s)";

  return (
    <div className="custom-dropdown w-100" ref={dropdownRef}>
      <input
        className="dropdown-input"
        type="text"
        readOnly
        value={selectedLabels}
        placeholder="Select Permit Zone(s)"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      />
      {isDropdownOpen && (
        <div className="dropdown-body">
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search Zones or Venues"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <div>
              <button className="select-all-btn" onClick={handleSelectAll}>
                {selectedZones.length === venueData.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          </div>
          <div className="dropdown-list">
            {Object.keys(groupedData).map((venue) => (
              <div key={venue} className="dropdown-group">
                <div className="group-header">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={groupedData[venue].every((item) =>
                        selectedZones.includes(item.id)
                      )}
                      onChange={() => handleGroupSelect(venue)}
                    />
                    {venue}
                  </label>
                </div>
                <div className="group-items">
                  {groupedData[venue].map((item) => (
                    <label
                      key={item.id}
                      className="dropdown-item checkbox-label"
                    >
                      <input
                        type="checkbox"
                        checked={selectedZones.includes(item.id)}
                        onChange={() => handleSelect(item)}
                      />
                      {item.zone}
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

export default GroupMultiSelect;
