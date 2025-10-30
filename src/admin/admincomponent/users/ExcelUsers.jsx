import React, { useContext, useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Button, Tooltip, OverlayTrigger, Modal } from "react-bootstrap";
import { PermissionContext } from "../permission/PermissionContext";
import axiosInstance from "../../../services/AxiosInstance";
import notify from "../../../utils/notification";
import swal from "sweetalert";

const ExcelUsers = () => {
  const [data, setData] = useState([]);
  const [imageUploadsComplete, setImageUploadsComplete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const fileInputRef = useRef(null);
  const { sports } = useContext(PermissionContext);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [officeIDImages, setOfficeIDImages,] = useState([]);
  // const [office_id_photo, set]
  const[validateAadharNumbers, invalidAadharNumbers] = useState([]);
  const [officeIDImageUploadsComplete, setOfficeIDImageUploadsComplete] =
    useState(false);

    console.log(officeIDImageUploadsComplete, "image uploaded");

  const resetInput = () => {
    setData([]);
    setSelectedCategory("");
    setSelectedSport("");
    setOfficeIDImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
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
        setUserTypes(mappedUserTypes);
      } catch (error) {
        console.error("Error fetching User Types:", error);
      }
    };

    getUserTypes();
  }, []);

  const isValidAadharNumber = (aadhar) => {
    const aadharPattern = /^[0-9]{12}$/;
    return aadharPattern.test(aadhar);
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const dataForSubmission = data.map((item, index) => ({
      firstName: item["First Name"],
      middleName: item["Middle Name"] || null,
      lastName: item["Last Name"],
      email: item["Email"],
      mobile: item["Mobile"],
      sub_category_type: item["Category ID"],
      gender: item["Gender"],
      sportId: item["Sport ID"],
      responsibleOrganization: item["Responsible Organization"],
      designation: item["Designation"],
      photo: item["PhotoPath"] || null,
      officeIDImage: item["OfficeIDImage"] || null,
      sr_no: index + 1,
    }));
  
    console.log("Submitting data:", dataForSubmission);
  
    axiosInstance
      .post("/user/bulk-candidate", dataForSubmission)
      .then((response) => {
        const { data } = response;
  
        if (data?.statusCode === 200) {
          // Check for duplicate users
          if (data?.data?.duplicateUser) {
            const duplicateUsers = Object.values(data.data.duplicateUser);
  
            setModalMessage(
              `The following users are duplicates and were not added:\n\n${duplicateUsers.join(
                "\n"
              )}\n\nPlease ensure these users are not already in the system before re-uploading.`
            );
            setShowModal(true);
          } else {
            swal("Success", "User data submitted successfully!", "success");
            resetInput();
          }
        } else {
          notify(
            "error",
            data?.message || "An unexpected error occurred. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error submitting data:",
          error.response?.data || error.message
        );
  
        const errorMessage =
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.";
        notify("error", errorMessage);
      });
  };
  

  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawData = new Uint8Array(event.target.result);
        const workbook = XLSX.read(rawData, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        const isValidPhoneNumber = (phone) => {
          const phonePattern = /^[0-9]{10}$/;
          return phonePattern.test(phone);
        };
  
        const isValidName = (name) => {
          return name && /^[a-zA-Z\s]*$/.test(name) && name.length <= 50;
        };
  
        // Validate Aadhar numbers
        const invalidAadharNumbers = jsonData.filter(
          (item) => !isValidAadharNumber(item["Aadhar Number"])
        );
  
        const invalidPhoneNumbers = jsonData.filter(
          (item) => !isValidPhoneNumber(item["Mobile"])
        );
  
        const invalidNames = jsonData.filter(
          (item) =>
            !isValidName(item["First Name"]) || !isValidName(item["Last Name"])
        );
  
        if (invalidAadharNumbers.length > 0) {
          setModalMessage(
            `Please correct the following invalid Aadhar numbers in your sheet:\n\n${invalidAadharNumbers
              .map((item) => item["Aadhar Number"])
              .join("\n")}\n\nAadhar numbers must be exactly 12 digits.`
          );
          setShowModal(true);
          return;
        }
  
        if (invalidPhoneNumbers.length > 0) {
          setModalMessage(
            `Please correct the following invalid phone numbers in your sheet:\n\n${invalidPhoneNumbers
              .map((item) => item["Mobile"])
              .join("\n")}\n\nPhone numbers must be exactly 10 digits.`
          );
          setShowModal(true);
          return;
        }
  
        if (invalidNames.length > 0) {
          setModalMessage(
            `Please correct the following invalid names in your sheet:\n\n${invalidNames
              .map(
                (item) =>
                  `First Name: ${item["First Name"]}, Last Name: ${item["Last Name"]}`
              )
              .join("\n")}\n\nNames must contain only alphabetic characters and spaces, and cannot exceed 50 characters.`
          );
          setShowModal(true);
          return;
        }
  
        const dataWithPhoto = jsonData.map((item) => ({
          ...item,
          "Category ID": selectedCategory,
          "Sport ID": selectedSport,
        }));
  
        setData(dataWithPhoto);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  

  const handleOfficeIDImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newOfficeIDImages = [...officeIDImages];
      newOfficeIDImages[index] = file;
      setOfficeIDImages(newOfficeIDImages);

      const allOfficeIDImagesUploaded = newOfficeIDImages.every(
        (img) => img != null
      );
      setOfficeIDImageUploadsComplete(allOfficeIDImagesUploaded);
    }
  };

  const handleRemoveOfficeIDImage = (index) => {
    const newOfficeIDImages = [...officeIDImages];
    newOfficeIDImages[index] = null;
    setOfficeIDImages(newOfficeIDImages);

    const allOfficeIDImagesUploaded = newOfficeIDImages.every(
      (img) => img != null
    );
    setOfficeIDImageUploadsComplete(allOfficeIDImagesUploaded);
  };

  const office_id_photo = (e, index) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024;

    if (file) {
      if (file.size > maxFileSize) {
        alert("File size should not exceed 1 MB.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("id", index + 1);

      axiosInstance
        .post("/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const updatedData = [...data];
          const filePath = Object.values(response?.data?.data)?.[0];
          updatedData[index]["PhotoPath"] = filePath;
          updatedData[index]["Photo"] = URL.createObjectURL(file);
          setData(updatedData);

          const allImagesUploaded = updatedData.every(
            (item) => item["PhotoPath"] && item["PhotoPath"] !== "No Image"
          );
          setOfficeIDImageUploadsComplete(allImagesUploaded);

        })
        .catch((error) => {
          console.error(
            "Error uploading image:",
            error.response?.data || error.message
          );
        });
    }
  }

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024;

    if (file) {
      if (file.size > maxFileSize) {
        alert("File size should not exceed 1 MB.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("id", index + 1);

      axiosInstance
        .post("/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const updatedData = [...data];
          const filePath = Object.values(response?.data?.data)?.[0];
          updatedData[index]["PhotoPath"] = filePath;
          updatedData[index]["Photo"] = URL.createObjectURL(file);
          setData(updatedData);

          const allImagesUploaded = updatedData.every(
            (item) => item["PhotoPath"] && item["PhotoPath"] !== "No Image"
          );
          setImageUploadsComplete(allImagesUploaded);
        })
        .catch((error) => {
          console.error(
            "Error uploading image:",
            error.response?.data || error.message
          );
        });
    }
  };

  const handleRemoveImage = (index) => {
    const updatedData = [...data];
    const filePath = updatedData[index]["PhotoPath"];

    if (filePath) {
      axiosInstance
        .delete("/uploads", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            filename: filePath,
          },
        })
        .then((response) => {
          console.log("Image deleted successfully:", response.data);

          updatedData[index]["Photo"] = null;
          updatedData[index]["PhotoPath"] = null;
          setData(updatedData);
        })
        .catch((error) => {
          console.error(
            "Error deleting image:",
            error.response?.data || error.message
          );
        });
    } else {
      console.error("No file path found for deletion.");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
  }

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <label className="mb-1">
            <h3>
              <strong>Import from Excel</strong>
            </h3>
          </label>
          <div className="pb-2 row align-items-end justify-content-center">
            <div className="col-md-3">
              <div className="form-group mb-3">
                <strong>
                  Select User Type<span className="text-red">*</span>
                </strong>
                <select
                  name="categoryid"
                  className="form-control"
                  required
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <option value="">Select User Type</option>
                  {userTypes.map((type) => (
                    <option key={type.sub_category_id} value={type.sub_category_id}>
                      {type.sub_category_name_view}
                    </option>
                  ))}
                </select>
              </div>
            </div>
  
            <div className="col-md-3">
              <div className="form-group mb-3">
                <strong>Select Sport</strong>
                <select
                  name="sportid"
                  className="form-control"
                  onChange={handleSportChange}
                  value={selectedSport}
                >
                  <option value="">Select Sport</option>
                  {sports.map((type) => (
                    <option key={type.sport_id} value={type.sport_id}>
                      {type.sport_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
  
            <div className="col-md-3">
              <div className="form-group mb-3 d-flex flex-column gap-2 w-100">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip-2" hidden={selectedCategory}>
                      Category must be selected
                    </Tooltip>
                  }
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="form-control"
                    accept=".xlsx, .xls"
                    onChange={handleExcelImport}
                    style={{ padding: "5px" }}
                    disabled={!selectedCategory}
                  />
                </OverlayTrigger>
              </div>
            </div>
  
            <div
              className="col-md-3 form-group mb-3 d-flex gap-2"
              style={{ height: "50px" }}
            >
              <Button
                onClick={resetInput}
                variant="primary"
                className="mt-2 btn btn"
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "importExcel.xlsx";
                  link.download = "SampleSheet.xlsx";
                  link.click();
                }}
                variant="primary"
                className="mt-2"
              >
                <i
                  className="bi bi-download"
                  style={{ marginRight: "8px" }}
                ></i>
                Sample Excel
              </Button>
            </div>
          </div>
  
          <form onSubmit={handleSubmit}>
            <div className="w-100 table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>First Name</th>
                    <th>Middle Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Photo</th>
                    <th>ID Image</th>
                    <th>Category ID</th>
                    <th>Gender</th>
                    <th>Sport ID</th>
                    {/* <th>Responsible Organization</th> */}
                    <th>Designation</th>
                    <th>Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item["First Name"] || "N/A"}</td>
                        <td>{item["Middle Name"]}</td>
                        <td>{item["Last Name"]}</td>
                        <td>{item["Email"] || "N/A"}</td>
                        <td>{item["Mobile"] || "N/A"}</td>
                        <td>{item["Office ID"] || "N/A"}</td>
                        <td>
                          {userTypes.find(
                            (cat) => cat.sub_category_id == item["Category ID"]
                          )?.sub_category_name_view || "N/A"}
                        </td>
                        <td>
                          {item["Gender"] == 1 ? "Male" : "Female" || "N/A"}
                        </td>
                        <td>
                          {sports.find(
                            (cat) => cat.sport_id == item["Sport ID"]
                          )?.sport_name || "N/A"}
                        </td>
                        <td>{item["Responsible Organization"] || "N/A"}</td>
                        <td>{item["Designation"] || "N/A"}</td>
                        <td>
                          <div className="d-flex" style={{ gap: "10px" }}>
                            {item["Photo"] ? (
                              <img
                                src={item["Photo"]}
                                alt="User"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              "No Image"
                            )}
                            <div
                              className="d-flex"
                              style={{ flexDirection: "column" }}
                            >
                              {!item["officePhotoPath"] ? (
                                <input
                                  type="file"
                                  onChange={(e) => handleImageChange(e, index)}
                                  accept="image/*"
                                  style={{ margin: "10px" }}
                                />
                              ) : (
                                <Button
                                  variant="danger"
                                  onClick={() => handleRemoveImage(index)}
                                  style={{ margin: "10px" }}
                                >
                                  Remove Image
                                </Button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex" style={{ gap: "10px" }}>
                            {!item["OfficeIDImage"] ? (
                              <input
                                type="file"
                                onChange={(e) =>
                                  office_id_photo(e, index)
                                }
                                accept="image/*"
                                style={{ margin: "10px" }}
                              />
                            ) : (
                              <Button
                                variant="danger"
                                onClick={() => handleRemoveOfficeIDImage(index)}
                                style={{ margin: "10px" }}
                              >
                                Remove ID Image
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center">
                        No data available. Please upload an Excel file.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-submit">
                    {!imageUploadsComplete || !officeIDImageUploadsComplete
                      ? "All images and ID images must be uploaded before submitting."
                      : ""}
                  </Tooltip>
                }
              >
                <button
                  type="submit"
                  className="btn btn-primary btn-md"
                  disabled={
                    !imageUploadsComplete ||
                     !officeIDImageUploadsComplete
                  }
                >
                  Submit
                </button>
              </OverlayTrigger>
            </div>
          </form>
  
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <pre>{modalMessage}</pre>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
  
};

export default ExcelUsers;
