import React from "react";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {
  getNotificationDetailsById,
  getWebsiteNotificationDetailsById,
} from "../../../services/adminApiService/communicateApi/communicateApi";

function PreviewEventModal({
  showPreviewCommunicationModal,
  PreviewModalClose,
  id,
  notificationFor,
}) {
  const [data, setData] = React.useState({});

  // fetch the data initially
  React.useEffect(() => {
    (async () => {
      try {
        let res = null;
        if (
          id &&
          notificationFor !== "Website" &&
          notificationFor !== undefined
        ) {
          res = await getNotificationDetailsById(id);
        } else {
          res = id && (await getWebsiteNotificationDetailsById(id));
        }

        setData(res?.data?.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);

  return (
    <Modal show={showPreviewCommunicationModal} onHide={PreviewModalClose}>
      <div className="modal-header">
        <h4 className="modal-title fs-20">Notification Preview</h4>
        <button type="button" className="btn-close" onClick={PreviewModalClose}>
          <span></span>
        </button>
      </div>
      <div className="modal-body">
        <div className="add-contact-box">
          <div className="add-contact-content">
            {/* 1st Row */}
            <div className="row">
              <div
                className={
                  notificationFor === "Website" ? "col-md-12" : "col-md-6"
                }
              >
                <label className="text-black font-w500">
                  Notification For <span className="text-danger">*</span>
                </label>
                <div className="contact-name">
                  <Form.Control
                    readOnly
                    defaultValue={notificationFor}
                    name="notification_for"
                    className="form-control"
                  />
                </div>
              </div>

              {notificationFor !== "Website" && (
                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">
                    Main Category <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    <Form.Control
                      readOnly
                      defaultValue={data?.main_category_name}
                      name="main_category"
                      className="form-control"
                    />
                  </div>
                </div>
              )}
            </div>
            {/* 2nd Row */}
            {notificationFor !== "Website" && (
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">
                    Category Type <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    <Form.Control
                      readOnly
                      defaultValue={data?.category_name}
                      name="category_type"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group mb-3 col-md-6">
                  <label className="text-black font-w500">
                    Sub Category <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    <Form.Control
                      readOnly
                      defaultValue={data?.sub_category_name}
                      name="sub_category_name"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* 3rd Row */}
            <div className="row">
              <div className="form-group mb-3 col-md-12">
                <label className="text-black font-w500">
                  Title <span className="text-danger">*</span>
                </label>
                <div className="contact-name">
                  <Form.Control
                    readOnly
                    required
                    defaultValue={data?.title}
                    name="title"
                    placeholder="Enter Title"
                  />
                </div>
                <span className="validation-text text-danger"></span>
              </div>
            </div>
            {/* 4th row */}
            <div className="row">
              <div className="form-group mb-3 col-md-12">
                <label className="text-black font-w500">
                  Message <span className="text-danger">*</span>
                </label>
                <div className="contact-name">
                  <Form.Control
                    readOnly
                    defaultValue={data?.message}
                    name="message"
                    as="textarea"
                    placeholder="Message"
                  />
                </div>
              </div>
            </div>
            {/* 5th Row */}
            <div className="row">
              <div className="form-group mb-3 col-md-12">
                <label className="text-black font-w500">URL</label>
                <div className="contact-name">
                  <Form.Control
                    readOnly
                    defaultValue={data?.url}
                    name="url"
                    type="url"
                    placeholder="Enter URL"
                  />
                </div>
              </div>
            </div>
            {/* 6th Row */}
            {/* <div className="row">
              <div className="form-group mb-3 col-md-12">
                <Form.Group controlId="formFile">
                  <Form.Label className="text-black font-w500">
                    Upload Document
                  </Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="file"
                      accept="image/*,application/pdf"
                    />
                  </div>
                </Form.Group>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="modal-footer d-flex justify-content-between">
        <div className="d-flex justify-content-end w-100">
          <button
            type="button"
            className="btn btn-secondary mx-2"
            onClick={PreviewModalClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(PreviewEventModal);
