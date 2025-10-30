import React, { useState, useEffect, useContext } from "react";
import { Button, Alert } from "react-bootstrap";
import swal from "sweetalert";
import { PermissionContext } from "./PermissionContext";
import PermissionList from "./PermissionList";
// import CreateModal from "./CreateModal"; // kept for reference per request
import CreatePermissionModal from "../../../jsx/components/common/CreatePermissionModal.jsx";
import CreateModal from "./CreateModal.js";
import SearchableUserTypeDropdown from "./SearchableUserTypeDropdown";

const PermissionModal = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    sports,
    permissionList, 
    setPermissionList,
    userTypes,
    getPermissionData,
  } = useContext(PermissionContext);

  const [formData, setFormData] = useState({
    userType: "",
    sport: null,
    gender: "",
    sub_sport: "",
  });
  const [error, setError] = useState("");

  const handleCommonCreate = (payload) => {
    try {
      swal("Success", "Permission details captured.", "success");
    } catch (e) {
      swal("Error", "Failed to create permission.", "error");
    }
  };

  const openModal = () => {
    if (!formData.userType || !formData.gender) {
      swal(
        "Incomplete Form",
        "Please select User Type and Gender before proceeding.",
        "warning"
      );
      return;
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      let updatedFormData = {
        ...prevFormData,
        [name]: value,
      };

      if (name === "sport" && prevFormData.sub_sport !== "") {
        updatedFormData.sub_sport = "";
      }

      return updatedFormData;
    });

    setError("");
  };

  const handleGetData = async () => {
    if (!formData.userType || !formData.gender) {
      swal(
        "Incomplete Form",
        "Please select User Type and Gender before proceeding.",
        "warning"
      );
      return;
    }

    try {
      const response = await getPermissionData(
        formData.userType,
        formData.sport,
        formData.gender,
        formData.sub_sport
      );
      if (response.data?.length === 0) {
        swal({
          title: "No Data Found",
          text: "There is no matching permission in the list. Would you like to create a new permission?",
          icon: "warning",
          buttons: {
            cancel: "Close",
            confirm: {
              text: "Create Permission",
              value: true,
              visible: true,
              className: "btn-success",
            },
          },
        }).then((value) => {
          if (value) {
            setShowModal(true);
          }
        });
      } else {
        swal("Success", "Data fetched successfully!", "success");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      swal("Error", "Failed to fetch data. Please try again later.", "error");
    }
  };

  const handleReset = async () => {
    setFormData({
      userType: "",
      sport: "",
      gender: "",
      sub_sport: "",
    });

    setError("");

    try {
      const response = await getPermissionData();
      setPermissionList(response);
      swal("Success", "Filters reset and all data fetched.", "success");
    } catch (error) {
      console.error("Error resetting data:", error);
      swal(
        "Error",
        "Failed to reset and fetch data. Please try again later.",
        "error"
      );
    }
  };

  const handleRefresh = async () => {
    try {
      // Refresh all data without any filters
      const response = await getPermissionData();
      setPermissionList(response);
      swal("Success", "Page refreshed and all data fetched successfully!", "success");
    } catch (error) {
      console.error("Error refreshing data:", error);
      swal("Error", "Failed to refresh data. Please try again later.", "error");
    }
  };

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          <div className="basic-form">
            {error && <Alert variant="danger">{error}</Alert>}
            <form className="w-full">
              <div className="mb-3 d-flex flex-column flex-md-row align-items-stretch justify-content-between w-100 gap-3">
                {/* Left group: Selects at row start */}
                <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-end gap-3 flex-wrap flex-grow-1">
                  {/* User Type Dropdown */}
                  <div className="col-12 col-md-auto">
                    <label>
                      Select User Type <span className="text-danger">*</span>
                    </label>
                    <SearchableUserTypeDropdown
                      userTypes={userTypes}
                      value={formData.userType}
                      onChange={(value) => handleChange({ target: { name: "userType", value } })}
                      placeholder="Select User Type"
                      required={true}
                    />
                  </div>

                  {/* Sports Dropdown */}
                  <div className="col-12 col-md-auto">
                    <label>Select Sport</label>
                    <select
                      className="form-select select-brand w-100"
                      name="sport"
                      onChange={handleChange}
                      value={formData.sport}
                    >
                      <option value="">Select Sport</option>
                      {sports.map((type) => (
                        <option key={type.sport_id} value={type.sport_id}>
                          {type.sport_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sub Sport Dropdown (Conditional Rendering) */}
                  {formData.sport &&
                    sports.find((sport) => sport.sport_id == formData.sport)
                      ?.categories?.length > 0 && (
                      <div className="col-12 col-md-auto">
                        <label>Select Sub Sport</label>
                        <select
                          className="form-select select-brand w-100"
                          name="sub_sport"
                          onChange={handleChange}
                          value={formData.sub_sport}
                        >
                          <option value="">Select All</option>
                          {sports
                            .find((sport) => sport.sport_id == formData.sport)
                            ?.categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.sportname}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                  {/* Gender Dropdown */}
                  <div className="col-12 col-md-auto">
                    <label>
                      Select Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select select-brand w-100"
                      style={{ minWidth: "160px" }}
                      name="gender"
                      onChange={handleChange}
                      value={formData.gender}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                {/* Right group: Buttons aligned to row end */}
        <div className="d-flex align-items-center gap-2 ms-auto justify-content-start justify-content-md-end flex-wrap mt-3 mt-md-0">
          {/* d-flex align-items-center gap-2 ms-auto */}
                  <Button className="btn w-fit btn-primary" onClick={handleGetData}>
                    Get Data
                  </Button>
                  <Button className="btn w-fit btn-info" onClick={handleRefresh}>
                    Refresh
                  </Button>
                  <Button className="btn w-fit btn-warning" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button className="btn w-fit btn-success" onClick={openModal}>
                    Create Permission
                  </Button>
                </div>
              </div>
            </form>

            <PermissionList 
              userType={formData.userType}
              gender={formData.gender}
              sport={formData.sport}
              subSportId={formData.sub_sport}
            />
          </div>
        </div>
      </div>

      <CreateModal
        show={showModal}
        handleClose={closeModal}
        userType={formData.userType}
        gender={formData.gender}
        sport={formData.sport}
        subSportId={formData.sub_sport}
      />
     

      {/* <CreatePermissionModal
        open={showModal}
        onClose={closeModal}
        onCreate={handleCommonCreate}
      /> */}
    </div>
  );
};

export default PermissionModal;
