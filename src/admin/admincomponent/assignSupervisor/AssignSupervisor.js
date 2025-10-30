import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageTitle from "../../../jsx/layouts/PageTitle";
import { Modal, Button } from "react-bootstrap";
import Listingofsupervisors from "./Listingofsupervisors";

function AssignSupervisor() {
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  // Handle modal visibility
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    reset(); // Reset form when modal is closed
    setShowModal(false);
  };

  // Fetch the department and supervisor data from API
  useEffect(() => {
    const fetchDepartments = async () => {
      // Replace with actual API call
      const response = await fetch("/api/departments");
      const data = await response.json();
      setDepartments(data);
    };

    const fetchSupervisors = async () => {
      // Replace with actual API call
      const response = await fetch("/api/supervisors");
      const data = await response.json();
      setSupervisors(data);
    };

    fetchDepartments();
    fetchSupervisors();
  }, []);

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form Data Submitted: ", data);
    alert("Supervisor Assigned!");
    handleCloseModal();
  };

  return (
    <>
      <PageTitle
        motherMenu={"Supervisor"}
        activeMenu={"Supervisor"}
        Button={() => (
          <Button variant="primary" onClick={handleOpenModal}>
            Assign Supervisor
          </Button>
        )}
      />

      {/* Modal Component */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Supervisor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group pb-2">
              <label htmlFor="department">Department</label>
              <select
                className="form-control"
                id="department"
                {...register("department", {
                  required: "Department is required",
                })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group pb-2">
              <label htmlFor="supervisor">Supervisor</label>
              <select
                className="form-control"
                id="supervisor"
                {...register("supervisor", {
                  required: "Supervisor is required",
                })}
              >
                <option value="">Select Supervisor</option>
                {supervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
      <Listingofsupervisors />
    </>
  );
}

export default AssignSupervisor;
