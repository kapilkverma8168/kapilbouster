import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import axiosInstance from "../../../../services/AxiosInstance";
import { useParams } from "react-router-dom";
import ImageModal from "../../../../components/ImageModal";

const initialZoneData = {
  zone_code: "",
  name: "",
  latitude: "",
  longitude: "",
  capacity: "" || null,
  range: "",
  description: "",
};

const ZoneModal = ({ show, handleClose, venueList, isCommonZone = false, selectedVenues,additionalField,fetchZones, handleVenueChange,editData }) => {
  const [zoneData, setZoneData] = useState(initialZoneData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const [isPreviewDisabled, setIsPreviewDisabled] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (show) {
      if (editData) {
        setZoneData({
          zone_code: editData.zone_code || "",
          name: editData.name || "",
          latitude: editData.latitude || "",
          longitude: editData.longitude || "",
          capacity: editData.capacity || null,
          range: editData.range || "",
          description: editData.description || "",
        });
        setFileUrl(editData.imageURL || null);
      } else {
        setZoneData(initialZoneData);
        setFileUrl(null);
      }
      setErrors({});
    }
  }, [show, editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "zone_code") {
      const upperValue = value.toUpperCase();
      const isValidZoneCode = /^[A-Z0-9-_]*$/.test(upperValue);
      if (isValidZoneCode) {
        setZoneData((prevData) => ({ ...prevData, [name]: upperValue }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]:
            "Zone Code can only contain alphabets, numbers, '-', and '_'.",
        }));
      }
    } else {
      setZoneData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxFileSize = 1 * 1024 * 1024; // 1 MB
      const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedFileTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Only JPG, JPEG, and PNG file formats are allowed.",
        }));
        setSelectedFile(null);
        setFileUrl(null);
        setIsPreviewDisabled(true); // Disable button
      } else if (file.size > maxFileSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "File size should not exceed 1 MB.",
        }));
        setSelectedFile(null);
        setFileUrl(null);
        setIsPreviewDisabled(true); // Disable button
      } else {
        setSelectedFile(file);
        setFileUrl(URL.createObjectURL(file));
        setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
        setIsPreviewDisabled(false); // Enable button
      }
    } else {
      setSelectedFile(null);
      setFileUrl(null);
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Image is required.",
      }));
      setIsPreviewDisabled(true); // Disable button
    }
  };

  const handleFilePreview = () => {
    if (fileUrl) {
      setSelectedImage(fileUrl);
      setShowImageModal(true);
    }
  };

  const handleReset = () => {
    setZoneData(initialZoneData);
    setSelectedFile(null);
    setFileUrl(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleModalClose = () => {
    setZoneData(initialZoneData);
    setSelectedFile(null);
    setFileUrl(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = null;
    handleClose();
  };

  const validateForm = () => {
    const validationErrors = {};

    // Zone Code validation
    if (!zoneData.zone_code) {
      validationErrors.zone_code = "Zone Code is required.";
    } else if (!/^[a-zA-Z0-9\-_]+$/.test(zoneData.zone_code)) {
      validationErrors.zone_code =
        "Zone Code can only contain alphabets, numbers, '-', and '_'.";
    }

    // Zone Name validation
    if (!zoneData.name) {
      validationErrors.name = "Zone Name is required.";
    } else {
      if (!/^[A-Za-z0-9\s\-_&\/(),]+$/.test(zoneData.name)) {
        validationErrors.name = "Only letters, numbers, spaces, -, _, &, /, comma, () are allowed.";
      } else if (zoneData.name.trim().length > 100) {
        validationErrors.name = "Zone Name must be at most 100 characters.";
      }
    }

    if (!zoneData.description)
      validationErrors.description = "Description is required.";
    else if (zoneData.description.length > 500)
      validationErrors.description = "Description must be at most 500 characters.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      swal(
        "Validation Error",
        "Please fix the highlighted errors in the form.",
        "error"
      );
      return;
    }

    if (selectedFile) {
      const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxFileSize = 1 * 1024 * 1024; // 1 MB

      if (!allowedFileTypes.includes(selectedFile.type)) {
        swal(
          "Validation Error",
          "Only JPG, JPEG, and PNG file formats are allowed.",
          "error"
        );
        return;
      }

      if (selectedFile.size > maxFileSize) {
        swal("Validation Error", "Image size should not exceed 1 MB.", "error");
        return;
      }
    }

    const payload = { ...zoneData, venue_id: id };

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return; // skip empty fields (prevents sending null/empty capacity)
        }
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      });

      let res;

      if (editData) {
        res = await axiosInstance.put(`/zones/${editData.id}`, formData);
        if (res.data.success) {
          swal(
            "Zone Updated!",
            "The zone has been updated successfully.",
            "success"
          );
        } else {
          swal(
            "Error!",
            "Error Updating Zone, Zone name/code duplicacy may have occurred.",
            "error"
          );
        }
      } else {
        res = await axiosInstance.post("/zones", formData);
        if (res.data.success) {
          swal(
            "Zone Created!",
            "The new zone has been created successfully.",
            "success"
          );
        } else {
          swal(
            "Error!",
            "Error Creating Zone, Zone name/code duplicacy may have occurred.",
            "error"
          );
        }
      }

      fetchZones();
      handleClose();
    } catch (error) {
      const message =
        error.response?.data?.message || "An unexpected error occurred.";

      // Handle backend validation errors specifically for unacceptable files
      if (error.response?.data?.errors?.image) {
        swal("Validation Error", error.response.data.errors.image[0], "error");
      } else {
        swal("Error occurred!", message, "error");
      }
    }
  };

  const handleCommonSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Selected Venues:", selectedVenues); 
  
    if (!selectedVenues || selectedVenues.length === 0) {
      swal("Validation Error", "Please select at least one venue.", "error");
      return;
    }
  
    const venueIds = selectedVenues
      .filter((venue) => venue.value !== "ALL")
      .map((venue) => venue.value); 
  
    console.log("Venue IDs to send:", venueIds); 
  
    if (venueIds.length === 0) {
      swal("Validation Error", "Please select at least one valid venue.", "error");
      return;
    }
  
    const payload = {
      venue_ids: venueIds, 
      zone_code: zoneData.zone_code,
      name: zoneData.name,
      latitude: zoneData.latitude,
      longitude: zoneData.longitude,
      range: zoneData.range,
      description: zoneData.description || "",
    };
  
    try {
      const response = await axiosInstance.post("/zones/common-zone", payload);
  
      if (response.data.success) {
        swal("Success!", "Common zone has been created successfully.", "success");
        handleClose();
      } else {
        swal("Error!", "Error creating common zone. Please check your input.", "error");
      }
    } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred.";
      swal("Error occurred!", message, "error");
    }
  };
  

  return (
    <Modal show={show} onHide={handleModalClose}>
      <form onSubmit={isCommonZone ? handleCommonSubmit : handleSubmit}>
        <div className="modal-header">
          <h4 className="modal-title fs-20">
            {editData ? "Edit Zone" : "Add Zone"}
          </h4>
          <button type="button" className="btn-close" onClick={handleClose}>
            <span></span>
          </button>
        </div>
        <div className="modal-body">
          <div className="add-contact-box">
            <div className="add-contact-content">
              {/* Injecting additional field dynamically */}
              {additionalField && <>{additionalField}</>}
  
              {/* Zone Code and Zone Name */}
              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Zone Code <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="zone_code"
                    value={zoneData.zone_code}
                    onChange={handleInputChange}
                    isInvalid={!!errors.zone_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.zone_code}
                  </Form.Control.Feedback>
                </Form.Group>
  
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Zone Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="name"
                    value={zoneData.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter zone name (use Shift + Enter for line breaks)"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
  
              {/* Latitude and Longitude */}
              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Latitude 
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="latitude"
                    value={zoneData.latitude}
                    onChange={handleInputChange}
                    placeholder="Enter latitude (e.g., 28.6139)"
                    isInvalid={!!errors.latitude}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.latitude}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Longitude 
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="longitude"
                    value={zoneData.longitude}
                    onChange={handleInputChange}
                    placeholder="Enter longitude (e.g., 77.2090)"
                    isInvalid={!!errors.longitude}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.longitude}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
  
              {/* Capacity and Range */}
              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={zoneData.capacity}
                    onChange={handleInputChange}
                    min="0"
                    isInvalid={!!errors.capacity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.capacity}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Range (in meters)
                     {/* <span style={{ color: "red" }}>*</span> */}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="range"
                    value={zoneData.range}
                    onChange={handleInputChange}
                    min="0"
                    isInvalid={!!errors.range}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.range}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
  
              {/* Description */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Description <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={zoneData.description}
                  onChange={handleInputChange}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
  
              {/* File Input */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Image
                </Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    isInvalid={!!errors.image}
                  />
                  <Button
                    variant="primary"
                    className="ms-2"
                    disabled={isPreviewDisabled}
                    onClick={handleFilePreview}
                  >
                    Preview
                  </Button>
                </div>
                {errors.image && (
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-block mt-1"
                  >
                    {errors.image}
                  </Form.Control.Feedback>
                )}
                <small className="text-muted mt-2 d-block">
                  Accepted file formats: JPG, JPEG, PNG
                </small>
                {/* Display existing image when editing */}
                {editData && editData.imageURL && !fileUrl && (
                  <div className="mt-3">
                    <p className="text-muted mb-2">Current Image:</p>
                    <img 
                      src={editData.imageURL} 
                      alt="Current Zone Image" 
                      onClick={() => {
                        setSelectedImage(editData.imageURL);
                        setShowImageModal(true);
                      }}
                      style={{ 
                        maxWidth: "200px", 
                        maxHeight: "150px", 
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #dee2e6",
                        cursor: "pointer"
                      }}
                    />
                    <small className="text-muted d-block mt-1">Click image to view full size</small>
                  </div>
                )}
                {/* Display new image preview when file is selected */}
                {fileUrl && (
                  <div className="mt-3">
                    <p className="text-muted mb-2">New Image Preview:</p>
                    <img 
                      src={fileUrl} 
                      alt="New Zone Image Preview" 
                      style={{ 
                        maxWidth: "200px", 
                        maxHeight: "150px", 
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #dee2e6"
                      }}
                    />
                  </div>
                )}
              </Form.Group>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-custom" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="btn-primary-custom">
            {editData ? "Update Zone" : "Save Zone"}
          </button>
        </div>
      </form>

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt="Zone Image"
      />
    </Modal>
  );  
};

export default ZoneModal;
