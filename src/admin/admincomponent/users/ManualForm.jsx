import React, { useEffect, useRef, useState } from "react";
import swal from "sweetalert";
import axiosInstance from "../../../services/AxiosInstance";
import { useLocation } from "react-router-dom";


import axios from "axios";
import GroupCityVenues from "./GroupCityVenues";
import ImageModal from "../../../components/ImageModal";
import SearchableUserTypeDropdown from "../permission/SearchableUserTypeDropdown";

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

const ManualForm = () => {
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
  const [sharedToken, setSharedToken] = useState(null);
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
  const [isShared, setIsShared] = useState(null);

  const getUserTypes = async () => {
    try {
      console.log("Fetching user types...");
      const response = await axiosInstance.get("/user-sub-type/all?page=1&limit=100");
      const data = response.data?.data || [];
      console.log("User types API response:", data);
      // Map the API response format to the expected format
      const mappedUserTypes = data.map((item) => ({
        id: item.sub_category_id,
        sub_category_id: item.sub_category_id,
        sub_category_name_view: item.sub_category_name_view
      }));
      console.log("Mapped user types:", mappedUserTypes);
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
    const loadData = async () => {
      await getUserTypes();
      getSports();
      getCountries();
    };
    loadData();
  }, []);


  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    const encryptedQR = query.get("by");
    const mediaForm = query.get("type");
    const usertypeId = query.get("usertype_id");

    console.log("URL parameters - encryptedQR:", encryptedQR, "mediaForm:", mediaForm, "usertypeId:", usertypeId);

    if (mediaForm && mediaForm === "media") {
      setIsMedia(true);
    }

    // Handle usertype_id parameter - this takes priority over token
    if (usertypeId && usertypeId !== "undefined" && usertypeId !== "null" && usertypeId !== "") {
      const idNum = parseInt(usertypeId, 10);
      if (Number.isFinite(idNum) && idNum > 0) {
        console.log("usertype_id from URL:", idNum);
        console.log("Setting sharedUserType to:", String(idNum));
        setSharedUserType(String(idNum));
        setIsShared(true);
      }
    }

    if (encryptedQR) {
      try {
        setSharedToken(encryptedQR);
        
        const decodedToken = JSON.parse(
          window.atob(encryptedQR?.split(".")[1])
        );
        console.log("decoded token", decodedToken);

        if (decodedToken) {
          setIsShared(true);
          setCreatedBy(decodedToken.shared_by);
          // Only set sharedUserType from token if usertype_id is not provided
          if (!usertypeId && decodedToken.userType) {
            const idNum = parseInt(decodedToken.userType, 10);
            if (Number.isFinite(idNum) && idNum > 0) {
              setSharedUserType(String(idNum));
            }
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  // Process URL parameters after subtypes are loaded
  useEffect(() => {
    if (subtypes.length > 0 && sharedUserType) {
      console.log("Processing URL parameters after subtypes loaded");
      const idNum = parseInt(sharedUserType, 10);
      const isValid = Number.isFinite(idNum) && subtypes.some((t) => Number(t.sub_category_id) === idNum);
      
      if (isValid) {
        console.log("URL parameter is valid, setting form values");
        setForm((prev) => ({
          ...prev,
          categoryid: String(idNum),
        }));
        setUserType(String(idNum));
      } else {
        console.log("URL parameter is invalid, clearing sharedUserType");
        setSharedUserType(null);
      }
    }
  }, [subtypes, sharedUserType]);

  function isValidMobileNumber(number) {
    const MOBILE_NUMBER_REGEX = /^(?:\+91|0)?[6-9]\d{9}$/;
    return MOBILE_NUMBER_REGEX.test(number);
  }

  function isValidEmail(email) {
    const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return EMAIL_REGEX.test(email);
  }

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setForm((prev) => ({
  //       ...prev,
  //       [event.target.name]: file,
  //     }));
  //   }
  // };

  const handleUploadLetterChange = async (e) => {
    const file = e.target.files[0];
    const fieldId = "letter_of_authorization";

    setUploadLetterError(""); // Clear previous error

    if (!file) {
      setUploadLetterError("Please select a file to upload.");
      return;
    }

    // if (!UPLOAD_FIELDS[fieldId].acceptedTypes.includes(file.type)) {
    //   setUploadLetterError("Invalid file type. Please upload a PDF or Word document.");
    //   e.target.value = "";
    //   return;
    // }

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
      // Handle file input changes
      const file = files[0];
      const maxFileSize = 1 * 1024 * 1024; // 1 MB size limit
      const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (file) {
        if (file.size > maxFileSize) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "File size should not exceed 1 MB.",
          }));
          e.target.value = ""; // Clear file input
          setImageURL(null); // Clear preview
        } else if (!allowedFileTypes.includes(file.type)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Only JPEG, PNG, and JPG files are allowed.",
          }));
          e.target.value = ""; // Clear file input
          setImageURL(null); // Clear preview
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
          setForm((prev) => ({
            ...prev,
            [name]: file,
          }));

          // ✅ Add Image Preview
          const imageUrl = URL.createObjectURL(file);
          setImageURL(imageUrl);
        }
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        setImageURL(null);
      }
    } else if (name === "categoryid") {
      // Prevent changes to user type if it's locked by a valid shared id
      const idNum = parseInt(sharedUserType, 10);
      const locked = Number.isFinite(idNum) && subtypes.some((t) => Number(t.sub_category_id) === idNum);
      if (locked) {
        return;
      }
      
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
      // Allow alphanumeric characters and common symbols for ID numbers
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
    const maxFileSize = 1 * 1024 * 1024; // 1MB limit
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file) {
      if (file.size > maxFileSize) {
        setOfficeIDError("File size should not exceed 1 MB.");
        setOfficeIDImageURL(null); // Clear preview URL
        e.target.value = ""; // Reset input field
      } else if (!allowedFileTypes.includes(file.type)) {
        setOfficeIDError("Only JPEG, PNG, and JPG files are allowed.");
        setOfficeIDImageURL(null); // Clear preview URL
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

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const maxFileSize = 1 * 1024 * 1024;
  //   const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  //   if (file) {
  //     if (file.size > maxFileSize) {
  //       setFileError("File size should not exceed 1 MB.");
  //       e.target.value = "";
  //     } else if (!allowedFileTypes.includes(file.type)) {
  //       setFileError("Only JPEG, PNG, and JPG files are allowed.");
  //       e.target.value = "";
  //     } else {
  //       setFileError("");
  //       setForm((prev) => ({
  //         ...prev,
  //         photo: file,
  //       }));
  //     }
  //   } else {
  //     setFileError("");
  //   }
  // };

  // const handleRemove = async (fieldId) => {
  //   try {
  //     const fileUrl = imageUrls[fieldId];
  //     if (!fileUrl) return;

  //     const response = await axiosInstance.delete("/uploads", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //       data: {
  //         id: fieldId,
  //         filename: fileUrl,
  //       },
  //     });

  //     if (response.data.success) {
  //       setImageUrls((prev) => ({
  //         ...prev,
  //         [fieldId]: "",
  //       }));
  //       setErrors((prev) => ({
  //         ...prev,
  //         [fieldId]: null,
  //       }));
  //       swal("Success", "File deleted successfully!", "success");
  //     }
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     swal("Error", "Failed to delete file. Please try again.", "error");
  //   }
  // };
  // const handleDeleteImage = () => {
  //   setUploadedImage(null);
  // };

  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstname", form.firstname);
    formData.append("middlename", form.middlename || "");
    formData.append("lastname", form.lastname || "");
    formData.append("email", form.email);
    formData.append("gender", form.gender);
    formData.append("mobile_number", form.mobile);
    formData.append("sports_id", +form.sportid || "");
    formData.append("sub_category_type", form.categoryid);
    formData.append("organisation", form.responsibleOrganization);
    formData.append("designation", form.designation || "");
    formData.append("image", form.photo);
    formData.append("officeIDImage", form.officeIDImage);

    formData.append("country", form.country);
    formData.append("idType", form.idType);
    formData.append("idNumber", form.idNumber);
    formData.append("created_by", createdby);

    selectedVenueIds.forEach((id) => {
      formData.append("venue_ids", id);
    });

    formData.append("letter_of_authorization", form.letter_of_authorization);
    if (sharedToken) {
      formData.append("shared_token", sharedToken);
      console.log("Shared token added to form data:", sharedToken);
    }

    try {
      const authToken = localStorage.getItem("access_token");

      if (authToken && location.pathname === "/create-new-user") {
        const apiUrl = `/user/subAdmin`;
        setLoading(true);
        const response = await axiosInstance.post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response?.data?.statusCode === 200) {
          swal("Success", "User created successfully!", "success");
          setForm(initialForm);
          setSelectedVenueIds([]);
          setSelectedVenueIdsState([]);
          resetFileInputs();
          document.querySelector('input[name="officeIDImage"]').value = "";
        } else {
          swal(
            "Error",
            response?.data?.message || "Failed to create user.",
            "error"
          );
        }
      } else {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/user/registrationform`;
        setLoading(true);
        const response = await axios.post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response?.data?.statusCode === 200) {
          swal(
            "Success",
            "Registration form submitted successfully!",
            "success"
          );
          setForm(initialForm);
          setSelectedVenueIds([]);
          setSelectedVenueIdsState([]);
          resetFileInputs();
          document.querySelector('input[name="officeIDImage"]').value = "";
        } else {
          swal(
            "Error",
            response?.data?.message || "Failed to submit form.",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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

  return (
    <div className="d-flex justify-content-center" style={{ minWidth: "80vw" }}>
      <div
        className="row justify-content-center h-100 align-items-center"
        style={{ minWidth: "80vw" }}
      >
        <div className="mt-0 mb-0">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div
                  className="auth-form"
                  style={{
                    minHeight: "90vh",
                    height: "auto",
                    overflowY: "auto",
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <h3
                      style={{
                        width: "274px",
                        height: "38px",
                        position: "absolute",
                        textAlign: "center",
                        lineHeight: "38px",
                        fontSize: "24px",
                        opacity: "1",
                      }}
                    >
                      Accreditation Form
                    </h3>
                  </div>
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
                            // required
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
                          <SearchableUserTypeDropdown
                            userTypes={subtypes.filter((type) =>
                              isMedia
                                ? type.sub_category_id === 61 ||
                                  type.sub_category_id === 62
                                : true
                            )}
                            value={(() => {
                              const val = sharedUserType || form.categoryid;
                              console.log("SearchableUserTypeDropdown value calculation - sharedUserType:", sharedUserType, "form.categoryid:", form.categoryid, "final value:", val);
                              return val;
                            })()}
                            onChange={(value) => {
                              console.log("SearchableUserTypeDropdown onChange called with:", value);
                              const event = {
                                target: {
                                  name: "categoryid",
                                  value: value
                                }
                              };
                              handleChange(event);
                            }}
                            placeholder="Select User Type"
                            required={true}
                            disabled={(() => {
                              const idNum = parseInt(sharedUserType, 10);
                              const isDisabled = Number.isFinite(idNum) &&
                                subtypes.some((t) => Number(t.sub_category_id) === idNum);
                              console.log("SearchableUserTypeDropdown disabled:", isDisabled, "sharedUserType:", sharedUserType);
                              return isDisabled;
                            })()}
                            className="form-control"
                          />
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

                      {/* </div> */}

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

                          {userType === "61" || userType === "62" ? (
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
                            <option value="passport">Passport</option>
                            <option value="aadhaarcard">Aadhaar</option>
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

                    <div
                      className="d-flex justify-content-center align-items-center mb-6 height: 100px"
                      style={{ height: "100px" }}
                    >
                      {/* <button
                        className="btn btn-primary"
                        type="submit"
                        style={{
                          width: "285px",
                          height: "42px",
                          top: "930px",
                          left: "577px",
                          gap: "0px",
                          opacity: "0px",
                          background:
                            "linear-gradient(90deg, #2A1647 0%, #7942D1 100%)",
                        }}
                      >
                        Submit
                      </button> */}

                      <button
                        className="btn btn-primary d-flex align-items-center justify-content-center"
                        type="submit"
                        style={{
                          width: "285px",
                          height: "42px",
                          top: "930px",
                          left: "577px",
                          opacity: "1",
                        }}
                        disabled={loading} // Disable button while loading
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Submitting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt={selectedImageAlt}
      />
    </div>
  );
};
export default ManualForm;
