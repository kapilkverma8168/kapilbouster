import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../../services/AxiosInstance";
import VenueModal from "./venueModal";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ZoneModal from "../zone/zonesModal";
import Select from "react-select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import ImageModal from "../../../../components/ImageModal";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const VenueList = ({
  fetchData,
  currPage,
  totalPage,
  setCurrPage,
  data = [],
  setData,
  setSearchQuery,
  searchQuery,
  cityList,
  onEditVenue, // Add this prop for edit functionality
}) => {
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [venueOptions, setVenueOptions] = useState([]);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // Debounce search input with 500ms delay
  const debouncedSearchQuery = useDebounce(searchInput, 500);

  // Dummy data for visual preview only (used when API returns nothing)
  const dummyData = [
    {
      id: "dummy-1",
      venue_code: "V001",
      name: "Maharana paratap complex",
      capacity: 2323,
      venue_owner_name: "John Carter",
      imageURL:
        "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=100&h=100&fit=crop",
    },
    {
      id: "dummy-2",
      venue_code: "V002",
      name: "Maharana paratap complex",
      capacity: 3215,
      venue_owner_name: "John Carter",
      imageURL:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop",
    },
    {
      id: "dummy-3",
      venue_code: "V003",
      name: "Maharana paratap complex",
      capacity: 2500,
      venue_owner_name: "John Carter",
      imageURL:
        "https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=100&h=100&fit=crop",
    },
    {
      id: "dummy-4",
      venue_code: "V004",
      name: "Maharana paratap complex",
      capacity: 1200,
      venue_owner_name: "John Carter",
      imageURL:
        "https://images.unsplash.com/photo-1508606572321-901ea443707f?w=100&h=100&fit=crop",
    },
    {
      id: "dummy-5",
      venue_code: "V005",
      name: "Maharana paratap complex",
      capacity: 1450,
      venue_owner_name: "John Carter",
      imageURL:
        "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=100&h=100&fit=crop",
    },
    {
      id: "dummy-6",
      venue_code: "V006",
      name: "Maharana paratap complex",
      capacity: 1150,
      venue_owner_name: "John Carter",
      imageURL:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&h=100&fit=crop",
    },
  ];


  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await axiosInstance.get("/venue");
        const options = response.data.map((venue) => ({
          value: venue.id,
          label: venue.name,
        }));
        setVenueOptions(options);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    }
    fetchVenues();
  }, []);

  // Effect to handle debounced search
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setSearchQuery(debouncedSearchQuery.toLowerCase());
      if (fetchData) {
        fetchData(debouncedSearchQuery.toLowerCase());
      }
    }
  }, [debouncedSearchQuery, searchQuery, fetchData]);

  // Sync searchInput with searchQuery prop when it changes externally
  useEffect(() => {
    if (searchQuery !== searchInput) {
      setSearchInput(searchQuery);
    }
  }, [searchQuery]);

  //Dummy data
  // useEffect(() => {
  //   async function fetchVenues() {
  //     try {
  //       const response = await axiosInstance.get("/venue/list");
  //       const options = response.data.data.map((venue) => ({
  //         value: venue.id,
  //         label: venue.name,
  //       }));
  //       setVenueOptions(options);
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching venues:", error);
  //     }
  //   }
  //   fetchVenues();
  // }, []);

  const handleVenueChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "ALL")) {
      setSelectedVenues(venueOptions);
    } else {
      setSelectedVenues(selectedOptions);
    }
  };

  const handleDeleteConfirm = async (venueId) => {
    try {
      const result = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this venue!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (result) {
        try {
          await axiosInstance.delete(`/venue/${venueId}`);
          setData((prevData) => prevData.filter((venue) => venue.id !== venueId));
          swal("Venue Deleted!", "", "success");
          // Refresh the data after deletion
          if (fetchData) {
            fetchData();
          }
        } catch (error) {
          console.error("Error deleting venue:", error);
          swal("Error!", "Failed to delete venue. Please try again.", "error");
        }
      }
    } catch (error) {
      console.error("Error in delete confirmation:", error);
    }
  };

  const editVenue = (item) => {
    if (onEditVenue) {
      onEditVenue(item);
    }
  };

  const handleViewZones = (venueId) => {
    navigate(`/venue/${venueId}/zones`);
  };

  const handlePreviousPage = () => {
    if (currPage > 1) setCurrPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currPage < totalPage) setCurrPage((prev) => prev + 1);
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  // Handle immediate search (when search button is clicked)
  const handleImmediateSearch = () => {
    setSearchQuery(searchInput.toLowerCase());
    if (fetchData) {
      fetchData(searchInput.toLowerCase());
    }
  };

  return (
    <div className="col-12">
      <div>
        <div className="card-body">
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex" style={{ maxWidth: "300px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Venue Name"
                  onChange={handleSearchInputChange}
                  value={searchInput}
                />
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={handleImmediateSearch}
                >
                  Search
                </Button>
              </div>
              {/* <Button onClick={() => setShowZoneModal(true)}>
                Add Common Zones
              </Button> */}
            </div>

            {showZoneModal && (
              <ZoneModal
                show={showZoneModal}
                handleClose={() => setShowZoneModal(false)}
                venueList={venueOptions}
                selectedVenues={selectedVenues} 
                setSelectedVenues={setSelectedVenues} 
                isCommonZone={true}
                additionalField={
                  <div className="mb-3">
                    <label>Select Venues</label>
                    <Select
                      isMulti
                      options={[
                        { label: "Select All", value: "ALL" },
                        ...venueOptions,
                      ]}
                      value={selectedVenues} 
                      onChange={(options) => {
                        if (options.some((option) => option.value === "ALL")) {
                          setSelectedVenues(venueOptions);
                        } else {
                          setSelectedVenues(options);
                        }
                      }}
                    />
                  </div>
                }
              />
            )}

            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table
                id="example"
                className="display w-100 dataTable table align-middle"
                style={{ minWidth: "1300px" }}
              >
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Venue Code</th>
                  <th>Venue Name</th>
                  <th>Capacity</th>
                  <th>Venue Manager Name</th>
                  <th>Image</th>
                  <th>Edit</th>
                  <th>Zones</th>
                  <th>Transport</th>
                  <th>Dining</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{(currPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.venue_code}</td>
                      <td>{item.name}</td>
                      <td>{item.capacity}</td>
                      <td>{item.venue_owner_name}</td>
                      <td>
                        {item.imageURL ? (
                          <img
                            src={item.imageURL}
                            alt="Venue"
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
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded"
                          onClick={() => editVenue(item)}
                        >
                          <HugeiconsIcon icon={PencilEdit02Icon} />
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          className="p-0"
                          style={{ textDecoration: "underline" }}
                          onClick={() => navigate(`/venue/${item.id}/zones`)}
                        >
                          View Zones
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          className="p-0"
                          style={{ textDecoration: "underline" }}
                          onClick={() => navigate(`/venue/${item.id}/transport`)}
                        >
                          View Transport
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          className="p-0"
                          style={{ textDecoration: "underline" }}
                          onClick={() => navigate(`/venue/${item.id}/dining`)}
                        >
                          View Dining
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded"
                          onClick={() => handleDeleteConfirm(item.id)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No venues found. Please add a venue or check your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
            <div className="pagination-controls d-flex align-items-center justify-content-end gap-2 mt-3">
              <Button
                variant="primary"
                disabled={currPage === 1}
                onClick={handlePreviousPage}
                className="px-3"
              >
                Previous
              </Button>
              {Array.from({ length: totalPage }, (_, i) => i + 1)
                .slice(
                  Math.max(currPage - 3, 0),
                  Math.min(currPage + 2, totalPage)
                )
                .map((page) => (
                  <Button
                    key={page}
                    variant={page === currPage ? "primary" : "light"}
                    className="px-3"
                    onClick={() => setCurrPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              <Button
                variant="primary"
                disabled={currPage === totalPage}
                onClick={handleNextPage}
                className="px-3"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt="Venue Image"
      />
    </div>
  );
};

export default VenueList;
