import React, { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../../../services/AxiosInstance";
import Pagination from "../permitUsers/Pagination";
import swal from "sweetalert";
import { tokenExtractor } from "../../../utils/helper/tokenExtractor";
import { Modal, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ImageModal from "../../../components/ImageModal";
import EditUserTypeModal from "./EditUserTypeModal";

const PermitUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("access_token");
  const [searchParams, setSearchParams] = useSearchParams();

  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedOption, setSelectedOption] = useState({
    value: 3,
    label: "All",
  });
  const [disapproveModalOpen, setDisapproveModalOpen] = useState(false);
  const [disapproveComment, setDisapproveComment] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedUserType, setEditedUserType] = useState({
    value: "",
    registration_data_id: "",
  });
  const [userTypeModalOpen, setUserTypeModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState(
    searchParams.get("selectedUserType") || ""
  );
  const [userData, setUserData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");
  const [showEditUserTypeModal, setShowEditUserTypeModal] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [currentPage, setCurrentPage] = React.useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  const isInitialLoad = useRef(true);

  const handleEditUser = (user) => {
    setSelectedUserForEdit(user);
    setShowEditUserTypeModal(true);
  };

  const handleUserUpdated = () => {
    fetchUsers(currentPage, searchTerm); // Refresh the user list after update
  };

  const handlePageChange = (page) => {
    console.log("Page change requested to:", page);
    if (page !== currentPage) {
      setCurrentPage(page);
      // The useEffect will handle the API call when currentPage changes
    }
  };

  const handleCloseEditModal = () => {
    setShowEditUserTypeModal(false);
    setSelectedUserForEdit(null);
  };

  const fetchUsers = useCallback(
    async (page = 1, query = null) => {
      try {
        setLoading(true);

        const params = {
          page: page,
          reg_status: selectedOption?.value,
          limit: limit,
        };

        if (query && query.trim() !== "") {
          params.search = query.trim();
        }

        if (selectedUserType && selectedUserType !== "all") {
          params.sub_category = selectedUserType;
        }

        console.log("Fetching users with params:", params);

        // Use the correct search endpoint when there's a search query
        const endpoint = query && query.trim() !== "" 
          ? "/user/registrationform/search" 
          : "/user/registrationform";

        console.log("Using endpoint:", endpoint, "for query:", query);

        const response = await axiosInstance.get(endpoint, {
          params,
          timeout: 10000,
        });

        const responseData = response?.data;
        console.log("Full API response:", responseData);
        
        if (responseData && !responseData.error) {
          // Handle API response structure based on your provided format
          let dataArray = [];
          let pagination = {};
          
          // Check if data exists and is an array (your API format)
          if (responseData.data && Array.isArray(responseData.data)) {
            dataArray = responseData.data || [];
            // Pagination info is at root level in your API response
            pagination = {
              totalPages: responseData.totalPages || 0,
              totalItems: responseData.totalItems || 0,
              currentPage: responseData.currentPage || page,
              itemsPerPage: responseData.itemsPerPage || limit,
              hasNextPage: responseData.hasNextPage || false,
              hasPrevPage: responseData.hasPrevPage || false
            };
          } else if (responseData.data && responseData.data.data) {
            // Search API response structure: { data: { data: [...], pagination: {...} } }
            dataArray = responseData.data.data || [];
            pagination = responseData.data.pagination || {};
          } else {
            // Fallback for other structures
            dataArray = responseData.data || [];
            pagination = responseData.pagination || {};
          }

          console.log("Extracted data array:", dataArray);
          console.log("Extracted pagination:", pagination);
          console.log("Setting totalPages:", pagination?.totalPages);
          console.log("Setting totalItems:", pagination?.totalItems);

          setUsers(dataArray);
          setFilteredUsers(dataArray);
          setTotalPages(pagination?.totalPages || 0);
          setTotalItems(pagination?.totalItems || 0);

          // Only update currentPage if it's different from the requested page
          if (page !== currentPage) {
            setCurrentPage(page);
          }
        } else {
          // Handle empty results
          setUsers([]);
          setFilteredUsers([]);
          setTotalPages(0);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          endpoint: query && query.trim() !== "" ? "/user/registrationform/search" : "/user/registrationform"
        });

        let message = "An error occurred while fetching users.";
        if (error.code === "ECONNABORTED") {
          message = "Request timed out. Please try again.";
        } else if (error.response?.status === 404) {
          message = "Search endpoint not found. Please check if the API is properly configured.";
        } else if (error.response?.status === 500) {
          message = "Server error occurred. Please try again later.";
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error.message) {
          message = error.message;
        }

        swal("Error", message, "error");
        setUsers([]);
        setFilteredUsers([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [selectedOption?.value, limit, selectedUserType, currentPage]
  );

  const handleSearch = useCallback(
    (event) => {
      const query = event.target.value;
      console.log("Search input changed:", query);
      setSearchTerm(query);
    },
    []
  );

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Handle page changes and filter changes
  useEffect(() => {
    console.log('Data fetch useEffect triggered:', {
      currentPage,
      searchTerm,
      selectedOption: selectedOption?.value,
      limit,
      selectedUserType,
      isInitialLoad: isInitialLoad.current
    });
    
    if (isInitialLoad.current) {
      fetchUsers(currentPage, searchTerm);
      isInitialLoad.current = false;
    } else {
      // Only fetch when page, selectedOption, limit, or selectedUserType changes
      // NOT when searchTerm changes - that should only happen on search button click
      fetchUsers(currentPage, searchTerm);
    }
  }, [currentPage, selectedOption?.value, limit, selectedUserType, fetchUsers]);

  const handleSearchButton = useCallback(() => {
    console.log("Search button clicked with query:", searchTerm);
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchUsers(1, searchTerm);
    }
  }, [fetchUsers, searchTerm, currentPage]);

  // Add a clear search function:
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchUsers(1, "");
    }
  }, [fetchUsers, currentPage]);

  function windowReloader() {
    // window.location.reload();
  }

  const handleExport = async () => {
    try {
      const params = {
        download: true,
      };

      // Add user type parameter only if a user type is selected and it's not "all"
      if (selectedUserType && selectedUserType !== "all") {
        params.sub_category = selectedUserType;
      }

      // Add search parameter if there's a search term
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm.trim();
      }

      // Use the correct endpoint based on whether there's a search query
      const endpoint = searchTerm && searchTerm.trim() !== "" 
        ? "/user/registrationform/search" 
        : "/user/registrationform";

      const response = await axiosInstance.get(endpoint, {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      
      // Generate filename based on filters applied
      let filename = "users_list";
      if (selectedUserType && selectedUserType !== "all") {
        const userTypeName = userTypes.find(type => type.sub_category_id === selectedUserType)?.sub_category_name_view || "filtered";
        filename = `${userTypeName.toLowerCase().replace(/\s+/g, '_')}_users_list`;
      }
      if (searchTerm && searchTerm.trim() !== "") {
        filename += "_search_results";
      }
      filename += ".xlsx";
      
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // swal("Success", "File downloaded successfully!", "success");
    } catch (error) {
      const message =
        error.response?.data?.message || "An error occurred during export.";
      swal("Error", message, "error");
    }
  };

  // const fetchUserData = async (userType) => {
  //   try {
  //   console.log(137)

  //     setLoading(true);
  //     const url = `/user/registrationform?page=${currentPage}&limit=${limit}&`;
  //     if (selectedUserType) {
  //       url = +`sub_category=${selectedUserType}`;
  //     }
  //     if(searchTerm){
  //       url+=`name=${searchTerm}`
  //     }

  //     const response = await axiosInstance.get(url);

  //     const data = response.data.data || []; // Get user data
  //     const totalPages = response.data.totalPages || 0; // Get total pages
  //     const totalItems = response.data.totalItems || 0; // Get total items

  //     if (data.length === 0) {
  //       setUserData([]); // Clear user data if empty response
  //       setFilteredUsers([]); // Clear filtered users
  //     } else {
  //       setUserData(data); // Set fetched user data
  //       setFilteredUsers(data); // Set filtered users
  //     }

  //     setTotalPages(totalPages); // Update total pages for pagination
  //     setTotalItems(totalItems); // Update total items for pagination
  //   } catch (error) {
  //     // swal(
  //     //   "Error",
  //     //   "Failed to fetch user data for the selected type.",
  //     //   "error"
  //     // );
  //     setUserData([]); // Clear user data in case of error
  //     setFilteredUsers([]);
  //     setTotalPages(0); // Reset total pages
  //   } finally {
  //     setLoading(false); // Stop the loading indicator
  //   }
  // };

  // Check auth token on mount
  useEffect(() => {
    if (!authToken) {
      setLoading(false);
      return;
    }
  }, [authToken]);

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };

  // const fetchCitiesAndVenues = async () => {
  //   try {
  //     const response = await axiosInstance.get("/venue/cities");
  //     setAllCitiesAndVenues(response.data || []);
  //   } catch (error) {
  //     console.error("Error fetching cities and venues:", error);
  //   }
  // };

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axiosInstance.get(`/user-sub-type/all`);
        const data = response?.data?.data || [];
        // Map the API response format to the expected format
        const mappedUserTypes = data.map((item) => ({
          id: item.sub_category_id,
          sub_category_id: item.sub_category_id,
          sub_category_name_view: item.sub_category_name_view,
        }));
        setUserTypes(mappedUserTypes);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to fetch user types.";
        swal("Error", message, "error");
      }
    };

    fetchUserTypes();
  }, []);

  function isAdmin() {
    let decryptedToken = tokenExtractor().user_level === 3;
    return decryptedToken ? true : false;
  }

  // const options = [
  //   { value: 3, label: "All" },
  //   { value: 0, label: isAdmin() ? "Ready For Printing" : "Approve" },
  //   { value: 2, label: isAdmin() ? "Sent For Printing" : "Sent For Printing" },
  //   {
  //     value: 1,
  //     label: isAdmin() ? "" : "Sent for Accredation",
  //   },
  // ];

  const fetchFilteredUsers = async (categoryId) => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: limit,
        reg_status: selectedOption?.value,
        category_id: categoryId,
      };

      if (selectedUserType && selectedUserType !== "all") {
        params.sub_category = selectedUserType;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Use the correct search endpoint when there's a search query
      const endpoint = searchTerm && searchTerm.trim() !== "" 
        ? "/user/registrationform/search" 
        : "/user/registrationform";

      const response = await axiosInstance.get(endpoint, { params });

      const responseData = response?.data;
      console.log("Filtered users API response:", responseData);
      
      // Handle API response structure based on your provided format
      let data = [];
      let totalPages = 0;
      let totalItems = 0;
      
      // Check if data exists and is an array (your API format)
      if (responseData?.data && Array.isArray(responseData.data)) {
        data = responseData.data || [];
        // Pagination info is at root level in your API response
        totalPages = responseData.totalPages || 0;
        totalItems = responseData.totalItems || 0;
      } else if (responseData?.data && responseData.data.data) {
        // Search API response structure: { data: { data: [...], pagination: {...} } }
        data = responseData.data.data || [];
        totalPages = responseData.data.pagination?.totalPages || 0;
        totalItems = responseData.data.pagination?.totalItems || 0;
      } else {
        // Fallback for other structures
        data = responseData?.data || [];
        totalPages = responseData?.totalPages || 0;
        totalItems = responseData?.totalItems || 0;
      }

      if (data.length === 0) {
        setFilteredUsers([]);
      } else {
        setFilteredUsers(data);
      }

      setTotalPages(totalPages);
      setTotalItems(totalItems);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch filtered users.";
      swal("Error", message, "error");
      setFilteredUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDisapprove = async () => {
    if (!currentUser) {
      swal("Error", "No user selected for disapproval.", "error");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/user/disapprove/${currentUser.registration_data_id}`,
        { comment: disapproveComment }
      );

      if (response.status === 200) {
        const updatedUsers = users.map((user) => {
          if (user.registration_data_id === currentUser.registration_data_id) {
            return {
              ...user,
              reg_status: "Disapproved",
              disapprove_comment: disapproveComment,
              registration_status: 1,
            };
          }
          return user;
        });
        setUsers(updatedUsers);
        swal("Success", "User disapproved successfully!", "success");
        setDisapproveModalOpen(false); // Close the modal
        setDisapproveComment(""); // Reset the comment input
        // Refresh data from server
        fetchUsers(currentPage, searchTerm);
      } else {
        swal("Error", "Disapproval failed. Please try again.", "error");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while disapproving the user.";
      swal("Error", message, "error");
    } finally {
      windowReloader();
    }
  };

  const handleDisapproveClick = (item) => {
    setCurrentUser(item);
    setDisapproveModalOpen(true);
  };

  // const handleChange = (selected) => {
  //   setSelectedOption(selected);
  //   setCurrentPage(1);
  // };

  const captureUser = async (item) => {
    try {
      const response = await axiosInstance.post(
        `user/registrationform/approve/${item.registration_data_id}`
      );
      if (response.status === 200) {
        swal("Success", "User Approved successfully", "success");
        fetchUsers(currentPage, searchTerm);
      } else {
        swal("Error", "Failed to approve user.", "error");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while approving the user.";
      swal("Error", message, "error");
    }
  };

  const approveBySubAdmin = async (item) => {
    try {
      const response = await axiosInstance.put(
        `user/approved-by-subAdmin/${item.registration_data_id}`
      );
      if (response.status === 200) {
        swal("Success", "User Sent to Admin for Approval", "success");
        fetchUsers(currentPage, searchTerm);
      } else {
        swal("Error", "Failed to approve user.", "error");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while approving the user.";
      swal("Error", message, "error");
    } finally {
      windowReloader();
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedUser = {
        // ...selectedUser,
        organisation: editedUserType.value,
        category_name: editedUserType.value,
      };

      let res = await axiosInstance.put(
        `/user/registrationform/${editedUserType.registration_data_id}`,
        updatedUser
      );

      if (res.data.success) {
        swal("Success", res.data.message, "success");
        fetchUsers(currentPage, searchTerm);
      }
    } catch (error) {
      console.log(error.message);
      swal("Error", "Failed to update user details.", "error");
    } finally {
      setEditModalOpen(false);

      // windowReloader();
    }
  };

  useEffect(() => {
    let obj = { page: currentPage };
    if (selectedUserType) {
      obj["selectedUserType"] = selectedUserType;
    }
    if (searchTerm) {
      obj["search"] = searchTerm;
    }
    setSearchParams(obj);
  }, [currentPage, setSearchParams, selectedUserType, searchTerm]);

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axiosInstance.get("/user-sub-type/all");
        const data = response.data?.data || [];
        // Map the API response format to the expected format
        const mappedUserTypes = data.map((item) => ({
          id: item.sub_category_id,
          sub_category_id: item.sub_category_id,
          sub_category_name_view: item.sub_category_name_view,
        }));
        setUserTypes(mappedUserTypes);
      } catch (error) {
        console.error("Error fetching User Types:", error);
        if (error.response) {
          swal(
            "Error",
            `Failed to fetch user types: ${error.response.status} - ${
              error.response.data?.message || error.response.statusText
            }`,
            "error"
          );
        } else if (error.request) {
          swal(
            "Error",
            "No response received from the server. Please check your connection.",
            "error"
          );
        } else {
          swal("Error", `Unexpected error occurred: ${error.message}`, "error");
        }
      }
    };

    if (editModalOpen) {
      fetchUserTypes();
    }
  }, [editModalOpen]);

  // Removed unused userTypeOptions variable

  const handlEditUserType = async (e) => {
    setEditedUserType({ value: e.target.value });
  };

  // const getLabel = (item) => {
  //   let label = "";
  //   if (item.reg_status) {
  //     label = item?.reg_status?.toUpperCase();
  //   } else if (
  //     item.registration_status === "0" &&
  //     item.user_created_by &&
  //     isAdmin()
  //   ) {
  //     label = "CAPTURE";
  //   } else if (
  //     item.registration_status === "0" &&
  //     item.user_created_by &&
  //     !isAdmin()
  //   ) {
  //     label = "SEND TO ACCRED";
  //   }
  //   return label;
  // };
  // const disapproveUser = async (user) => {
  //   const { id } = user;
  //   return axiosInstance.post(`/user/disapprove/${id}`, { registration_status: 2 });
  // };
  useEffect(() => {
    setSelectedOption({ value: 3, label: "All" });
  }, []);

  //sub_category_id
  return (
    <div>
      <div>
        <div className="card-body">
          <div className="mb-3">
            {/* <h5 style={{borderBottom: "1px solid #D1D5DB", paddingBottom: "20px", marginBottom:"20px"}}>Users List</h5> */}
            <div className="d-flex align-items-center justify-content-between">
              {/* User Type Dropdown moved to the filter row below */}

              {/* Export Button */}
            </div>
          </div>

          <div className="pb-3">
            <div className="row g-3 align-items-end">
              <div className="col-md-2">
                <label className="form-label small text-muted mb-1">Items per page</label>
                <select
                  className="form-select form-select-sm"
                  value={limit}
                  onChange={handleLimitChange}
                  style={{ height: '38px' }}
                >
                  {[10, 20, 30, 40, 50].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small text-muted mb-1">User Type</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedUserType}
                  onChange={async (e) => {
                    const userType = e.target.value;
                    setSelectedUserType(userType);
                    setCurrentPage(1);

                    if (userType && userType !== "all") {
                      await fetchFilteredUsers(userType);
                    } else {
                      // Fetch all users when "All" is selected or no user type is selected
                      fetchUsers(1, searchTerm);
                    }
                  }}
                  style={{ height: '38px' }}
                >
                  <option value="all">All User Types</option>
                  {userTypes.map((userType) => (
                    <option key={userType.id} value={userType.sub_category_id}>
                      {userType?.sub_category_name_view}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label small text-muted mb-1">Search</label>
                <div className="input-group" style={{ height: '38px' }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search by Full Name, Email & Phone no."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ height: '38px' }}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      onClick={handleClearSearch}
                      title="Clear search"
                      style={{ height: '38px' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm flex-fill"
                  onClick={handleSearchButton}
                  disabled={loading}
                  style={{ height: '38px' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-search me-1"></i>
                      Search
                    </>
                  )}
                </button>
                <button
                  className="btn btn-primary btn-sm flex-fill"
                  onClick={handleExport}
                  style={{ height: '38px' }}
                >
                  <i className="fa fa-download me-1"></i>
                  Export Excel
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <span className="ms-2">Loading {searchTerm ? 'search results' : 'users'}...</span>
            </div>
          ) : (
            <div className="w-100 table-responsive">
              <table className="table">
                <thead className="tr-rounded">
                  <tr>
                    <th className="text-center"></th>
                    <th className="text-center">S.No</th>
                    <th className="text-center">First Name</th>
                    <th className="text-center">Middle Name</th>
                    <th className="text-center">Last Name</th>
                    <th className="text-center">Email Id</th>
                    <th className="text-center">ID Number</th>
                    <th className="text-center">Phone Number</th>
                    <th className="text-center">User Photo</th>
                    <th className="text-center">Id Photo</th>
                    <th className="text-center">User Type</th>
                    <th className="text-center">Responsible Organisation</th>
                    <th className="text-center">Created By</th>
                    {/* <th>Accred Front</th>
                    <th>Accred Back</th> */}
                    <th className="text-center">Uploaded Letter</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          {(currentPage - 1) * limit + index + 1}
                        </td>
                        <td className="text-center">
                          {item.first_name || "N/A"}
                        </td>
                        <td className="text-center">
                          {item.middle_name || "N/A"}
                        </td>
                        <td className="text-center">
                          {item.last_name || "N/A"}
                        </td>
                        <td className="text-center">
                          {item.email_id || "N/A"}
                        </td>
                        <td className="text-center">
                          {item.id_proof_number || "N/A"}
                        </td>
                        <td className="text-center">
                          {item.mobile_number || "N/A"}
                        </td>
                        <td className="text-center">
                          {item.player_image_path ? (
                            <img
                              onClick={() => {
                                setSelectedImage(item.player_image_path);
                                setSelectedImageAlt("User");
                                setShowImageModal(true);
                              }}
                              src={item.player_image_path}
                              alt="User"
                              style={{
                                maxWidth: "100px",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="text-center">
                          {item.office_id_image ? (
                            <img
                              onClick={() => {
                                setSelectedImage(item.office_id_image);
                                setSelectedImageAlt("Press ID");
                                setShowImageModal(true);
                              }}
                              src={item.office_id_image}
                              alt="Press ID"
                              style={{
                                maxWidth: "100px",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="text-center">
                          {item.sub_category?.sub_category_name_view || item.category_name || "N/A"}
                        </td>
                        <td className="text-center">
                          {item.organisation || "N/A"}
                        </td>
                        <td className="text-center">
                          {item?.created_by?.fullname || "Manual"}
                        </td>
                        {/* Accred Front */}
                        {/* <td>
                          {(() => {
                            const frontUrl =
                              item.accred_front ||
                              item.accred_front_url ||
                              item.front_card_url ||
                              item.front_card_path ||
                              null;
                            return (
                              <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={!frontUrl}
                                onClick={() => frontUrl && window.open(frontUrl, "_blank")}
                              >
                                Preview
                              </button>
                            );
                          })()}
                        </td> */}
                        {/* Accred Back */}
                        {/* <td>
                          {(() => {
                            const backUrl =
                              item.accred_back ||
                              item.accred_back_url ||
                              item.back_card_url ||
                              item.back_card_path ||
                              null;
                            return (
                              <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={!backUrl}
                                onClick={() => backUrl && window.open(backUrl, "_blank")}
                              >
                                Preview
                              </button>
                            );
                          })()}
                        </td> */}
                        {/* Uploaded Letter */}
                        <td className="text-center">
                          {item.letter_of_authorization ? (
                            <a
                              href={item.letter_of_authorization}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Document
                            </a>
                          ) : (
                            "No Document"
                          )}
                        </td>
                        <td className="text-center">
                          <div
                            className="d-flex justify-content-center"
                            style={{ gap: "10px" }}
                          >
                            {/* Show only Disapprove button when reg_status is Disapproved */}
                            {item?.reg_status === "Disapproved" ? (
                              <button
                                className="btn btn-sm btn-danger"
                                disabled
                              >
                                Disapproved
                              </button>
                            ) : item?.reg_status === "Sent For Printing" ? (
                              <button
                                className="btn btn-sm btn-secondary"
                                disabled
                              >
                                Sent For Printing
                              </button>
                            ) : (
                              <>
                                {/* Approve Button */}
                                {item.registration_status !== 2 && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={async () => {
                                      try {
                                        const response = await (isAdmin()
                                          ? captureUser(item)
                                          : approveBySubAdmin(item));

                                        if (response.status === 200) {
                                          const updatedUsers = [...userData];
                                          const index = updatedUsers.findIndex(
                                            (user) =>
                                              user.registration_data_id ===
                                              item.registration_data_id
                                          );
                                          if (index !== -1) {
                                            updatedUsers[index] = {
                                              ...updatedUsers[index],
                                              registration_status: 2,
                                              reg_status: "Sent",
                                            };
                                          }
                                          setUserData(updatedUsers);
                                          setFilteredUsers(updatedUsers);
                                          // Refresh data from server
                                          fetchUsers(currentPage, searchTerm);
                                        } else {
                                          swal(
                                            "Error",
                                            "Failed to approve the user.",
                                            "error"
                                          );
                                        }
                                      } catch (error) {
                                        // swal(
                                        //   "Error",
                                        //   "Something went wrong while approving the user.",
                                        //   "error"
                                        // );
                                      }
                                    }}
                                    disabled={
                                      item?.is_captured === "1" ||
                                      item?.reg_status === "Sent" ||
                                      item?.reg_status === "Sent For Printing"
                                    }
                                  >
                                    {item?.reg_status?.toUpperCase() ||
                                      "Approve"}
                                  </button>
                                )}

                                {(() => {
                                  if (
                                    (isAdmin() &&
                                      item.registration_status === "2") ||
                                    (!isAdmin() &&
                                      (item.registration_status === "1" ||
                                        item.registration_status === "2"))
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={async () => {
                                          try {
                                            const response =
                                              await handleDisapproveClick(item);

                                            if (response.status === 200) {
                                              const updatedUsers = [
                                                ...userData,
                                              ];
                                              const index =
                                                updatedUsers.findIndex(
                                                  (user) =>
                                                    user.registration_data_id ===
                                                    item.registration_data_id
                                                );
                                              if (index !== -1) {
                                                updatedUsers[index] = {
                                                  ...updatedUsers[index],
                                                  registration_status: 0,
                                                  reg_status: "Disapproved",
                                                };
                                              }
                                              setUserData(updatedUsers);
                                              setFilteredUsers(updatedUsers);
                                              // Refresh data from server
                                              fetchUsers(
                                                currentPage,
                                                searchTerm
                                              );
                                            } else {
                                              swal(
                                                "Error",
                                                "Failed to disapprove the user.",
                                                "error"
                                              );
                                            }
                                          } catch (error) {
                                            // swal(
                                            //   "Error",
                                            //   "Something went wrong while disapproving the user.",
                                            //   "error"
                                            // ); \
                                          }
                                        }}
                                        disabled={
                                          item?.is_captured === "1" ||
                                          item?.reg_status ===
                                            "Sent For Printing"
                                        }
                                      >
                                        Disapprove
                                      </button>

                                      <button
                                        onClick={() => handleEditUser(item)}
                                        className="btn btn-sm btn-primary"
                                        disabled={
                                          item?.reg_status ===
                                          "Sent For Printing"
                                        }
                                      >
                                        Edit
                                      </button>
                                    </>
                                  );
                                })()}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="17" className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
          />
          {/* Debug info - remove in production
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 p-2 bg-light border rounded">
              <small className="text-muted">
                Debug: Page {currentPage} of {totalPages}, {totalItems} total items, {limit} per page
              </small>
            </div>
          )} */}
        </div>
      </div>
      {/* Select User Type Modal */}
      <Modal
        show={userTypeModalOpen}
        onHide={() => setUserTypeModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select User Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="list-group">
            {userTypes.map((type) => (
              <button
                key={type.category_id}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  setSelectedUserType(type.category_id);
                  fetchFilteredUsers(type.category_id);
                  setUserTypeModalOpen(false);
                }}
              >
                {type.sub_category_name_view}
              </button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setUserTypeModalOpen(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="editUserType" className="form-label">
              <strong>User Type</strong>
            </label>
            <select
              id="editUserType"
              value={editedUserType.value}
              onChange={(e) => handlEditUserType(e)}
              className="form-control"
            >
              <option value="">Select a user type</option>
              {userTypes.map((userType) => (
                <option key={userType.id} value={userType.sub_category_id}>
                  {userType?.sub_category_name_view}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveEdit}
            disabled={
              users.registration_status === "2" || // Disable button based on registration_status
              (!isAdmin() &&
                (users?.registration_status === "1" ||
                  users?.registration_status === "2")) ||
              users?.reg_status === "Sent For Printing"
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={disapproveModalOpen}
        onHide={() => setDisapproveModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Disapprove User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Reason for Disapproval</label>
            <textarea
              value={disapproveComment}
              onChange={(e) => setDisapproveComment(e.target.value)}
              className="form-control"
              rows="4"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDisapproveModalOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={handleDisapprove}
            disabled={
              users?.registration_status === "2" || // Disable button based on registration_status
              (!isAdmin() &&
                (users?.registration_status === "1" ||
                  users?.registration_status === "2")) ||
              users?.reg_status === "Sent For Printing"
            }
          >
            Disapprove
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt={selectedImageAlt}
      />

      {/* Edit User Type Modal */}
      <EditUserTypeModal
        show={showEditUserTypeModal}
        onHide={handleCloseEditModal}
        userData={selectedUserForEdit}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default PermitUsers;
