import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import axiosInstance from "../../../../services/AxiosInstance";
import { PermissionContext } from "../../permission/PermissionContext";
import MultiSelectButton from "./MultiSelectComp";
import { useAttendanceContext } from "./AttendanceContext";

const AttendanceQueryModal = () => {
  const { userTypes, sports, venues } = useContext(PermissionContext);
  const { submitData, setSubmitData, getAttendanceData } =
    useAttendanceContext();
  // console.log(setSubmitData);
  const [selectedFilters, setSelectedFilters] = useState([
    "UserType",
    "Sport",
    "Gender",
  ]);
  const [formData, setFormData] = useState(
    useState({
      userType: null,
      sport: null,
      gender: null,
      venue: null,
      zone: null,
      date: null,
      kitId: null,
    })
  );
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      if (formData.venue) {
        const res = await axiosInstance.get(`/venue/${formData.venue}/zones`);
        const { data } = res.data;
        setZones(data.zones || []);
        if (data.zones && data.zones.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            zone: data.zones[0].zone_id,
          }));
        }
      }
    };
    fetchZones();
  }, [formData.venue]);

  const [errors, setErrors] = useState({});

  const handleFilterChange = (filters) => {
    let updatedFilters = [...filters];

    if (updatedFilters.includes("Venue") && !updatedFilters.includes("Zone")) {
      updatedFilters.push("Zone");
    }

    if (!updatedFilters.includes("Venue") && updatedFilters.includes("Zone")) {
      updatedFilters = updatedFilters.filter((filter) => filter !== "Zone");
    }

    setSelectedFilters(updatedFilters);
  };

  const handleReset = () => {
    setFormData({
      userType: null,
      sport: null,
      gender: null,
      venue: null,
      zone: null,
      date: null,
      kitId: null,
    });
    setErrors({});
    setSelectedFilters(["UserType", "Sport", "Gender"]);
    swal("Success", "Filters reset and all data cleared.", "success");
  };

  const handleSubmit = () => {
    setSubmitData(JSON.parse(JSON.stringify(formData)));
    // console.log(formData);
    getAttendanceData();
  };
  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          <div className="basic-form">
            <form>
              <div
                className="row mb-3 d-flex align-items-end"
                style={{ rowGap: "12px" }}
              >
                {/* User Type Dropdown */}
                {selectedFilters.includes("UserType") && (
                  <div className="col-lg-2">
                    <label>
                      Select User Type 
                    </label>
                    <select
                      className="form-control"
                      name="userType"
                      value={formData.userType}
                      disabled={formData.userType === ""}
                      onChange={(e) =>
                        setFormData({ ...formData, userType: e.target.value })
                      }
                    >
                      <option value="">-- Select User Type --</option>
                      {userTypes.map((userType) => (
                        <option
                          key={userType.sub_category_id}
                          value={userType.sub_category_id}
                        >
                          {userType.sub_category_name_view}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sports Dropdown */}
                {selectedFilters.includes("Sport") && (
                  <div className="col-lg-2">
                    <label>Select Sports</label>
                    <select
                      className="form-control"
                      name="sport"
                      value={formData.sport}
                      onChange={(e) =>
                        setFormData({ ...formData, sport: e.target.value })
                      }
                    >
                      <option value="">-- Select Sport --</option>
                      {sports.map((sport) => (
                        <option key={sport.sport_id} value={sport.sport_id}>
                          {sport.sport_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Gender Dropdown */}
                {selectedFilters.includes("Gender") && (
                  <div className="col-lg-2">
                    <label>
                      Select Gender
                    </label>
                    <select
                      className="form-control"
                      name="gender"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="">-- Select Gender --</option>
                      <option value={1}>Male</option>
                      <option value={2}>Female</option>
                    </select>
                  </div>
                )}

                {/* Date Picker */}
                {selectedFilters.includes("Date") && (
                  <div className="col-md-2" style={{ cursor: "pointer" }}>
                    <label>
                      Select Date 
                    </label>
                    <DatePicker
                      selected={formData.date}
                      onChange={(date) => setFormData({ ...formData, date })}
                      placeholderText="-- Select Date --"
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                    />
                    {errors.date && (
                      <div className="alert alert-danger mt-1">
                        {errors.date}
                      </div>
                    )}
                  </div>
                )}

                {/* Venue Dropdown */}
                {selectedFilters.includes("Venue") && (
                  <div className="col-lg-2">
                    <label>
                      Select Venue
                    </label>
                    <select
                      className="form-control"
                      name="venue"
                      value={formData.venue}
                      onChange={(e) =>
                        setFormData({ ...formData, venue: e.target.value })
                      }
                    >
                      <option value="">-- Select Venue --</option>
                      {venues.map((venue) => (
                        <option key={venue.value} value={venue.value}>
                          {venue.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Zone Dropdown */}
                {selectedFilters.includes("Zone") && (
                  <div className="col-lg-2">
                    <label>
                      Select Zone
                    </label>
                    <select
                      className="form-control"
                      name="zone"
                      value={formData.zone}
                      onChange={(e) =>
                        setFormData({ ...formData, zone: e.target.value })
                      }
                    >
                      <option value="">-- Select Zone --</option>
                      {zones.map((zone) => (
                        <option value={zone.zone_id} key={zone.zone_id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Kit ID Input */}
                {selectedFilters.includes("Kit ID") && (
                  <div className="col-lg-2">
                    <label>
                      Kit Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="kitId"
                      value={formData.kitId}
                      onChange={(e) =>
                        setFormData({ ...formData, kitId: e.target.value })
                      }
                      placeholder="Enter Kit ID"
                    />
                  </div>
                )}

                {/* MultiSelect Button for Filters */}
                <div
                  className="col-lg-4 text-primary d-flex flex-column fit-content"
                  style={{ width: "fit-content" }}
                >
                  <label>
                    Select Filters
                  </label>
                  <MultiSelectButton
                    options={[
                      "Venue",
                      "Kit ID",
                      "Date",
                      "UserType",
                      "Sport",
                      "Gender",
                    ]}
                    onSelectionChange={handleFilterChange}
                    placeholder="Select Filters"
                  />
                </div>

                {/* Get Button */}
                <div className="col-md-2">
                  <Button
                    className="btn btn-md btn-warning"
                    onClick={() => handleSubmit()}
                  >
                    Get
                  </Button>
                </div>
                {/* Reset Button */}
                <div className="col-md-2">
                  <Button
                    className="btn btn-md btn-warning"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceQueryModal;
