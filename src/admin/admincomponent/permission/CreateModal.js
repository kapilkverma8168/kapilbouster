import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import axiosInstance from "../../../services/AxiosInstance";
import swal from "sweetalert";
import { PermissionContext } from "./PermissionContext";
import GroupMultiSelect from "./GroupMultiSelect";

const CreateModal = ({
  show,
  handleClose,
  userType,
  gender,
  sport,
  subSportId,
}) => {
  const { getPermissionData } = useContext(PermissionContext);
  const [venueColorCode, setVenueColorCode] = useState("#000000");
  const [categoryCode, setCategoryCode] = useState("");
  const [errors, setErrors] = useState({});
  const [infinitySelected, setInfinitySelected] = useState(false);
  const [allVenuesAndZones, setAllVenuesAndZones] = useState([]);
  const [selectedVenueAndZones, setSelectedVenueAndZones] = useState([]);
  // const [allZoneChanges, setAllZoneChanges] = useState(true);
  
  // New state for transport and dining - changed to single selection
  const [selectedTransport, setSelectedTransport] = useState("");
  const [selectedDining, setSelectedDining] = useState("");

  // State for dropdown options
  const [transportOptions, setTransportOptions] = useState([]);
  const [diningOptions, setDiningOptions] = useState([]);

  useEffect(() => {
    const fetchVenuesAndZones = async () => {
      try {
        // Use the venueApiService abstraction for fetching venues and zones
        const { venueApiService } = await import("../../../services/venueApi/venueApiService");
        const result = await venueApiService.getAllVenuesAndZones();
        // Sort zones alphabetically
        const { sortVenuesAndZones } = await import("../../../utils/sortVenuesAndZones");
        const sortedData = sortVenuesAndZones(result.data?.data);
        setAllVenuesAndZones(sortedData);


      } catch (error) {
        swal("Error", "Failed to fetch venues and zones.", "error");
      }
    };

    const fetchTransportOptions = async () => {
      try {
        const result = await axiosInstance.get("/travel/dropdown");
        if (result.data?.success) {
          const options = result.data.data.map(item => ({
            value: item.value,
            label: `${item.label} (${item.category})`,
            category: item.category,
            vehicleType: item.vehicleType
          }));
          setTransportOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch transport options:", error);
        // Fallback to default options if API fails
        setTransportOptions([
          { value: "T1", label: "Transport 1" },
          { value: "T2", label: "Transport 2" },
          { value: "T3", label: "Transport 3" },
          { value: "T4", label: "Transport 4" },
        ]);
      }
    };

    const fetchDiningOptions = async () => {
      try {
        const result = await axiosInstance.get("/dining/dropdown");
        if (result.data?.success) {
          const options = result.data.data.map(item => ({
            value: item.value,
            label: `${item.label} (${item.category})`,
            category: item.category
          }));
          setDiningOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch dining options:", error);
        // Fallback to default options if API fails
        setDiningOptions([
          { value: "D1", label: "Dining 1" },
          { value: "D2", label: "Dining 2" },
          { value: "D3", label: "Dining 3" },
          { value: "D4", label: "Dining 4" },
        ]);
      }
    };

    if (show) {
      fetchVenuesAndZones();
      fetchTransportOptions();
      fetchDiningOptions();
    }
  }, [show]);

  const resetForm = () => {
    setVenueColorCode("#000000");
    setCategoryCode("");
    setSelectedVenueAndZones([]);
    setInfinitySelected(false);
    setErrors({});
    // setAllZoneChanges(false);
    setSelectedTransport("");
    setSelectedDining("");
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!venueColorCode)
      validationErrors.venueColorCode = "Color code is required.";
    if (!categoryCode)
      validationErrors.categoryCode = "Category code is required.";
    else if (!/^[a-zA-Z0-9\-_ ]+$/.test(categoryCode))
      validationErrors.categoryCode = "Only letters, numbers, space, -, _ are allowed.";
    else if (categoryCode.length > 50)
      validationErrors.categoryCode = "Category code must be at most 50 characters.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleNewSubmit = async () => {
    if (
      selectedVenueAndZones?.length <= 0
    ) {
      return swal({
        title: "Venue And Zones",
        text: "You need to select at least one venue and zone.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
    }

    if (validateForm()) {
      try {
        // Format the data according to the API structure to match curl format
        const formattedVenueAndZones = selectedVenueAndZones.map(venue => ({
          venue_id: venue.venueId,
          zones: venue.Zones || [],
          dinings: selectedDining ? [selectedDining] : [],
          travels: selectedTransport ? [selectedTransport] : []
        }));

        const postData = {
          selected_venue_and_zones: formattedVenueAndZones,
          venue_color_code: venueColorCode,
          sport_id: sport,
          category_code: categoryCode,
          user_type: userType,
          gender: gender,
          all_zone: infinitySelected,
          is_infinite: infinitySelected,
          sub_sport_id: subSportId ?? "",
          // allZoneChanges,
        };

        await axiosInstance.post("/v2/permission", postData);
        swal("Success", "Permission created successfully!", "success");
        resetForm();
        getPermissionData();
        handleClose();
      } catch (error) {
        swal("Error", "Permission Already Exists!", "error");
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      size="lg"
      centered
      backdrop="static"
    >
      <form>
        {/* Modal Header */}
        <div className="modal-header">
          <h4 className="modal-title fs-20">Create Permission</h4>
          <button
            type="button"
            className="btn-close"
            onClick={handleModalClose}
          >
            <span></span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="add-contact-box">
            <div className="add-contact-content">
              {/* All Zone Changes Switch */}
              {/* <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="allZoneChangesSwitch"
                  // label="Multi-Select Mode (Select multiple zones)"
                  checked={allZoneChanges}
                  onChange={() => setAllZoneChanges(!allZoneChanges)}
                  className="ms-2"
                />
              </Form.Group> */}

              {/* Venue & Zones Selection */}
              <div className="mb-3">
                <Form.Label>
                  Select Venue & Zones <span className="text-danger">*</span>
                </Form.Label>
                <GroupMultiSelect
                  allVenuesAndZones={allVenuesAndZones}
                  setSelectedVenueAndZones={setSelectedVenueAndZones}
                  selectedVenueAndZones={selectedVenueAndZones}
                  setInfinitySelected={setInfinitySelected}
                  allZoneChanges={true}
                />
              </div>

              <div className="row">
                {/* <Form.Group className="col-12 col-md-4 mb-3">
                  <Form.Label>
                    Select Zone <span className="text-danger">*</span>
                  </Form.Label>
                  <MultiSelect
                    className="w-100"
                    options={zoneOptions}
                    value={selectedZone}
                    onChange={setSelectedZone}
                    placeholder="Select Zone"
                  />
                </Form.Group> */}
                <Form.Group className="col-12 col-md-4 mb-3">
                  <Form.Label>
                    Select Transport
                  </Form.Label>
                  <Form.Select
                    className="w-100"
                    value={selectedTransport}
                    onChange={(e) => setSelectedTransport(e.target.value)}
                  >
                    <option value="">Select Transport (Optional)</option>
                    {transportOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="col-12 col-md-4 mb-3">
                  <Form.Label>
                    Select Dining
                  </Form.Label>
                  <Form.Select
                    className="w-100"
                    value={selectedDining}
                    onChange={(e) => setSelectedDining(e.target.value)}
                  >
                    <option value="">Select Dining (Optional)</option>
                    {diningOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Color Code & Category Code Inputs */}
              <div className="row">
                {/* Color Code */}
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Color Code <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    className="w-100"
                    type="color"
                    value={venueColorCode}
                    onChange={(e) => setVenueColorCode(e.target.value)}
                  />
                  <small className="text-muted">
                    Selected Color: <strong>{venueColorCode}</strong>
                  </small>
                  {errors.venueColorCode && (
                    <Alert variant="danger">{errors.venueColorCode}</Alert>
                  )}
                </Form.Group>

                {/* Category Code */}
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Category Code <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Category Code"
                    value={categoryCode}
                    onChange={(e) =>
                      setCategoryCode(
                        e.target.value.replace(/[^a-zA-Z0-9-_ ]/g, "")
                      )
                    }
                    maxLength={50}
                  />
                  {errors.categoryCode && (
                    <Alert variant="danger">{errors.categoryCode}</Alert>
                  )}
                </Form.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer d-flex justify-content-end">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleNewSubmit} className="ms-2">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateModal;
