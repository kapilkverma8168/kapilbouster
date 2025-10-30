import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../jsx/layouts/PageTitle";
import AttendanceSettingModal from "./settingQueryModal";
const AttendanceSetting = () => {
  const navigate = useNavigate();
  return (
    <>
      <PageTitle
        activeMenu="Settings"
        motherMenu="Attendance"
        Button={() => <Button onClick={() => navigate(-1)}>Back</Button>}
      />
      <AttendanceSettingModal />
    </>
  );
};
export default AttendanceSetting;
