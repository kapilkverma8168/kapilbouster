import React from "react";
import CommunicationModal from "./CommunicationModal";
import { Button } from "react-bootstrap";

function Communication({ fetchData }) {
  const [showCommunicationModal, setShowCommunicationModal] =
    React.useState(false);

  const handleClose = () => setShowCommunicationModal(false);
  const handleShow = () => setShowCommunicationModal(true);

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button variant="primary" onClick={handleShow}>
          Add Notification
        </Button>
        <CommunicationModal
          show={showCommunicationModal}
          handleClose={handleClose}
          fetchData={fetchData}
        />
      </div>
    </>
  );
}

export default Communication;
