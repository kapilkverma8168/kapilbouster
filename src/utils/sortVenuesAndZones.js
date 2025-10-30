/**
 * Utility function to sort zones alphabetically by name within each venue
 * @param {Array} venues - Array of venue objects with zones
 * @returns {Array} - Array of venues with zones sorted alphabetically
 */
export const sortVenuesAndZones = (venues) => {
  if (!Array.isArray(venues)) {
    return venues;
  }

  return venues.map(venue => ({
    ...venue,
    zones: Array.isArray(venue.zones) 
      ? venue.zones.sort((a, b) => {
          // Sort zones alphabetically by name (case-insensitive)
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        })
      : venue.zones
  }));
};

export default sortVenuesAndZones;
