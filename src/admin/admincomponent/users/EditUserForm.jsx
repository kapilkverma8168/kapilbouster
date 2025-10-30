import React, { useEffect, useRef, useState } from "react";
import swal from "sweetalert";
import axiosInstance from "../../../services/AxiosInstance";
import { Modal, Button } from "react-bootstrap";
import GroupCityVenues from "./GroupCityVenues";
import ImageModal from "../../../components/ImageModal";

const UPLOAD_FIELDS = {
  press_card: {
    title: "Upload Press Card Image",
    type: "image",
    acceptedTypes: ["image/jpeg", "image/png", "image/jpg"],
    maxSize: 2 * 1024 * 1024,
    helperText: "Upload JPEG/PNG (2MB max)",
  },
  letter_of_authorization: {
    title: "Letter of Authorization",
    type: "file",
    acceptedTypes: [".pdf", ".doc", ".docx"],
    maxSize: 5 * 1024 * 1024,
    helperText: "Upload PDF/DOC/DOCX (Max size: 5 MB)",
    hasSample: true,
    sampleFile: {
      path: "Letter of Authorization Sample.pdf",
      filename: "LetterofAuthorizationSample.pdf",
    },
  },
};

const EditUserForm = ({ show, onHide, userData, onUserUpdated }) => {
  const [subtypes, setSubTypes] = useState([]);
  const [sports, setSports] = useState([]);
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({
    officeIDImage: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploadedOfficeId, setUploadedOfficeID] = useState(null);
  const [officeIDError, setOfficeIDError] = useState("");
  const officeIDInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadLetterInputRef = useRef(null);
  const [uploadLetterError, setUploadLetterError] = useState("");
  const [infinitySelected, setInfinitySelected] = useState(false);
  const [allCitiesAndVenues, setAllCitiesAndVenues] = useState({});
  const [officeIDImageURL, setOfficeIDImageURL] = useState(null);
  const [selectedVenueIds, setSelectedVenueIds] = useState([]);
  const [selectedVenueIdsState, setSelectedVenueIdsState] = useState([]);
  const [uploadLetterUploaded, setUploadLetterUploaded] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [userType, setUserType] = useState("");
  const [designation, setDesignation] = useState("");
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const [isDesignationDropdown, setIsDesignationDropdown] = useState(false);
  const [isMedia, setIsMedia] = useState(false);
  const [createdby, setCreatedby] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [sharedUserType, setSharedUserType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState({
    press_card_front: "",
    press_card_back: "",
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  const resetFileInputs = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (officeIDInputRef.current) {
      officeIDInputRef.current.value = "";
    }
    if (uploadLetterInputRef.current) {
      uploadLetterInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const getAllCitiesAndVenues = async () => {
      const result = await axiosInstance.get("/venue/cities");
      setAllCitiesAndVenues(result.data.data);
    };
    getAllCitiesAndVenues();
  }, []);

  const initialForm = {
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    mobile: "",
    categoryid: "",
    gender: "",
    photo: null,
    sportid: "",
    responsibleOrganization: "",
    designation: "",
    uploadLetter: null,
    officeIDImage: null,
    country: "",
    idType: "",
    idNumber: "",
  };

  const [form, setForm] = useState(initialForm);

  // Load single user data by ID when modal opens
  useEffect(() => {
    const fetchSingleUser = async (id) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/registrationform/${id}`);
        const detailed = Array.isArray(response?.data?.data)
          ? response.data.data[0]
          : response?.data?.data;

        if (!detailed) return;

        setForm({
          firstname: detailed.first_name || "",
          middlename: detailed.middle_name || "",
          lastname: detailed.last_name || "",
          email: detailed.email_id || "",
          mobile: detailed.mobile_number || "",
          categoryid: detailed.sub_category_id || detailed?.sub_category?.sub_category_id || "",
          gender: detailed.gender || "",
          photo: null,
          sportid: detailed.sports_id || detailed.sport_id || "",
          responsibleOrganization: detailed.organisation || "",
          designation: detailed.designation || "",
          uploadLetter: null,
          officeIDImage: null,
          country: detailed.country_id || detailed.country || "",
          idType: detailed.id_type || detailed.kk_type_of_id || "",
          idNumber: detailed.id_proof_number || detailed.kk_id_number || "",
        });

        // Images
        setImageURL(detailed.player_image_path || null);
        setOfficeIDImageURL(detailed.office_id_image || null);

        // Venue IDs
        if (detailed.venue_ids) {
          let venueIds = [];
          if (typeof detailed.venue_ids === "string") {
            venueIds = detailed.venue_ids
              .split(",")
              .map((val) => parseInt(String(val).trim()))
              .filter((val) => !isNaN(val));
          } else if (Array.isArray(detailed.venue_ids)) {
            venueIds = detailed.venue_ids
              .map((val) => parseInt(val))
              .filter((val) => !isNaN(val));
          }
          setSelectedVenueIds(venueIds);
          setSelectedVenueIdsState(venueIds);
        }

        // Media specific fields
        const categoryId = String(
          detailed.sub_category_id || detailed?.sub_category?.sub_category_id || ""
        );
        if (categoryId === "61" || categoryId === "62") {
          setShowHiddenFields(true);
          setIsDesignationDropdown(false);
          setForm((prev) => ({
            ...prev,
            designation: categoryId === "61" ? "Media-Journalist" : "Media-Photo/Video",
          }));
        } else {
          setShowHiddenFields(false);
          setIsDesignationDropdown(true);
        }
      } catch (error) {
        console.error("Error fetching single user:", error);
        swal("Error", error?.response?.data?.message || "Failed to load user details.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (show && userData?.registration_data_id) {
      fetchSingleUser(userData.registration_data_id);
    } else if (show && userData) {
      // Fallback to existing data if ID not present
      fetchSingleUser(userData.id || userData.ID || userData.registrationId || "");
    }
  }, [show, userData]);

  const getUserTypes = async () => {
    try {
      const response = await axiosInstance.get("/user-sub-type");
      const data = response.data?.data || [];
      // Map the API response format to the expected format
      const mappedUserTypes = data.map((item) => ({
        id: item.sub_category_id,
        sub_category_id: item.sub_category_id,
        sub_category_name_view: item.sub_category_name_view
      }));
      setSubTypes(mappedUserTypes);
    } catch (error) {
      console.error("Error fetching User Types:", error);
    }
  };

  const getSports = async () => {
    try {
      const response = await axiosInstance.get("/sports-name");
      setSports(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const getCountries = async () => {
    try {
      const response = await axiosInstance.get("/venue/allCountries");
      setCountries(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    if (show) {
      getUserTypes();
      getSports();
      getCountries();
    }
  }, [show]);

  function isValidMobileNumber(number) {
    const MOBILE_NUMBER_REGEX = /^(?:\+91|0)?[6-9]\d{9}$/;
    return MOBILE_NUMBER_REGEX.test(number);
  }

  function isValidEmail(email) {
    const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return EMAIL_REGEX.test(email);
  }

  const handleUploadLetterChange = async (e) => {
    const file = e.target.files[0];
    const fieldId = "letter_of_authorization";

    setUploadLetterError("");

    if (!file) {
      setUploadLetterError("Please select a file to upload.");
      return;
    }

    if (file.size > UPLOAD_FIELDS[fieldId].maxSize) {
      setUploadLetterError("File size exceeds the limit of 5 MB.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("id", 1);
    try {
      const response = await axiosInstance.post("/uploads", formData);
      console.log(response.data.data["1"]);
      form.letter_of_authorization = response.data.data["1"];
      if (response.data.success) {
        swal("Success", "File uploaded successfully!", "success");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      swal("Error", "An unexpected error occurred during upload.", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      const maxFileSize = 1 * 1024 * 1024;
      const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (file) {
        if (file.size > maxFileSize) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "File size should not exceed 1 MB.",
          }));
          e.target.value = "";
          setImageURL(null);
        } else if (!allowedFileTypes.includes(file.type)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Only JPEG, PNG, and JPG files are allowed.",
          }));
          e.target.value = "";
          setImageURL(null);
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
          setForm((prev) => ({
            ...prev,
            [name]: file,
          }));

          const imageUrl = URL.createObjectURL(file);
          setImageURL(imageUrl);
        }
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        setImageURL(null);
      }
    } else if (name === "categoryid") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (value === "61" || value === "62") {
        setIsDesignationDropdown(false);
        setShowHiddenFields(true);
        setForm((prev) => ({
          ...prev,
          designation:
            value === "61" ? "Media-Journalist" : "Media-Photo/Video",
        }));
      } else {
        setIsDesignationDropdown(true);
        setShowHiddenFields(false);
        setForm((prev) => ({
          ...prev,
          designation: "",
        }));
      }
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else if (name === "designation") {
      setDesignation(value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "mobile") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (!isValidMobileNumber(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Please enter a valid mobile number.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    } else if (name === "email") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (!isValidEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Please enter a valid email address.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    } else if (name === "gender" || name === "sportid") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else if (name === "country") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else if (name === "idType") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else if (name === "idNumber") {
      const idNumberRegex = /^[a-zA-Z0-9\s\-_\/]*$/;
      if (idNumberRegex.test(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "ID number can only contain letters, numbers, spaces, hyphens, underscores, and forward slashes.",
        }));
      }
    } else {
      const isValid = /^[a-zA-Z\s]*$/.test(value);
      if (isValid && value.length <= 50) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else if (value.length > 50) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Input cannot exceed 50 characters.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only alphabetic characters and spaces are allowed.",
        }));
      }
    }
  };

  const handleOfficeIDFileChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024;
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file) {
      if (file.size > maxFileSize) {
        setOfficeIDError("File size should not exceed 1 MB.");
        setOfficeIDImageURL(null);
        e.target.value = "";
      } else if (!allowedFileTypes.includes(file.type)) {
        setOfficeIDError("Only JPEG, PNG, and JPG files are allowed.");
        setOfficeIDImageURL(null);
        e.target.value = "";
      } else {
        setOfficeIDError("");
        setForm((prev) => ({
          ...prev,
          officeIDImage: file,
        }));

        const imageUrl = URL.createObjectURL(file);
        setOfficeIDImageURL(imageUrl);
      }
    } else {
      setOfficeIDError("");
      setOfficeIDImageURL(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", form.firstname);
    formData.append("middle_name", form.middlename || "");
    formData.append("last_name", form.lastname || "");
    formData.append("email_id", form.email);
    formData.append("gender", form.gender);
    formData.append("mobile_number", form.mobile);
    formData.append("sport_id", +form.sportid || "");
    formData.append("sub_category_type", form.categoryid);
    formData.append("organisation", form.responsibleOrganization);
    formData.append("designation", form.designation || "");
    formData.append("image", form.photo);
    formData.append("officeIDImage", form.officeIDImage);

    formData.append("country_id", form.country);
    formData.append("kk_type_of_id", form.idType);
    formData.append("kk_id_number", form.idNumber);

    selectedVenueIds.forEach((id) => {
      formData.append("venue_ids", id);
    });

    formData.append("letter_of_authorization", form.letter_of_authorization || "undefined");

    // Add created_by if available
    if (userData.created_by) {
      formData.append("created_by", userData.created_by);
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/user/subAdmin/${userData.registration_data_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.statusCode === 200) {
        swal("Success", "User updated successfully!", "success");
        onUserUpdated(); // Callback to refresh the user list
        onHide(); // Close the modal
      } else {
        swal(
          "Error",
          response?.data?.message || "Failed to update user.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
      swal(
        "Error",
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({
      officeIDImage: "",
    });
    setImageURL(null);
    setOfficeIDImageURL(null);
    setSelectedVenueIds([]);
    setSelectedVenueIdsState([]);
    resetFileInputs();
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <h4>
                <label>Personal Information</label>
              </h4>
              <span className="text-red">
                * marked fields are required
              </span>
            </div>
            <div className="row justify-content-between">
              <div className="col-md-4">
                <div className="form-group mb-3">
                  <label className="mb-1">
                    <strong>
                      First Name<span className="text-red">*</span>
                    </strong>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    className="form-control"
                    placeholder="First Name"
                    value={form.firstname}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstname && (
                    <span className="text-danger">
                      {errors.firstname}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mb-3">
                  <label className="mb-1">
                    <strong>Middle Name</strong>
                  </label>
                  <input
                    type="text"
                    name="middlename"
                    className="form-control"
                    placeholder="Middle Name"
                    value={form.middlename}
                    onChange={handleChange}
                  />
                  {errors.middlename && (
                    <span className="text-danger">
                      {errors.middlename}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mb-3">
                  <label className="mb-1">
                    <strong>Last Name</strong>
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    className="form-control"
                    placeholder="Last Name"
                    value={form.lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group mb-3">
                  <strong>
                    Gender<span className="text-red">*</span>
                  </strong>
                  <select
                    name="gender"
                    className="form-control"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mb-3">
                  <label className="mb-1">
                    <strong>
                      Email<span className="text-red">*</span>
                    </strong>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email || ""}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                  {errors.email && (
                    <div className="text-danger mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mb-3">
                  <label className="mb-1">
                    <strong>
                      Mobile Number<span className="text-red">*</span>
                    </strong>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    className="form-control"
                    placeholder="Mobile Number"
                    value={form.mobile || ""}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                  {errors.mobile && (
                    <div className="text-danger mt-1">
                      {errors.mobile}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group mb-3">
                  <strong>
                    Select User Type <span className="text-red">*</span>
                  </strong>
                  <select
                    name="categoryid"
                    className="form-control"
                    value={form.categoryid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select User Type</option>
                    {subtypes
                      .filter((type) =>
                        isMedia
                          ? type.sub_category_id === 61 ||
                            type.sub_category_id === 62
                          : true
                      )
                      .map((type) => (
                        <option
                          key={type.sub_category_id}
                          value={type.sub_category_id}
                        >
                          {type.sub_category_name_view}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <strong>
                    Upload Profile Image{" "}
                    <span className="text-red">*</span>
                  </strong>
                  <div className="input-group">
                    <input
                      type="file"
                      name="photo"
                      className={`form-control ${
                        fileError ? "is-invalid" : ""
                      }`}
                      ref={fileInputRef}
                      onChange={handleChange}
                      required
                    />
                    {imageURL && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setSelectedImage(imageURL);
                          setSelectedImageAlt("Profile Image");
                          setShowImageModal(true);
                        }}
                      >
                        Preview
                      </button>
                    )}
                  </div>
                  {fileError && (
                    <div className="invalid-feedback">{fileError}</div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="mb-1">
                    <strong>
                      Responsible Organization
                      <span className="text-red">*</span>
                    </strong>
                  </label>
                  <input
                    type="text"
                    name="responsibleOrganization"
                    className="form-control"
                    placeholder="Responsible Organization"
                    value={form.responsibleOrganization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="mb-1">
                    <strong>
                      Designation<span className="text-red">*</span>
                    </strong>
                  </label>

                  {form.categoryid === "61" || form.categoryid === "62" ? (
                    <input
                      type="text"
                      name="designation"
                      className="form-control"
                      value={form.designation}
                      readOnly
                      required
                    />
                  ) : (
                    <input
                      type="text"
                      name="designation"
                      className="form-control"
                      placeholder="Enter Designation"
                      value={form.designation}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="mb-1">
                    <strong>
                      Country<span className="text-red">*</span>
                    </strong>
                  </label>
                  <select
                    name="country"
                    className="form-control"
                    value={form.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <div className="text-danger mt-1">
                      {errors.country}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="mb-1">
                    <strong>
                      ID Type<span className="text-red">*</span>
                    </strong>
                  </label>
                  <select
                    name="idType"
                    className="form-control"
                    value={form.idType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select ID Type</option>
                    <option value="Passport">Passport</option>
                    <option value="Aadhaar">Aadhaar</option>
                  </select>
                  {errors.idType && (
                    <div className="text-danger mt-1">
                      {errors.idType}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="mb-1">
                    <strong>
                      ID Number<span className="text-red">*</span>
                    </strong>
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    className="form-control"
                    placeholder="Enter ID Number"
                    value={form.idNumber}
                    onChange={handleChange}
                    required
                  />
                  {errors.idNumber && (
                    <div className="text-danger mt-1">
                      {errors.idNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="uploadLetter" className="form-label">
                    <strong>
                      Upload ID{" "}
                      <span className="text-danger">*</span>
                    </strong>
                    <i
                      className="fa fa-info-circle ms-2 text-muted"
                      title="Note: If you are a media personnel, please upload your press card. If not, you may upload either your Office ID or Aadhar card."
                      style={{ cursor: "pointer" }}
                    ></i>
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      name="officeIDImage"
                      className={`form-control ${
                        officeIDError ? "is-invalid" : ""
                      }`}
                      ref={officeIDInputRef}
                      onChange={handleOfficeIDFileChange}
                      required
                    />
                    {officeIDImageURL && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setSelectedImage(officeIDImageURL);
                          setSelectedImageAlt("ID Image");
                          setShowImageModal(true);
                        }}
                      >
                        Preview
                      </button>
                    )}
                  </div>
                  {officeIDError && (
                    <div className="invalid-feedback">
                      {officeIDError}
                    </div>
                  )}
                </div>
              </div>

              {showHiddenFields && (
                <>
                  {/* Select Venues Section */}
                  <div
                    className="col-md-4"
                    style={{ marginTop: "0px", paddingTop: "0px" }}
                  >
                    <label className="mb-1">
                      <strong>
                        Select Venues<span className="text-red">*</span>
                      </strong>
                    </label>
                    {allCitiesAndVenues.length && (
                      <GroupCityVenues
                        allCitiesAndVenues={allCitiesAndVenues}
                        setSelectedVenueIds={setSelectedVenueIds}
                        setInfinitySelected={setInfinitySelected}
                        selectedVenueIds={selectedVenueIds}
                        selectedVenueIdsState={selectedVenueIdsState}
                        setSelectedVenueIdsState={
                          setSelectedVenueIdsState
                        }
                      />
                    )}
                  </div>

                  {/* Upload Letter Section */}
                  <div className="col mb-4">
                    <label
                      htmlFor="uploadLetter"
                      className="form-label"
                    >
                      <strong>
                        Upload Letter{" "}
                        <span className="text-danger">*</span>
                      </strong>
                    </label>
                    <div
                      className="d-flex gap-4 align-items-start"
                      style={{
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "300px",
                          fontSize: "14px",
                          lineHeight: "1.6",
                        }}
                      >
                        <h6
                          style={{
                            fontWeight: "bold",
                            marginBottom: "10px",
                          }}
                        >
                          Steps to Upload:
                        </h6>
                        <ol
                          style={{
                            paddingLeft: "18px",
                            marginBottom: 0,
                          }}
                        >
                          <li>1. Download the sample format.</li>
                          <li>
                            2. Fill it out on your organization's
                            letterhead.
                          </li>
                          <li>
                            3. Re-upload the document in PDF format.
                          </li>
                        </ol>
                      </div>

                      {/* Upload Section */}
                      <div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href =
                                "Letter of Authorization Sample.pdf";
                              link.download =
                                "LetterofAuthorizationSample.pdf";
                              link.click();
                            }}
                            type="button"
                          >
                            <i className="fa fa-download me-2"></i>{" "}
                            Sample File
                          </button>
                          <input
                            type="file"
                            id="uploadLetter"
                            name="uploadLetter"
                            className="d-none"
                            ref={uploadLetterInputRef}
                            onChange={(e) => {
                              const file = e.target.files[0];

                              if (
                                file &&
                                file.type !== "application/pdf"
                              ) {
                                setUploadLetterError(
                                  "Only PDF files are allowed."
                                );
                                setUploadLetterUploaded(false);
                                e.target.value = "";
                                return;
                              }

                              if (file && file.size > 5 * 1024 * 1024) {
                                setUploadLetterError(
                                  "File size exceeds 5 MB."
                                );
                                setUploadLetterUploaded(false);
                                e.target.value = "";
                                return;
                              }

                              setUploadLetterError("");
                              handleUploadLetterChange(e);
                              setUploadLetterUploaded(true);
                            }}
                            accept=".pdf"
                            required
                          />
                          <button
                            className={`btn btn-sm ${
                              uploadLetterUploaded
                                ? "btn-success"
                                : "btn-primary"
                            }`}
                            type="button"
                            onClick={() =>
                              uploadLetterInputRef.current?.click()
                            }
                          >
                            <i
                              className={`fa ${
                                uploadLetterUploaded
                                  ? "fa-check me-2"
                                  : "fa-upload me-2"
                              }`}
                            ></i>
                            {uploadLetterUploaded
                              ? "Uploaded"
                              : "Upload"}
                          </button>
                        </div>
                        {uploadLetterError && (
                          <div className="text-danger small mt-1">
                            {uploadLetterError}
                          </div>
                        )}
                        <small
                          className="text-muted d-block mt-2"
                          style={{ fontSize: "12px", marginTop: "5px" }}
                        >
                          Supported formats: PDF (Max size: 5 MB).
                        </small>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating...
              </>
            ) : (
              "Update User"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt={selectedImageAlt}
      />
    </>
  );
};

export default EditUserForm;
