import React, { useContext, useState } from "react";
import swal from "sweetalert";
import { Button, Alert } from "react-bootstrap";
import MutliSelect from "./multipleselect";
import { PermissionContext } from "../../permission/PermissionContext";

const AttendanceTrackingSettings = () => {
  const [trackingMethod, setTrackingMethod] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [allowReentry, setAllowReentry] = useState(false);
  const [maxEntries, setMaxEntries] = useState("");
  const [selectedUserTypes, setSelectedUserTypes] = useState([]); 
  const [errors, setErrors] = useState({});
  const { userTypes } = useContext(PermissionContext);

  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const handleSave = () => {
    setErrors({});

    if (!trackingMethod || !checkInTime || !checkOutTime || selectedUserTypes.length === 0) {
      setErrors({ form: "All fields are required!" });
      return;
    }

    if (convertToMinutes(checkOutTime) <= convertToMinutes(checkInTime)) {
      setErrors({ time: "Check-Out Time must be greater than Check-In Time." });
      return;
    }

    const settings = {
      trackingMethod,
      checkInTime,
      checkOutTime,
      allowReentry,
      maxEntries,
      userTypes: selectedUserTypes.map(userType => userType.value),  // Only store the `value`
    };

    console.log("Saved Settings:", settings);
    swal("Success", "Settings saved successfully!", "success");
  };

  const handleReset = () => {
    setTrackingMethod("");
    setCheckInTime("");
    setCheckOutTime("");
    setAllowReentry(false);
    setMaxEntries("");
    setSelectedUserTypes([]);
    setErrors({});
    swal("Success", "All fields have been reset.", "success");
  };

  const userTypeOptions = userTypes.map((type) => ({
    label: type.sub_category_name_view,
    value: type.sub_category_id,
  }));

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          <div className="basic-form">
            {errors.form && <Alert variant="danger">{errors.form}</Alert>}
            {errors.time && <Alert variant="danger">{errors.time}</Alert>}

            <form>
              <div className="row mb-3 d-flex align-items-end">
                <div className="col-md-2">
                  <Button className="btn btn-md btn-warning" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>

              <div className="row mb-3 d-flex align-items-end">
                <div className="col-lg-3">
                  <label>
                    Select User Type <span className="text-danger">*</span>
                  </label>
                  <MutliSelect
                    selected={selectedUserTypes}
                    setSelected={setSelectedUserTypes}
                    options={userTypeOptions}
                  />
                </div>

                <div className="col-lg-9">
                  <label>
                    Tracking Methods <span className="text-danger">*</span>
                  </label>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <input
                        type="radio"
                        value="QR Code"
                        checked={trackingMethod === "QR Code"}
                        onChange={(e) => setTrackingMethod(e.target.value)}
                      />
                      QR Code
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <input
                        type="radio"
                        value="Facial Recognition"
                        checked={trackingMethod === "Facial Recognition"}
                        onChange={(e) => setTrackingMethod(e.target.value)}
                      />
                      Facial Recognition
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <input
                        type="radio"
                        value="Both"
                        checked={trackingMethod === "Both"}
                        onChange={(e) => setTrackingMethod(e.target.value)}
                      />
                      Both
                    </label>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label>
                    Check In Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </div>

                <div className="col-lg-6">
                  <label>
                    Check Out Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-lg-12">
                  <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Multiple Entry Setting
                  </h5>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      style={{ transform: "scale(1.5)" }}
                      checked={allowReentry}
                      onChange={() => setAllowReentry(!allowReentry)}
                    />
                    Allow Re-Entry
                  </label>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label>
                    Max Entries per Day <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={maxEntries}
                    onChange={(e) => setMaxEntries(e.target.value)}
                    disabled={!allowReentry}
                  />
                </div>
              </div>

              <div className="row mb-3 d-flex justify-content-end">
                <div className="col-md-2">
                  <Button className="btn btn-md btn-success" onClick={handleSave}>
                    Save
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

export default AttendanceTrackingSettings;
