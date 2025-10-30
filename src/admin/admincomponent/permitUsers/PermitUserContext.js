import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { PermissionContext } from "../permission/PermissionContext";
import axiosInstance from "../../../services/AxiosInstance";

export const PermitUserContext = createContext();

export const PermitUserProvider = ({ children }) => {
  const { getPermissionData } = useContext(PermissionContext);
  const [permitUserData, setPermitUserData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [userType, setUserType] = useState(null);
  const [gender, setGender] = useState(null);
  const [sport, setSport] = useState(null);
  const [subSportId, setSubSportId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrPage] = useState(1);
  const abortController = useRef(null);
  const isInitialMount = useRef(true);

  const getPermitUserData = useCallback(async (
    userTypeVal = null,
    sportVal = null,
    genderVal = null,
    subSportIdVal = null,
    forceRequest = false
  ) => {
    // Cancel any pending request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    // Use provided values or fall back to state values
    const finalUserType = userTypeVal ?? userType;
    const finalSport = sportVal ?? sport;
    const finalGender = genderVal ?? gender;
    const finalSubSportId = subSportIdVal ?? subSportId;

    try {
      setIsLoading(true);
      setPermitUserData([]);

      // Get all permission data without filters for initial load
      const permissionData = await getPermissionData(
        finalUserType, 
        finalSport, 
        finalGender, 
        finalSubSportId,
        userType ? false : true
      );

      if (!permissionData?.totalItems) {
        setPermitUserData([]);
        setTotalPages(0);
        return false;
      }

      const permissionIds = permissionData.allIds;
      const params = new URLSearchParams();
      
      params.append("limit", limit);
      params.append("page", page);
      params.append("defaultData", 1); // Always include default data for complete dataset

      const response = await axiosInstance.get(
        `/permit/users/${permissionIds}?${params.toString()}`,
        { signal: abortController.current.signal }
      );

      setPermitUserData(response.data);
      setTotalPages(response.data.pagination.totalPages);
      setCurrPage(response.data.pagination.currentPage);
      return response.data.data;

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching permit user data:', error);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, userType, sport, gender, subSportId, getPermissionData]);

  // Initial load effect
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      getPermitUserData(null, null, null, null, true); // Force initial fetch
    }
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (!isInitialMount.current && (userType || sport || gender || subSportId)) {
      getPermitUserData();
    }
  }, [userType, sport, gender, subSportId]);

  // Handle page changes
  useEffect(() => {
    if (!isInitialMount.current) {
      getPermitUserData();
    }
  }, [page]);

  // Handle limit changes
  useEffect(() => {
    if (!isInitialMount.current) {
      setPage(1);
      getPermitUserData();
    }
  }, [limit]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return (
    <PermitUserContext.Provider
      value={{
        getPermitUserData,
        permitUserData,
        limit,
        setLimit,
        totalPages,
        page,
        setPage,
        currentPage,
        setUserType,
        setGender,
        setSport,
        setSubSportId,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </PermitUserContext.Provider>
  );
};