import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // For navigation
import swal from "sweetalert";
import axiosInstance from "../../../../services/AxiosInstance";
import ZoneModal from "./zonesModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";

const ZoneList = ({
  venueId,
  fetchZones,
  zones,
  setZones,
  totalPages,
  activePage,
  setActivePage,
}) => {
  const [venueName, setVenueName] = useState("Unknown"); // State for venue name
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const [itemsPerPage] = useState(10);

  const handleClose = () => {
    setShowZoneModal(false);
    setEditData(null);
  };

  const handleShow = () => setShowZoneModal(true);

  const handleDeleteConfirm = async (zoneId) => {
    try {
      const result = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this zone!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (result) {
        try {
          await axiosInstance.delete(`/zones/${zoneId}`);
          swal("Zone Deleted!", "", "success");
          fetchVenueDetails(); // Refresh venue details and zones
        } catch (error) {
          console.error("Error deleting zone:", error);
          swal("Error!", "Failed to delete the zone.", "error");
        }
      }
    } catch (error) {
      console.error("Error in delete confirmation:", error);
    }
  };

  const fetchVenueDetails = async () => {
    try {
      const response = await axiosInstance.get(`/venue/${venueId}/zones`);
      const venueData = response.data?.data;
      setVenueName(venueData?.name || "Unknown"); // Set the venue name dynamically
      setZones(venueData?.zones || []);
    } catch (error) {
      console.error("Error fetching venue details:", error);
      swal("Error!", "Failed to fetch venue details.", "error");
    }
  };

  useEffect(() => {
    fetchVenueDetails();
  }, [venueId]);

  useEffect(() => {
    fetchZones();
  }, [activePage, venueId]);

  const editZone = (zone) => {
    setEditData(zone);
    handleShow();
  };

  const handlePreviousPage = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  return (
    <>
      <div className="col-12">
        <div>
          <div className="card-body">
            {/* Header Section with Venue Name, Back Button, and Add Zones Button */}
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
              <h4 className="mb-0" style={{ fontSize: "16px", fontWeight: 600 }}>
                <span style={{ fontWeight: 700 }}>Venue:</span> {venueName}
              </h4>
              <div>
                <Button
                  variant="light"
                  onClick={() => navigate(-1)}
                  className="me-2 border"
                >
                  Back
                </Button>
                <Button
                  onClick={handleShow}
                >
                  Add Zones
                </Button>
              </div>
            </div>

            {/* Zones Table */}
            <div className="w-100">
              <div className="table-responsive rounded border" style={{ background: "#fff" }}>
              <table className="display w-100 dataTable mb-0">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>Zone Code</th>
                    <th>Zone Name</th>
                    <th>Capacity</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.length > 0 ? (
                    zones.map((zone, index) => (
                      <tr key={zone.id}>
                        <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                        <td>{zone.zone_code}</td>
                        <td>{zone.name}</td>
                        <td>{zone.capacity}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => editZone(zone)}>
                            <HugeiconsIcon icon={PencilEdit02Icon} />
                          </Button>
                        </td>
                        <td>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteConfirm(zone.id)}>
                            <HugeiconsIcon icon={Delete02Icon} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No Zones Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>

              {/* Pagination Controls */}
              <div className="pagination-controls d-flex align-items-center justify-content-end gap-2 mt-3">
                <Button
                  variant="primary"
                  disabled={activePage === 1}
                  onClick={handlePreviousPage}
                  className="px-3"
                >
                  Previous
                </Button>
                {/* {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + activePage - Math.floor((activePage - 1) % 5)
                )
                  .filter((page) => page > 0 && page <= totalPages)
                  .map((page) => (
                    <Button
                      key={page}
                      variant={page === activePage ? "dark" : "light"}
                      className="px-3"
                      onClick={() => setActivePage(page)}
                    >
                      {page}
                    </Button>
                  ))} */}
                <Button
                  variant="outline-primary"
                  disabled={activePage === totalPages}
                  onClick={handleNextPage}
                  className="px-3"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showZoneModal && (
        <ZoneModal
          show={showZoneModal}
          editData={editData}
          handleClose={handleClose}
          fetchZones={fetchZones}
          venueId={venueId}
        />
      )}
    </>
  );
};

export default ZoneList;
