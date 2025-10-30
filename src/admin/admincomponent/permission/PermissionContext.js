import React, { createContext, useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../../services/AxiosInstance";
export const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissionList, setPermissionList] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [sports, setSports] = useState([]);
  const [venues, setVenues] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [userTypeSearchTerm, setUserTypeSearchTerm] = useState("");
  const getPermissionData = useCallback(async (
    userType = null,
    sport = null,
    gender = null,
    subSportId = null,
    allIds = false
  ) => {
    try {
      const params = new URLSearchParams();
      if (userType) params.append("userType", userType);
      if (sport) params.append("sportsNameId", sport);
      if (gender) params.append("gender", gender);
      if (subSportId) params.append("subSportId", subSportId);  
      if(allIds) params.append('allIds', true)
      params.append("limit", limit);
      params.append("page", currentPage);
      const response = await axiosInstance.get(
        `/v2/permission?${params.toString()}`
      );
      setPermissionList(response.data);
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error) {
      console.error("Error fetching permission data:", error);
    }
  }, [limit, currentPage]);

  const fetchUserTypes = async () => {
    try {
      const response = await axiosInstance.get("/user-sub-type/all");
      const data = response.data.data || [];
      // Map the API response format to the expected format
      const mappedUserTypes = data.map((item) => ({
        id: item.sub_category_id,
        sub_category_id: item.sub_category_id,
        sub_category_name_view: item.sub_category_name_view
      }));
      setUserTypes(mappedUserTypes);
    } catch (error) {
      console.error("Error fetching user types:", error);
      setUserTypes([]); // Set empty array on error to prevent undefined issues
      Swal.fire(
        "Error",
        "Unable to fetch User Types. Please try again later.",
        "error"
      );
    }
  };

  const fetchSports = async () => {
    try {
      const response = await axiosInstance.get("/sports-name");
      setSports(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await axiosInstance.get("/venue");
      const venueOptions = res.data.data.map((venue) => ({
        value: venue.id,
        label: venue.name,
      }));
      setVenues(venueOptions);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  useEffect(() => {
    getPermissionData();
    fetchUserTypes();
    fetchSports();
    fetchVenues();
  }, [currentPage, limit, getPermissionData]);

  // Add a function to get permission data with user type filter
  const getPermissionDataWithFilter = async (userType = null) => {
    await getPermissionData(userType);
  };

  // Function to search user types
  const searchUserTypes = (searchTerm) => {
    setUserTypeSearchTerm(searchTerm);
  };

  // Get filtered user types based on search term
  const getFilteredUserTypes = () => {
    if (!userTypeSearchTerm.trim()) {
      return userTypes;
    }
    return userTypes.filter(type =>
      type.sub_category_name_view.toLowerCase().includes(userTypeSearchTerm.toLowerCase())
    );
  };

  return (
    <PermissionContext.Provider
      value={{
        permissionList,
        setPermissionList,
        getPermissionData,
        getPermissionDataWithFilter,
        userTypes,
        sports,
        venues,
        totalPages,
        setCurrentPage,
        currentPage,
        limit,
        setLimit,
        searchUserTypes,
        getFilteredUserTypes,
        userTypeSearchTerm,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
