import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import axiosInstance from "../../../../services/AxiosInstance";
import AddDiningModal from "../../../../jsx/components/common/AddDiningModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { ACCREDITATION_BASE_URL } from "../../../../config/adminUrlConfig";
import ImageModal from "../../../../components/ImageModal";

function Dining() {
  const { id } = useParams();
  const [showDiningModal, setShowDiningModal] = useState(false);
  const [editData, setEditData] = useState(null);
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
    setShowDiningModal(false);
    setEditData(null);
  };

  const handleShow = () => setShowDiningModal(true);

  const handleDeleteConfirm = async (diningId) => {
    try {
      const result = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this dining!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (result) {
        await handleDeleteDining(diningId);
      }
    } catch (error) {
      console.error("Error in delete confirmation:", error);
    }
  };


  const fetchDiningData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`${ACCREDITATION_BASE_URL}/venue/${id}/dining`, {
        params: {
          page: activePage,
          limit: itemsPerPage,
        }
      });
      
      if (response.data && response.data.success) {
        setItems(response.data.data.dining || []);
        setTotalPages(response.data.totalPages || 1);
        
        // Extract venue name from the response if available
        if (response.data.data.name) {
          setVenueName(response.data.data.name);
        }
      } else {
        throw new Error(response.data?.message || "Failed to fetch dining data");
      }
    } catch (error) {
      console.error("Error fetching dining data:", error);
      let errorMessage = "Failed to fetch dining data.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      swal("Error!", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [id, activePage, itemsPerPage]);

  useEffect(() => {
    fetchDiningData();
  }, [activePage, id, fetchDiningData]);

  const editDining = (dining) => {
    setEditData(dining);
    handleShow();
  };

  const handleDeleteDining = async (diningId) => {
    try {
      const response = await axiosInstance.delete(`${ACCREDITATION_BASE_URL}/dining/${diningId}`);
      if (response.data && response.data.success) {
        swal("Success!", response.data.message || "Dining deleted successfully.", "success");
      } else {
        throw new Error(response.data?.message || "Failed to delete dining");
      }
      
      fetchDiningData();
    } catch (error) {
      console.error("Error deleting dining:", error);
      let errorMessage = "Failed to delete the dining.";
      
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
      console.log("Saving dining data:", data);
      console.log("Edit data:", editData);

      // Prepare FormData for sending payload and image
      const formData = new FormData();

      // Append all fields from data except image
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "image") {
          // If value is null or undefined, skip
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
      });

      // Append image if present
      if (data.image) {
        formData.append("image", data.image);
      }

      let response;
      if (editData) {
        // Update existing dining
        console.log("Updating dining with ID:", editData.id);
        response = await axiosInstance.put(
          `${ACCREDITATION_BASE_URL}/dining/${editData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Update response:", response);
        if (response.data && response.data.success) {
          swal("Success!", response.data.message || "Dining updated successfully.", "success");
        } else {
          throw new Error(response.data?.message || "Failed to update dining");
        }
      } else {
        // Create new dining
        console.log("Creating new dining");
        response = await axiosInstance.post(
          `${ACCREDITATION_BASE_URL}/dining`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Create response:", response);
        if (response.data && response.data.success) {
          swal("Success!", response.data.message || "Dining added successfully.", "success");
        } else {
          throw new Error(response.data?.message || "Failed to create dining");
        }
      }

      setShowDiningModal(false);
      setEditData(null);
      fetchDiningData();
    } catch (error) {
      console.error("Error saving dining:", error);

      // Handle different types of errors
      let errorMessage = "Failed to save dining. Please try again.";

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
            {/* Header Section with Venue Name, Back Button, and Add Dining Button */}
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
                  Add Dining
                </Button>
              </div>
            </div>

            {/* Dining Table */}
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
                        <th>Dining Category</th>
                        <th>Dining Name</th>
                        <th>Capacity</th>
                        <th>Range</th>
                        <th>Location</th>
                        <th>Description</th>
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
                              <td>{item.dining_category || "-"}</td>
                              <td>{item.dining_name || "-"}</td>
                              <td>{item.capacity || "-"}</td>
                              <td>{item.range ? `${item.range}m` : "-"}</td>
                              <td>
                                {item.latitude && item.longitude ? (
                                  `${item.latitude}, ${item.longitude}`
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>{item.description || "-"}</td>
                              <td>
                                {item.imageURL ? (
                                  <img
                                    src={item.imageURL}
                                    alt="Dining"
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
                                  onClick={() => editDining(item)}
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
                          <td colSpan={10} className="text-center">
                            No Dining Available
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

      {/* Add/Edit Dining Modal */}
      <AddDiningModal
        open={showDiningModal}
        onClose={handleClose}
        onSave={handleSave}
        editData={editData}
        venueId={id}
      />


      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt="Dining Image"
      />
    </>
  );
}

export default Dining;
