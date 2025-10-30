import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axiosInstance from "../../../../services/AxiosInstance";
import { transportApiService } from "../../../../services/venueApi/venueApiService";
import AddTransportModal from "../../../../jsx/components/common/AddTransportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { ACCREDITATION_BASE_URL } from "../../../../config/adminUrlConfig";
import ImageModal from "../../../../components/ImageModal";

function Transport() {
  const { id } = useParams();
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [venueName, setVenueName] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShowTransportModal(false);
    setEditData(null);
  };

  const handleShow = () => setShowTransportModal(true);

  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (transportId) => {
    try {
      const result = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this transport!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (result) {
        await handleDeleteTransport(transportId);
      }
    } catch (error) {
      console.error("Error in delete confirmation:", error);
    }
  };

  const fetchTransportData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`${ACCREDITATION_BASE_URL}/venue/${id}/travel`, {
        params: {
          page: activePage,
          limit: itemsPerPage,
        }
      });
      
      if (response.data && response.data.success) {
        setItems(response.data.data.transport || []);
        setTotalPages(response.data.totalPages || 1);
        
        // Extract venue name from the response if available
        if (response.data.data.name) {
          setVenueName(response.data.data.name);
        }
      } else {
        throw new Error(response.data?.message || "Failed to fetch transport data");
      }
    } catch (error) {
      console.error("Error fetching transport data:", error);
      let errorMessage = "Failed to fetch transport data.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      swal("Error!", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportData();
  }, [activePage, id]);

  const editTransport = (transport) => {
    setEditData(transport);
    handleShow();
  };

  const handleDeleteTransport = async (transportId) => {
    try {
      const response = await transportApiService.deleteTransport(transportId);
      if (response.data && response.data.success) {
        swal("Success!", response.data.message || "Transport deleted successfully.", "success");
      } else {
        throw new Error(response.data?.message || "Failed to delete transport");
      }
      
      fetchTransportData();
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting transport:", error);
      let errorMessage = "Failed to delete the transport.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      swal("Error!", errorMessage, "error");
    }
  };

  const handleSave = async (data) => {
    try {
      console.log("Saving transport data:", data);
      console.log("Edit data:", editData);
      
      if (editData) {
        // Update existing transport
        console.log("Updating transport with ID:", editData.id);
        const response = await transportApiService.updateTransport(editData.id, data);
        console.log("Update response:", response);
        if (response.data && response.data.success) {
          swal("Success!", response.data.message || "Transport updated successfully.", "success");
        } else {
          throw new Error(response.data?.message || "Failed to update transport");
        }
      } else {
        // Create new transport
        console.log("Creating new transport");
        const response = await transportApiService.createTransport(data);
        console.log("Create response:", response);
        if (response.data && response.data.success) {
          swal("Success!", response.data.message || "Transport added successfully.", "success");
        } else {
          throw new Error(response.data?.message || "Failed to create transport");
        }
      }
      
      setShowTransportModal(false);
      setEditData(null);
      fetchTransportData();
    } catch (error) {
      console.error("Error saving transport:", error);
      
      // Handle different types of errors
      let errorMessage = "Failed to save transport. Please try again.";
      
      if (error.response) {
        // Backend returned an error response
        const backendError = error.response.data;
        console.log("Backend error:", backendError);
        if (backendError.message) {
          errorMessage = backendError.message;
        } else if (backendError.error && typeof backendError.error === 'object') {
          // Handle validation errors
          const validationErrors = Object.values(backendError.error).flat();
          if (validationErrors.length > 0) {
            errorMessage = `Validation errors: ${validationErrors.join(', ')}`;
          }
        }
      } else if (error.message) {
        // Custom error message
        errorMessage = error.message;
      }
      
      swal("Error!", errorMessage, "error");
    }
  };

  const handlePreviousPage = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  return (
    <>
      <div className="col-12">
        <div>
          <div className="card-body">
            {/* Header Section with Venue Name, Back Button, and Add Transport Button */}
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
              <h4 className="mb-0" style={{ fontSize: "16px", fontWeight: 600 }}>
                <span style={{ fontWeight: 700 }}>Venue:</span> {venueName}
              </h4>
              <div>
                <Button
                  variant="light"
                  onClick={() => navigate(-1)}
                  className="me-2 border"
                >
                  Back
                </Button>
                <Button
                  onClick={handleShow}
                >
                  Add Transport
                </Button>
              </div>
            </div>

            {/* Transport Table */}
            <div className="w-100">
              <div
                className="table-responsive rounded border"
                style={{ background: "#fff" }}
              >
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <table className="display w-100 dataTable mb-0">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Transport Category</th>
                        <th>Transport Name</th>
                        <th>Vehicle Type</th>
                        <th>Capacity</th>
                        <th>Image</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length ? (
                        items.map((item, index) => {
                          const idx = (activePage - 1) * itemsPerPage + index;
                          return (
                            <tr key={item.id || idx}>
                              <td>{idx + 1}</td>
                              <td>{item.transport_category || "-"}</td>
                              <td>{item.transport_name || "-"}</td>
                              <td>{item.vehicle_type || "-"}</td>
                              <td>{item.capacity || "-"}</td>
                              <td>
                                {item.imageURL ? (
                                  <img
                                    src={item.imageURL}
                                    alt="Transport"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setSelectedImage(item.imageURL);
                                      setShowImageModal(true);
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.outerHTML = "NA";
                                    }}
                                  />
                                ) : (
                                  "NA"
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => editTransport(item)}
                                >
                                  <HugeiconsIcon icon={PencilEdit02Icon} />
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteConfirm(item.id)}
                                >
                                  <HugeiconsIcon icon={Delete02Icon} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center">
                            No Transport Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-controls d-flex align-items-center justify-content-end gap-2 mt-3">
                  <Button
                    variant="primary"
                    disabled={activePage === 1}
                    onClick={handlePreviousPage}
                    className="px-3"
                  >
                    Previous
                  </Button>
                  <span className="mx-2">
                    Page {activePage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    disabled={activePage === totalPages}
                    onClick={handleNextPage}
                    className="px-3"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Transport Modal */}
      <AddTransportModal
        open={showTransportModal}
        onClose={handleClose}
        onSave={handleSave}
        editData={editData}
        venueId={id}
      />

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this transport? This action cannot
            be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteModalClose}>
              No
            </Button>
            <Button variant="danger" onClick={() => handleDeleteTransport(deleteId)}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt="Transport Image"
      />
    </>
  );
}

export default Transport;
