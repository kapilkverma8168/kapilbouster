import React from "react";
import Pagination from "../../permitUsers/Pagination";
import { useAttendanceContext } from "./AttendanceContext";

const AttendanceListingModal = () => {
  
  const { attendanceData, setCurrPage, setLimit, limit, totalPages, currentPage } =
    useAttendanceContext();
  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Attendance Listing</h5>
          </div>
          <div className="pb-2 row">
            <div className="col-md-1">
              <select
                className="form-control form-control-sm"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-100 table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Sport</th>
                  <th>Venue</th>
                  <th>Zone</th>
                  <th>Address</th>
                  <th>Mark Type</th>
                  <th>Check In/ Check Out</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData?.data?.length > 0 ? (
                  attendanceData?.data
                    // .slice((currentPage - 1) * limit, currentPage * limit)
                    .map((item, index) => (
                      <tr key={item.id}>
                        {" "}
                        {/* Ensure each item has a unique key */}
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{item.fullName || "N/A"}</td>
                        <td>{item.gender}</td>
                        <td>{item.sport_name || "N/A"}</td>
                        <td>{item.venue?.name || "N/A"}</td>
                        <td>{item.zone?.name || "N/A"}</td>
                        <td>{item.address}</td>
                        <td>{item.mark_type_name || "N/A"}</td>
                        <td>{item.checkin_checkout ? 'Check out' : "Check In"}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No Users Available for given User Type, Sport and Gender
                      Combination
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default AttendanceListingModal;
