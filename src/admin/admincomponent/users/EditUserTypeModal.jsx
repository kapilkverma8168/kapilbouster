import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../../../services/AxiosInstance";
import swal from "sweetalert";

const EditUserTypeModal = ({ show, onHide, userData, onUserUpdated }) => {
  const [subtypes, setSubTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && userData) {
      // Set the current user type
      setSelectedUserType(userData.sub_category_id || userData?.sub_category?.sub_category_id || "");
      fetchUserTypes();
    }
  }, [show, userData]);

  const fetchUserTypes = async () => {
    try {
      const response = await axiosInstance.get("/user-sub-type/all");
      const data = response.data?.data || [];
      const mappedUserTypes = data.map((item) => ({
        id: item.sub_category_id,
        sub_category_id: item.sub_category_id,
        sub_category_name_view: item.sub_category_name_view
      }));
      setSubTypes(mappedUserTypes);
    } catch (error) {
      console.error("Error fetching User Types:", error);
      swal("Error", "Failed to fetch user types.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUserType) {
      swal("Error", "Please select a user type.", "error");
      return;
    }

    if (selectedUserType === (userData.sub_category_id || userData?.sub_category?.sub_category_id)) {
      swal("Info", "No changes made to user type.", "info");
      onHide();
      return;
    }

    try {
      setLoading(true);
      
      const response = await axiosInstance.put(
        `/user/registrationform/${userData.registration_data_id}`,
        {
          sub_category_type: selectedUserType
        }
      );

      if (response.data.success) {
        swal("Success", "User type updated successfully!", "success");
        onUserUpdated(); // Refresh the user list
        onHide();
      } else {
        swal("Error", response.data.message || "Failed to update user type.", "error");
      }
    } catch (error) {
      console.error("Error updating user type:", error);
      const message = error.response?.data?.message || "Failed to update user type. Please try again.";
      swal("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUserType("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="mb-2">
              <strong>
                Select User Type <span className="text-danger">*</span>
              </strong>
            </label>
            <select
              className="form-control"
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              required
            >
              <option value="">Select User Type</option>
              {subtypes.map((type) => (
                <option key={type.sub_category_id} value={type.sub_category_id}>
                  {type.sub_category_name_view}
                </option>
              ))}
            </select>
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update User Type"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserTypeModal;
