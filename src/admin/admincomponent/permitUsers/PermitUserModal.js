import React, { useContext, useState, useCallback } from "react";
import { Alert, Button } from "react-bootstrap";
import { PermissionContext } from "../permission/PermissionContext";
import { PermitUserContext } from "./PermitUserContext";
import PermitUserList from "./PermitUserList";

const PermitUserModal = () => {
  const { sports, userTypes } = useContext(PermissionContext);
  const { 
    getPermitUserData, 
    setUserType, 
    setGender, 
    setSport, 
    setSubSportId,
    setPage 
  } = useContext(PermitUserContext);

  const [formData, setFormData] = useState({
    userType: "",
    sport: "",
    gender: "",
    sub_sport: "",
  });
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  }, []);

  const resetFilter = useCallback(() => {
    setFormData({
      userType: "",
      sport: "",
      gender: "",
      sub_sport: "",
    });
    
    // Reset all filters at once to prevent multiple fetches
    setPage(1);
    setUserType(null);
    setGender(null);
    setSport(null);
    setSubSportId(null);
  }, [setUserType, setGender, setSport, setSubSportId, setPage]);

  const handleGetData = useCallback(async () => {
    if (!formData.userType || !formData.gender) {
      setError("Please select User Type and Gender before proceeding.");
      return;
    }

    try {
      // Set all filters at once to minimize re-renders
      setPage(1);
      
      // Use the getPermitUserData directly with form values instead of setting state
      await getPermitUserData(
        formData.userType,
        formData.sport,
        formData.gender,
        formData.sub_sport,
        true
      );
      
      // Update filter states after successful data fetch
      setUserType(formData.userType);
      setSport(formData.sport);
      setGender(formData.gender);
      setSubSportId(formData.sub_sport);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
  }, [formData, setPage, setUserType, setSport, setGender, setSubSportId, getPermitUserData]);

  const selectedSport = formData.sport 
    ? sports.find(sport => sport.sport_id == formData.sport)
    : null;

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          <div className="basic-form">
            {error && <Alert variant="danger">{error}</Alert>}
            <form onSubmit={e => e.preventDefault()}>
              <div className="row mb-3 d-flex align-items-end">
                {/* Form fields remain the same */}
                <div className="col-lg-2">
                  <label>Select User Type <span className="text-danger">*</span></label>
                  <select
                    className="form-control"
                    name="userType"
                    onChange={handleChange}
                    value={formData.userType}
                  >
                    <option value="">Select User Type</option>
                    {userTypes.map((type) => (
                      <option key={type.sub_category_id} value={type.sub_category_id}>
                        {type.sub_category_name_view}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-lg-2">
                  <label>Select Sport</label>
                  <select
                    className="form-control"
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

                {selectedSport?.categories?.length > 0 && (
                  <div className="col-lg-2">
                    <label>Select Sub Sport</label>
                    <select
                      className="form-control"
                      name="sub_sport"
                      onChange={handleChange}
                      value={formData.sub_sport}
                    >
                      <option value="">Select All</option>
                      {selectedSport.categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.sportname}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="col-lg-2">
                  <label>Select Gender <span className="text-danger">*</span></label>
                  <select
                    className="form-control"
                    name="gender"
                    onChange={handleChange}
                    value={formData.gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Both</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <Button
                    className="btn btn-md btn-primary"
                    onClick={handleGetData}
                  >
                    Get Data
                  </Button>
                </div>
                <div className="col-md-2">
                  <Button
                    className="btn btn-md btn-primary"
                    onClick={resetFilter}
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            </form>
            <PermitUserList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermitUserModal;