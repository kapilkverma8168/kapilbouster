import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../../../../services/AxiosInstance";

// Create the context
const AttendanceContext = createContext();

// Create a custom hook to use the context
export const useAttendanceContext = () => {
  return useContext(AttendanceContext);
};

// Create the provider component
export const AttendanceProvider = ({ children }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [submitData, setSubmitData] = useState({
    userType: null,
    sport: null,
    gender: null,
    venue: null,
    zone: null,
    date: null,
    kitId: null,
  });
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrPage] = useState(1);
  const getAttendanceData = async () => {
    try {
      // Filter out null and non-primitive values from submitData
      const filteredData = Object.entries(submitData)
        .filter(
          ([key, value]) =>
            value !== null &&
            (typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean") // Only keep primitive values
        )
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      // Convert filteredData to query parameters
      const queryParams = new URLSearchParams(filteredData).toString();

      // Construct the API URL with query parameters
      const apiUrl = `/attendance/filtered-attendance?limit=${limit}&page=${currentPage}&${queryParams}`;

      console.log("API URL:", apiUrl);

      const res = await axiosInstance.get(apiUrl);
      console.log(res);

      setAttendanceData(res?.data);
      setTotalPages(res?.data?.pagination?.totalPages);
      setCurrPage(res?.data?.pagination?.currentPage);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
    }
  };

  useEffect(() => {
    getAttendanceData();
  }, [limit, currentPage]);

  const contextValue = {
    attendanceData,
    currentPage,
    limit,
    setLimit,
    setAttendanceData,
    setCurrPage,
    totalPages,
    submitData,
    setSubmitData,
    getAttendanceData,
  };

  return (
    <AttendanceContext.Provider value={contextValue}>
      {children}
    </AttendanceContext.Provider>
  );
};
