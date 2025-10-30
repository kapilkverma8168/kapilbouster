import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../services/AxiosInstance";
import GroupMultiSelect from "../../permission/GroupMultiSelect";
import PageTitle from "../../../../jsx/layouts/PageTitle";
import swal from "sweetalert";
import { Button, Modal } from "react-bootstrap";

const ManpowerAllocation = () => {
  //Modals
  const [showModal, setShowModal] = useState(false);

  //
  const [venues, setVenues] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [assignedStaff, setAssignedStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [infinitySelected, setInfinitySelected] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [supervisor, setSupervisor] = useState("");

  const formatDateTime = (date, time) => {
    if (!date || !time) return null;

    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    const timeObj = new Date(`2000-01-01T${time}`);
    const hours = timeObj.getHours();
    const minutes = timeObj.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString();

    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${period}`;
  };

  const fetchVenues = async () => {
    try {
      const res = await axiosInstance.get("/venue/getAllVenuesAndZones");
      // Sort zones alphabetically
      const { sortVenuesAndZones } = await import("../../../../utils/sortVenuesAndZones");
      const sortedData = sortVenuesAndZones(res?.data?.data);
      setVenues(sortedData);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchAvailableStaff = async () => {
    try {
      const res = await axiosInstance.get(`/user-listing?subcategoryid=58`);
      const staffList = res.data.data.map((staff) => ({
        id: staff.id,
        name: staff.fullname,
      }));
      setAvailableStaff(staffList);
    } catch (error) {
      console.error("Error fetching available staff:", error);
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handleAssignStaff = (staff) => {
    setAvailableStaff((prev) => prev.filter((item) => item.id !== staff.id));
    setAssignedStaff((prev) => [...prev, staff]);
  };

  const handleUnassignStaff = (staff) => {
    setAssignedStaff((prev) => prev.filter((item) => item.id !== staff.id));
    setAvailableStaff((prev) => [...prev, staff]);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAvailableStaff = availableStaff.filter(
    (staff) =>
      staff.name && staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchVenues();
    fetchAvailableStaff();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!selectedOptions || selectedOptions.length === 0) {
        swal(
          "Error",
          "Please select at least one venue and zone.",
          "error"
        ).then(() => {
          resetAllFields();
        });
        return;
      }

      if (!startDate || !startTime || !endDate || !endTime) {
        swal(
          "Error",
          "Please select both start and end date/time.",
          "error"
        ).then(() => {
          resetAllFields();
        });
        return;
      }

      const selectedVenueData = selectedOptions
        .map((option) => {
          const venueData = venues.find(
            (venueZone) => venueZone.id === option.venueId
          );

          if (!venueData) return null;

          const selectedZones = venueData.zones.filter((zone) =>
            option.Zones.includes(zone.id)
          );

          if (selectedZones.length === 0) return null;

          return {
            venueId: venueData.id,
            venueName: venueData.name,
            zones: selectedZones.map((zone) => ({
              zoneId: zone.id,
              zoneName: zone.name,
            })),
          };
        })
        .filter(Boolean);

      if (selectedVenueData.length === 0) {
        swal("Error", "No valid venue or zone selected.", "error").then(() => {
          resetAllFields();
        });
        return;
      }

      const staffData = assignedStaff.map((staff) => ({
        id: staff.id,
        name: staff.name,
      }));

      const payload = {
        venues: selectedVenueData,
        assignedStaff: staffData,
        from: formatDateTime(startDate, startTime),
        to: formatDateTime(endDate, endTime),
      };

      const res = await axiosInstance.post("/allocation/submit", payload);

      if (res.data.success) {
        swal("Success", "Allocated the assigned people!", "success").then(
          () => {
            resetAllFields();
            fetchAvailableStaff();
          }
        );
      } else {
        throw new Error(
          res.data.message || "An unexpected error occurred during allocation."
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      swal("Error", errorMessage, "error").then(() => {
        resetAllFields();
      });
      console.error("Submission Error:", errorMessage);
    }
  };

  const resetAllFields = () => {
    setSelectedOptions([]);
    setAssignedStaff([]);
    setSearchTerm("");
    setInfinitySelected(false);
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
  };
  // Handle modal visibility
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupervisor(value);
  };
  return (
    <>
      <PageTitle
        activeMenu={"Allocation"}
        motherMenu={"Attendance"}
        Button={() => (
          <Button variant="primary" onClick={handleOpenModal}>
            Add Attendance Allocation
          </Button>
        )}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Attendance Allocation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group pb-2">
                <label htmlFor="supervisor" className="form-label fw-bold fs-5">
                  1. Supervisor
                </label>
                <select
                  name="supervisor"
                  onChange={handleChange}
                  className="form-control"
                  id="supervisor"
                  value={supervisor}
                >
                  <option value="">Select Supervisor</option>

                  <option key={Math.random()} value={"Satyam"}>
                    Satyam
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="form-label fw-bold fs-5">
                2. Select Venues and Zones
              </label>
              <GroupMultiSelect
                allVenuesAndZones={venues}
                setSelectedVenueAndZones={setSelectedOptions}
                selectedVenueAndZones={selectedOptions}
                setInfinitySelected={setInfinitySelected}
                // allZoneChanges={true}
              />
            </div>
          </div>

          <div className="row">
            <div className="mb-3">
              <label className="form-label fw-bold fs-5">
                3. Select Duration
              </label>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Start Date & Time</label>
                  <div className="d-flex gap-2">
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                      type="time"
                      className="form-control"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mb-3">
                <label className="form-label">End Date & Time</label>
                <div className="d-flex gap-2">
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="form-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold fs-5">
              4. Available Staff
            </label>
            <div className="d-flex flex-column gap-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search Staff"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={!startDate || !startTime || !endDate || !endTime}
              />
              <div className="d-flex flex-column gap-2">
                {filteredAvailableStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>{staff.name}</span>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAssignStaff(staff)}
                      disabled={
                        !startDate || !startTime || !endDate || !endTime
                      }
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold fs-5">5. Assigned Staff</label>
            <div className="d-flex flex-column gap-2">
              {assignedStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{staff.name}</span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleUnassignStaff(staff)}
                  >
                    Unassign
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={
                selectedOptions.length === 0 ||
                assignedStaff.length === 0 ||
                !startDate ||
                !startTime ||
                !endDate ||
                !endTime
              }
            >
              Submit
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Listing />
    </>
  );
};

export default ManpowerAllocation;

const Listing = () => {
  return (
    <>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Supervisor Name</th>
            <th>Zones And Venues</th>
            <th>Check In - Check Out</th>
            <th>Assigned Staff</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </>
  );
};
