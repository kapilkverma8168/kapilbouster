import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../jsx/layouts/PageTitle";
import AttendanceDataModal from "./AttendanceDataModal";
import { AttendanceProvider } from "./AttendanceContext";
// import ManpowerAllocation from "./ManpowerAllocation"; 

const AttendanceListing = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <PageTitle
        activeMenu="Listing"
        motherMenu="Attendance"
        Button={() => <Button onClick={() => navigate(-1)}>Back</Button>}
      />
      <AttendanceProvider>
        <AttendanceDataModal />
        {/* <div className="mt-4">
          <ManpowerAllocation />
        </div> */}
      </AttendanceProvider>
    </>
  );
};

export default AttendanceListing;
