import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { addEventCalendar } from "../../../services/adminApiService/eventCalendarApis/eventCalendarApis.js";
import swal from "sweetalert";

// Validation of special character
const ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9\s\()\.\,\-\!\:\&]*$/;

const initialFormData = {
  title: "",
  description: "",
  type: "",
  organized_by: "",
  start_date_time: "",
  end_date_time: "",
  location: "",
  remarks: "",
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

function EventNotificationModal({
  showWebsiteModal,
  handleCloseWebsiteModal,
  fetchData,
}) {
  const [formData, setFormData] = React.useState(initialFormData);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [fileUrl, setFileUrl] = React.useState(null);
  const [Error, setError] = React.useState({
    titleError: "",
    descriptionError: "",
    locationError: "",
    remarksError: "",
    OrganinsationError: "",
  });
  const fileInputRef = React.useRef(null);

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(Error).some(Boolean)) {
      swal("Validation failed!", "", "error");
      return;
    }

    const newFormData = new FormData();
    const updatedFormData = {
      ...formData,
      start_date_time: formatDate(formData.start_date_time),
      end_date_time: formatDate(formData.end_date_time),
      attachement: selectedFile,
    };
    // Append each key-value pair from updatedFormData to newFormData
    Object.keys(updatedFormData).forEach((key) => {
      if (updatedFormData[key] !== undefined && updatedFormData[key] !== null) {
        newFormData.append(`${key}`, updatedFormData[key]);
      }
    });
    try {
      let res = await addEventCalendar(newFormData);
      if (res.data.status && res.data.status !== "error") {
        handleCloseWebsiteModal();
        swal("Event Created!", "", "success");
        fetchData();
        handleReset();
      } else {
        swal(`${res.data.status}`, "", "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle input changes
  const handleChangeInputValue = (e) => {
    const { name, value } = e.target;
    console.log(name);

    if (name === "title") {
      if (!ALLOWED_CHARACTERS_REGEX.test(value)) {
        setError({ ...Error, titleError: "You can't use special Character" });
      } else {
        setError({ ...Error, titleError: "" });
      }
    }
    if (name === "description") {
      if (!ALLOWED_CHARACTERS_REGEX.test(value)) {
        setError({
          ...Error,
          descriptionError: "You can't use special Character",
        });
      } else {
        setError({ ...Error, descriptionError: "" });
      }
    }
    if (name === "location") {
      if (!ALLOWED_CHARACTERS_REGEX.test(value)) {
        setError({
          ...Error,
          locationError: "You can't use special Character",
        });
      } else {
        setError({ ...Error, locationError: "" });
      }
    }
    if (name === "remarks") {
      if (!ALLOWED_CHARACTERS_REGEX.test(value)) {
        setError({
          ...Error,
          remarksError: "You can't use special Character",
        });
      } else {
        setError({ ...Error, remarksError: "" });
      }
    }
    if (name === "organized_by") {
      if (!ALLOWED_CHARACTERS_REGEX.test(value)) {
        setError({
          ...Error,
          OrganinsationError: "You can't use special Character",
        });
      } else {
        setError({ ...Error, OrganinsationError: "" });
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setSelectedFile(null);
      setFileUrl(null);
    }
  };

  const handleFilePreview = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <Modal show={showWebsiteModal} onHide={handleCloseWebsiteModal}>
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h4 className="modal-title fs-20">Create Event</h4>
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseWebsiteModal}
          >
            <span></span>
          </button>
        </div>
        <div className="modal-body">
          <div className="add-contact-box">
            <div className="add-contact-content">
              {/* 1st Row */}
              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <label className="text-black font-w500">
                    Title <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    <Form.Control
                      required
                      name="title"
                      value={formData.title}
                      placeholder="Enter Title"
                      onChange={handleChangeInputValue}
                    />
                  </div>

                  <span className="validation-text text-danger">
                    {Error.titleError && Error.titleError}
                  </span>
                </div>
              </div>
              {/* 2nd Row */}
              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <label className="text-black font-w500">
                    Description <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    <Form.Control
                      required
                      name="description"
                      as="textarea"
                      placeholder="Description"
                      onChange={handleChangeInputValue}
                      value={formData.description}
                    />
                  </div>

                  <span className="validation-text text-danger">
                    {Error.descriptionError && Error.descriptionError}
                  </span>
                </div>
              </div>
              {/* 3rd row */}
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">Type</label>
                  <span className="text-danger">*</span>
                  <select
                    required
                    name="type"
                    className="form-control"
                    value={formData.type}
                    onChange={handleChangeInputValue}
                  >
                    <option value="">Select type</option>
                    <option value="Training">Training</option>
                    <option value="Sports_Event">Sports Event</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">Organized By</label>
                  <span className="text-danger">*</span>
                  {/* <select
                    required
                    name="organized_by"
                    className="form-control"
                    value={formData.organized_by}
                    onChange={handleChangeInputValue}
                  >
                    <option value="">Select organizer</option>
                    <option value="Organizer A">Organizer A</option>
                    <option value="Organizer B">Organizer B</option>
                    <option value="Organizer C">Organizer C</option>
                  </select> */}

                  <div className="contact-name">
                    <Form.Control
                      required
                      name="organized_by"
                      value={formData.organized_by}
                      placeholder="Enter Organization name"
                      onChange={handleChangeInputValue}
                    />
                  </div>

                  <span className="validation-text text-danger">
                    {Error.OrganinsationError && Error.OrganinsationError}
                  </span>
                </div>
              </div>
              {/* 4th row Start Date & End Date */}
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">Start Date</label>
                  <span className="text-danger">*</span>
                  <Form.Group controlId="startDate">
                    <Form.Control
                      type="datetime-local"
                      // type="date"
                      name="start_date_time"
                      value={formData.start_date_time}
                      onChange={handleChangeInputValue}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">End Date</label>
                  <span className="text-danger">*</span>
                  <Form.Group controlId="endDate">
                    <Form.Control
                      // type="date"
                      type="datetime-local"
                      name="end_date_time"
                      value={formData.end_date_time}
                      onChange={handleChangeInputValue}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              {/* 5th row */}
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">
                    Location <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    <Form.Control
                      required
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleChangeInputValue}
                    />
                  </div>

                  <span className="validation-text text-danger">
                    {Error.locationError && Error.locationError}
                  </span>
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">
                    Remarks <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    <Form.Control
                      required
                      name="remarks"
                      placeholder="Remarks"
                      value={formData.remarks}
                      onChange={handleChangeInputValue}
                    />
                  </div>
                  <span className="validation-text text-danger">
                    {Error.remarksError && Error.remarksError}
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <Form.Group controlId="formFile">
                    <Form.Label className="text-black font-w500">
                      Upload Document
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="primary"
                        className="ms-2"
                        disabled={!selectedFile}
                        onClick={handleFilePreview}
                      >
                        Preview
                      </Button>
                    </div>
                  </Form.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer d-flex justify-content-between">
          <div className="d-flex justify-content-end w-100">
            <button
              type="button"
              className="btn btn-secondary mx-2"
              onClick={handleReset}
              // onClick={handleCloseWebsiteModal}
            >
              Reset
            </button>
            <Button type="submit" className="btn btn-primary mx-2">
              Raise
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default React.memo(EventNotificationModal);
