import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import swal from "sweetalert";
import PageTitle from "../../../jsx/layouts/PageTitle";
import { Link } from "react-router-dom";

function Ticket() {
  const [showTicketModal, setshowTicketModal] = React.useState(false);
  const handleCloseTicketModal = () => setshowTicketModal(false);
  const handleShowTicketModal = () => setshowTicketModal(true);
  const [viewTicketData, setviewTicketData] = React.useState({});
  const [data, setData] = React.useState(
    new Array(10).fill(null).map((e) => ({
      _id: +(Date.now() + Math.random().toFixed(2)),
      title: "Registraticon Issue",
      description: "Registration Issue",
      status: "Pending",
      document: "#",
    }))
  );

  //   handle View Ticket
  const handleViewTicket = (index, item) => {
    console.log(index, item);
  };
  return (
    <>
      <PageTitle
        activeMenu="Table"
        motherMenu="Grievance-Management"
        Button={() => (
          <Button onClick={handleShowTicketModal}>Raise Ticket</Button>
        )}
      />

      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="w-100 table-responsive">
              <div id="example_wrapper" className="dataTables_wrapper">
                <table id="example" className="display w-100 dataTable">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Document URL</th>
                      <th>View Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {true ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.title}</td>
                          <td>{item.description}</td>
                          <td>{index % 2 === 0 ? "Resolved" : "Pending"}</td>
                          <td>
                            <Link to={`${(item, document)}`}>URL</Link>
                          </td>
                          <td>
                            <i
                              onClick={() => handleViewTicket(item._id, item)}
                              class="bi bi-eye-fill text-primary"
                            ></i>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Data is not available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-body"></div>
        </div>
      </div>
      <TicketModal
        showTicketModal={showTicketModal}
        handleCloseTicketModal={handleCloseTicketModal}
      />
    </>
  );
}

export default Ticket;

// ticket form
const intialFormData = {
  title: "",
  description: "",
  status: "Pending",
};
function TicketModal({ showTicketModal, handleCloseTicketModal }) {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [fileUrl, setFileUrl] = React.useState(null);
  const [formData, setformData] = React.useState(intialFormData);

  const handleSubmit = (e) => {
    e.preventDefault();
    setformData(intialFormData);
    swal("Ticket Created", "", "success");
    handleCloseTicketModal();
  };
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setSelectedFile(null);
      setFileUrl(null);
    }
  };

  const handleFilePreview = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const handleChangeInputValue = (e) => {
    let { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  return (
    <>
      <Modal show={showTicketModal} onHide={handleCloseTicketModal}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h4 className="modal-title fs-20">Grievance Management</h4>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseTicketModal}
            >
              <span></span>
            </button>
          </div>
          <div className="modal-body">
            <div className="add-contact-box">
              <div className="add-contact-content">
                {/* 1st Row */}
                <div className="row">
                  <div className="form-group mb-3 col-md-12">
                    <label className="text-black font-w500">
                      Title <span className="text-danger">*</span>
                    </label>
                    <div className="contact-name">
                      {" "}
                      <Form.Control
                        required
                        name="title"
                        value={formData.title}
                        placeholder="Enter Title"
                        onChange={handleChangeInputValue}
                      />
                    </div>
                    <span className="validation-text text-danger">
                      {Error.titleError && Error.titleError}
                    </span>
                  </div>
                </div>
                {/* 2nd Row */}
                <div className="row">
                  <div className="form-group mb-3 col-md-12">
                    <label className="text-black font-w500">
                      Description <span className="text-danger">*</span>
                    </label>
                    <div className="contact-name">
                      {" "}
                      <Form.Control
                        required
                        name="description"
                        as="textarea"
                        placeholder="Description"
                        onChange={handleChangeInputValue}
                        value={formData.description}
                      />
                    </div>
                  </div>
                </div>
                {/* 3rd row */}
                <div className="row">
                  <div className="form-group mb-3 col-md-12">
                    <Form.Group controlId="formFile">
                      <Form.Label className="text-black font-w500">
                        Upload Document
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                        />

                        <Button
                          variant="primary"
                          className="ms-2"
                          disabled={!selectedFile}
                          onClick={handleFilePreview}
                        >
                          Preview
                        </Button>
                      </div>
                    </Form.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <div className="d-flex justify-content-end w-100">
              <button
                type="button"
                className="btn btn-secondary mx-2"
                onClick={handleCloseTicketModal}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary mx-2">
                Raise
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

// Ticket Listing
