import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import swal from "sweetalert";
import axiosInstance from "../../../../services/AxiosInstance";
import SportsFacilitiesMultiSelect from "./SportsFacilitiesMultiSelect";

const generateInitialValue = (editData = {}) => ({
  venue_code: editData?.venue_code || "",
  venue_name: editData?.name || "",
  latitude: editData?.latitude || "",
  longitude: editData?.longitude || "",
  range: editData?.range || "",
  image: null,
  description: editData?.description || "",
  capacity: editData?.capacity || "" ,
  sportsFacilities: editData?.sports_facilities || [],
  managerName: editData?.venue_owner_name || "",
  managerPhone: editData?.venue_owner_phone || "",
  managerEmail: editData?.venue_owner_email || "",
});

const VenueModal = ({ show, handleClose, fetchData, editData, cityList}) => {
  const [data, setData] = useState(generateInitialValue(editData));
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(editData?.image || null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(editData?.cluster_id || "");
  const [isReplacingImage, setIsReplacingImage] = useState(false);

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
  };

  useEffect(() => {
    if (editData) {
      setData(generateInitialValue(editData));
      setFileUrl(editData?.imageURL || null);
      // Ensure city ID is converted to string for proper comparison
      setSelectedCity(String(editData?.cluster_id || ""));
      setIsReplacingImage(false);
    } else {
      setData(generateInitialValue());
      setFileUrl(null);
      // Preselect city if only one city is available
      if (cityList && cityList.length === 1) {
        setSelectedCity(String(cityList[0].city_id));
      } else {
        setSelectedCity("");
      }
      setIsReplacingImage(false);
    }
    setErrors({});
    setSelectedFile(null);
  }, [editData, cityList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "venue_code") {
      const upperValue = value.toUpperCase();
      const isValid = /^[A-Z0-9\-_]*$/.test(upperValue); // Updated regex to include alphanumeric
      if (isValid) {
        setData((prevData) => ({ ...prevData, [name]: upperValue }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Venue Code can only contain letters, numbers, '-', and '_'.",
        }));
      }
    } else if (name === "venue_name" || name === "managerName") {
      const isValid = /^[a-zA-Z0-9\s\-_/]*$/.test(value);
      if (isValid) {
        setData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${
            name === "venue_name" ? "Venue" : "Manager"
          } Name can only contain alphabets, numbers, spaces, and characters -, _, /.`,
        }));
      }
    } else if (name === "managerEmail") {
      const isValidEmail = /^[a-zA-Z0-9@.]*$/.test(value);
      if (isValidEmail) {
        setData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Email can only contain alphabets, numbers, '@', and '.'.",
        }));
      }
    } else if (name === "capacity" || name === "range" || name === "latitude" || name === "longitude") {
      const isNumeric = /^\d*\.?\d*$/.test(value); // Allow numbers and decimals
      if (isNumeric) {
        setData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only numeric values are allowed.",
        }));
      }
    } else if (name === "description") {
      setData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleFilePreview = () => {
    if (fileUrl) window.open(fileUrl, "_blank");
  };

  const handleCancelReplaceImage = () => {
    // Revert to existing image, hide file input
    setSelectedFile(null);
    setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
    // Restore fileUrl from editData (if available)
    if (editData?.imageURL) {
      setFileUrl(editData.imageURL);
    }
    if (fileInputRef.current) fileInputRef.current.value = null;
    setIsReplacingImage(false);
  };

  const handleReset = () => {
    setData(generateInitialValue());
    setSelectedFile(null);
    setFileUrl(null);
    setSelectedCity("");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleFileChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const file = files[0];
      const allowedExtensions = ["jpeg", "jpg", "png"];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const MAX_FILE_SIZE = 1048576; // 1 MB
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (
        !allowedExtensions.includes(fileExtension) ||
        !allowedTypes.includes(file.type)
      ) {
        setSelectedFile(null);
        setFileUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        return swal({
          title: "Invalid File Type",
          text: "Only JPG, JPEG, and PNG files are allowed.",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }

      if (!allowedTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only JPG, JPEG, and PNG files are allowed.",
        }));
        setSelectedFile(null);
        setFileUrl(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "File size should not exceed 1 MB.",
        }));
        setSelectedFile(null);
        setFileUrl(null);
        return;
      }

      setSelectedFile(file);
      setFileUrl(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else if (type === "file") {
      setSelectedFile(null);
      setFileUrl(null);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Image is required.",
      }));
      return;
    }

    if (name === "capacity" || name === "range") {
      const isNumeric = /^\d*\.?\d*$/.test(value); // Allow numbers and decimals
      if (isNumeric) {
        setData((prevData) => ({
          ...prevData,
          [name]: value || null,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only numeric values are allowed.",
        }));
      }
      return;
    }

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!data.venue_code) {
      validationErrors.venue_code = "Venue Code is required.";
    } else if (!/^[a-zA-Z0-9\-_]*$/.test(data.venue_code)) {
      validationErrors.venue_code =
        "Venue Code must contain only alphabets, numbers, hyphens (-), and underscores (_).";
    }

    if (!data.venue_name) {
      validationErrors.venue_name = "Venue Name is required.";
    } else if (data.venue_name.length > 100) {
      validationErrors.venue_name = "Venue Name must be at most 100 characters.";
    }

    if (!data.sportsFacilities || !data.sportsFacilities.length) {
      validationErrors.sportsFacilities =
        "At least one sport facility must be selected.";
    }

    if (!data.latitude || !/^(-?\d+(\.\d+)?)$/.test(data.latitude)) {
      validationErrors.latitude = "Latitude must be a valid number.";
    }

    if (!data.longitude || !/^(-?\d+(\.\d+)?)$/.test(data.longitude)) {
      validationErrors.longitude = "Longitude must be a valid number.";
    }

    if (!data.range || isNaN(data.range) || parseFloat(data.range) <= 0) {
      validationErrors.range = "Range must be a positive number.";
    }

    if (
      data.capacity &&
      (isNaN(data.capacity) || parseInt(data.capacity) <= 0)
    ) {
      validationErrors.capacity = "Capacity must be a positive number.";
    }

    if (!data.description) {
      validationErrors.description = "Description is required.";
    } else if (data.description.length > 500) {
      validationErrors.description = "Description must be at most 500 characters.";
    }

    if (!data.managerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.managerEmail)) {
      validationErrors.managerEmail = "Valid email is required.";
    }

    if (!selectedCity) {
      validationErrors.city = "City selection is required.";
    }

    if (!fileUrl && !selectedFile && !editData?.imageURL) {
      validationErrors.image = "Image is required.";
    }

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

    const toUpperIfString = (val) => (typeof val === "string" ? val.toUpperCase() : val);

    const payload = {
      venue_code: toUpperIfString(data.venue_code),
      name: toUpperIfString(data.venue_name.trim()),
      latitude: data.latitude,
      longitude: data.longitude,
      range: data.range,
      description: toUpperIfString(data.description),
      capacity: data.capacity,
      venue_owner_name: toUpperIfString(data.managerName.trim()),
      venue_owner_phone: data.managerPhone,
      venue_owner_email: data.managerEmail, // keep email as-is
      sports_facilities: data.sportsFacilities,
      cluster_id: selectedCity
    };

    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      // Remove fields with empty values (null, undefined, empty string, or empty array)
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        // Do not append this field
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    });

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      if (editData) {
        const res = await axiosInstance.patch(
          `/venue/${editData.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (res.data.success) {
          swal("Venue Updated Successfully!", "", "success");
          fetchData();
          handleClose();
          handleReset();
        } else {
          if (
            res.data.duplicates.name === false &&
            res.data.duplicates.venue_code === false
          ) {
            swal(
              "Error!",
              "Both Venue Name and Venue Code are duplicates. Please change the values.",
              "error"
            );
          } else if (res.data.duplicates.name === false) {
            swal(
              "Error!",
              "Venue Name is duplicate. Please change it.",
              "error"
            );
          } else if (res.data.duplicates.venue_code === false) {
            swal(
              "Error!",
              "Venue Code is duplicate. Please change it.",
              "error"
            );
          } else {
            swal(
              "Error!",
              res.data.message || "An unexpected error occurred.",
              "error"
            );
          }
        }
      } else {
        const res = await axiosInstance.post("/venue", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          swal("Venue Created Successfully!", "", "success");
          fetchData();
          handleClose();
          handleReset();
        } else {
          if (
            res.data.duplicates.name === false &&
            res.data.duplicates.venue_code === false
          ) {
            swal(
              "Error!",
              "Both Venue Name and Venue Code are duplicates. Please change the values.",
              "error"
            );
          } else if (res.data.duplicates.name === false) {
            swal(
              "Error!",
              "Venue Name is duplicate. Please change it.",
              "error"
            );
          } else if (res.data.duplicates.venue_code === false) {
            swal(
              "Error!",
              "Venue Code is duplicate. Please change it.",
              "error"
            );
          } else {
            swal(
              "Error!",
              res.data.message || "An unexpected error occurred.",
              "error"
            );
          }
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      swal("Error!", message, "error");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h4 className="modal-title fs-20">
            {editData ? "Edit Venue" : "Add New Venue"}
          </h4>
          <button type="button" className="btn-close" onClick={handleClose}>
            <span></span>
          </button>
        </div>

        <div className="modal-body">
          <div className="add-contact-box">
            <div className="add-contact-content">
              {/* Venue Code and Name */}
              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Venue Code <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="venue_code"
                    value={data.venue_code}
                    onChange={handleInputChange}
                    isInvalid={!!errors.venue_code}
                    className={errors.venue_code ? "border-danger" : ""}
                    maxLength={50}
                    // placeholder="Enter Venue Code"
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {errors.venue_code}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Venue Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="venue_name"
                    value={data.venue_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.venue_name}
                    className={errors.venue_name ? "border-danger" : ""}
                    maxLength={100}
                    // placeholder="Enter Venue Name"
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {errors.venue_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Latitude and Longitude */}
              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Latitude <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="latitude"
                    value={data.latitude}
                    onChange={handleInputChange}
                    isInvalid={!!errors.latitude}
                    className={errors.latitude ? "border-danger" : ""}
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {errors.latitude}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Longitude <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="longitude"
                    value={data.longitude}
                    onChange={handleInputChange}
                    isInvalid={!!errors.longitude}
                    className={errors.longitude ? "border-danger" : ""}
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {errors.longitude}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Range and Capacity */}
              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Range (in meters) <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="range"
                    value={data.range}
                    onChange={handleInputChange}
                    isInvalid={errors.range}
                    className={errors.range ? "border-danger" : ""}
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {errors.range}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={data.capacity}
                    onChange={handleInputChange}
                    isInvalid={!!errors.capacity}
                    className={errors.capacity ? "border-danger" : ""}
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {errors.capacity}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Image Upload */}
              <div className="row">
                {/* Image Field */}
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Image <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <div>
                    {fileUrl && !isReplacingImage ? (
                      <div>
                        <div className="d-flex gap-2 align-items-center mb-2">
                          <Button
                            variant="secondary"
                            onClick={handleFilePreview}
                          >
                            Preview
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={() => setIsReplacingImage(true)}
                          >
                            Change Image
                          </Button>
                        </div>
                        <small className="text-muted d-block">
                          Using existing image. Click "Change Image" to upload a new file.
                        </small>
                      </div>
                    ) : (
                      <>
                        <Form.Control
                          type="file"
                          ref={fileInputRef}
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={handleFileChange}
                          isInvalid={!!errors.image}
                          className={errors.image ? "border-danger" : ""}
                        />
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {errors.image}
                        </Form.Control.Feedback>
                        {selectedFile == null && (
                          <small className="text-muted">
                            <span>
                              Only JPEG, PNG, or JPG formats are allowed (max 1MB).
                            </span>
                          </small>
                        )}
                        {fileUrl && (
                          <div className="d-flex gap-2 mt-2">
                            <Button
                              variant="secondary"
                              onClick={handleFilePreview}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={handleCancelReplaceImage}
                              type="button"
                            >
                              Use Existing Image
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    City <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <div>
                    <Form.Select
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      isInvalid={!!errors.city}
                      className={errors.city ? "border-danger" : ""}
                    >
                      <option value="">Select a city</option>
                      {cityList.map(city =>{
                        return <option key={city.city_id} value={String(city.city_id)}>{city.city_name}</option>
                      })}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.city}
                    </Form.Control.Feedback>
                    <small className="text-muted d-block mt-1">
                      Please select your city from the dropdown.
                    </small>
                  </div>
                </Form.Group>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>
                  Description <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  isInvalid={!!errors.description}
                  maxLength={500}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Select Sports/Facilities{" "}
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <SportsFacilitiesMultiSelect
                  onChange={(selected) =>
                    setData((prevData) => ({
                      ...prevData,
                      sportsFacilities: selected,
                    }))
                  }
                  selectedValues={data.sportsFacilities}
                />
                {errors.sportsFacilities && (
                  <Alert variant="danger" style={{ marginTop: "10px" }}>
                    {errors.sportsFacilities}
                  </Alert>
                )}
              </Form.Group>

              {/* Venue Manager Details */}
              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Venue Manager Name
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="managerName"
                    value={data.managerName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.managerName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.managerName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>
                    Venue Manager Phone Number{" "}
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="managerPhone"
                    value={data.managerPhone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.managerPhone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.managerPhone}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>
                  Venue Manager Email Address{" "}
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="managerEmail"
                  value={data.managerEmail}
                  onChange={handleInputChange}
                  onBlur={() => {
                    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                      data.managerEmail
                    );
                    if (!isValidEmail) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        managerEmail: "Invalid email format.",
                      }));
                    }
                  }}
                  isInvalid={!!errors.managerEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.managerEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" variant="primary">
            {editData ? "Update Venue" : "Save Venue"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VenueModal;
