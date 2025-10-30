import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { viewEventCalendarDetails } from "../../../services/adminApiService/eventCalendarApis/eventCalendarApis";

function PreviewEventCalendarModal({
  PreviewModalClose,
  PreviewEventModal,
  eventDocPreviewID,
}) {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    (async () => {
      try {
        let res = await viewEventCalendarDetails(eventDocPreviewID);
        setData(res?.data?.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [eventDocPreviewID]);

  return (
    <Modal show={PreviewEventModal} onHide={PreviewModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Event Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="add-contact-box">
          <div className="add-contact-content">
            {/* 1st Row */}
            <div className="row">
              <div className="form-group mb-3 col-md-12">
                <label className="text-black font-w500">Title</label>
                <div className="contact-name">
                  <Form.Control
                    readOnly
                    value={data.title || ""}
                    placeholder="Title"
                  />
                </div>
              </div>
            </div>
            {/* 2nd Row */}
            <div className="row">
              <div className="form-group mb-3 col-md-12">
                <label className="text-black font-w500">Description</label>
                <div className="contact-name">
                  <Form.Control
                    as="textarea"
                    readOnly
                    value={data.description || ""}
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>
            {/* 3rd Row */}
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="text-black font-w500">Type</label>
                <Form.Control
                  readOnly
                  value={data.type || ""}
                  placeholder="Type"
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label className="text-black font-w500">Organized By</label>
                <Form.Control
                  readOnly
                  value={data.organized_by || ""}
                  placeholder="Organized By"
                />
              </div>
            </div>
            {/* 4th Row */}
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="text-black font-w500">Start Date</label>
                <Form.Control
                  readOnly
                  value={data.start_date_time || ""}
                  placeholder="Start Date"
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label className="text-black font-w500">End Date</label>
                <Form.Control
                  readOnly
                  value={data.end_date_time || ""}
                  placeholder="End Date"
                />
              </div>
            </div>
            {/* 5th Row */}
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="text-black font-w500">Location</label>
                <Form.Control
                  readOnly
                  value={data.location || ""}
                  placeholder="Location"
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label className="text-black font-w500">Remarks</label>
                <Form.Control
                  readOnly
                  value={data.remarks || ""}
                  placeholder="Remarks"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={PreviewModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PreviewEventCalendarModal;
