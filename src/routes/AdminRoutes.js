import React from "react";
import tableConfig from "../config/tableConfig";
// Import admin-specific components
import Home from "../jsx/components/Dashboard/Home";
import { getAllUserCategory } from "../services/superadminService/UserLevel";
import CommonTable from "../jsx/components/CommonTable/CommonTable";
import CategoryTypeList from "../admin/admincomponent/categoryType/CategoryTypeList";
import SubCategoryList from "../admin/admincomponent/subCategory/SubCategoryList";
import OrganizationList from "../admin/admincomponent/organization/OrganizationList";
import IndividualList from "../admin/admincomponent/Individual/IndividualList";
import IndividualVerificationForm from "../admin/admincomponent/Individual/IndividualVerificationForm";
import OrganizationVerficationForm from "../admin/admincomponent/organization/OrganizationVerficationForm";
import VerifiedUserList from "../admin/admincomponent/verifiedUser/VerifiedUserList";
import ViewUser from "../admin/admincomponent/verifiedUser/ViewUser";
import InsituteViewUser from "../admin/admincomponent/verifiedUser/InsituteViewUser";
import InsituteVeriedUserList from "../admin/admincomponent/verifiedUser/InsituteVeriedUserList";
import ImportExcelModal from "../admin/admincomponent/organization/ImportExcelModal";
import Communication from "../admin/admincomponent/communication/Communication";
import CommunicationList from "../admin/admincomponent/communication/CommunicationList";
import WebsiteNotification from "../admin/admincomponent/communication/WebsiteNotification/WebsiteNotification";
import Ticket from "../admin/admincomponent/ticket/Ticket";
import EventCalendar from "../admin/admincomponent/eventCalendar/EventCalendar";
import ProfileComp from "../admin/admincomponent/Profile/ProfileComp";
import Venue from "../admin/admincomponent/attendance_folder/venue/venue";
import Zones from "../admin/admincomponent/attendance_folder/zone/zones";
// newly added lightweight pages for UI navigation per figma
import Transport from "../admin/admincomponent/attendance_folder/transport/transport";
import Dining from "../admin/admincomponent/attendance_folder/dining/dining";
import Permission from "../admin/admincomponent/permission";
import PermitUsers from "../admin/admincomponent/permitUsers";
import CreateNewUser from "../admin/admincomponent/users/CreateNewUser";
import ApproveUserListing from "../admin/admincomponent/users/ApproveUserListing";
import AttendanceListing from "../admin/admincomponent/attendance_folder/attendance_listing";
import AttendanceSetting from "../admin/admincomponent/attendance_folder/attendance_setting";
import ManpowerAllocation from "../admin/admincomponent/attendance_folder/manpower_allocation/ManpowerAllocation";
import AssignSupervisor from "../admin/admincomponent/assignSupervisor/AssignSupervisor";
import DiningModal from "../admin/admincomponent/diningAttendance/diningmodal";
// import TemplateSetup from "../admin/admincomponent/accreditation/TemplateSetup"; // commented to avoid unused warning
import Printing from "../admin/admincomponent/accreditation/Printing";
import Handover from "../admin/admincomponent/accreditation/Handover";
// import VenueManagement from "../admin/admincomponent/accreditation/VenueManagement"; // commented to avoid unused warning
// import UsersList from "../admin/admincomponent/accreditation/UsersList"; // commented to avoid unused warning
// import AccessPermission from "../admin/admincomponent/accreditation/AccessPermission"; // commented to avoid unused warning
export const allAdminroutes = [
  /// Dashboard
  { url: "", component: <Venue /> },
  { url: "dashboard", component: <Home /> },
  { url: "Organization", component: <OrganizationList /> },
  { url: "Individual", component: <IndividualList /> },
  {
    url: "verification-form/:id",
    component: (
      <OrganizationVerficationForm roleWiseType="insitute" roletype="2" />
    ),
  },
  {
    url: "venue",
    component: <Venue />,
    // component: <VenueManagement />

  },
  {
    url: "permission",
    component: <Permission />, 
    // component: <AccessPermission />
  },
  {
    url: "venue/:id/zones",
    component: <Zones />,
  },
  // comment: enabling navigation targets from Venue list; these use local state for now
  {
    url: "venue/:id/transport",
    component: <Transport />,
  },
  {
    url: "venue/:id/dining",
    component: <Dining />,
  },
  {
    url: "permitusers",
    component: <PermitUsers />,
  },
  {
    url: "verification-Individual-form/:id",
    component: (
      <IndividualVerificationForm roleWiseType="individual" roletype="1" />
    ),
  },
  {
    url: "verified-insitute-user",
    component: <InsituteVeriedUserList roletype="2" roleCategory="insitute" />,
  },
  {
    url: "verified-individual-user",
    component: <VerifiedUserList roletype="1" roleCategory="individual" />,
  },
  { url: "verification-view-form/:id", component: <ViewUser /> },
  {
    url: "verification-insitute-view-form/:id",
    component: <InsituteViewUser />,
  },
  { url: "communication", component: <Communication /> },
  { url: "communication/communication-list", component: <CommunicationList /> },
  { url: "grievance-management", component: <Ticket /> },
  {
    url: "communication/website-notification-list",
    component: <WebsiteNotification />,
  },
  {
    url: "event/event-calendar",
    component: <EventCalendar />,
  },
  {
    url: "profile",
    component: <ProfileComp />,
  },
  { url: "ExcelImport", component: <ImportExcelModal /> },
  {
    url: "user-category",
    component: (
      <CommonTable
        fetchData={getAllUserCategory}
        config={tableConfig["user-category"]}
      />
    ),
  },
  { url: "user-type", component: <SubCategoryList /> },
  { url: "user-category-type", component: <CategoryTypeList /> },
  { url: "create-new-user", component: <CreateNewUser /> },
  { url: "approve-users", 
    component: <ApproveUserListing /> 
    // component: <UsersList />
  },
  { url: "attendance-listing", component: <AttendanceListing /> },
  { url: "attendance-setting", component: <AttendanceSetting /> },
  { url: "attendance-allocation", component: <ManpowerAllocation /> },
  { url: "assign-supervisor", component: <AssignSupervisor /> },
  { url: "dining-attendance", component: <DiningModal/>},
  // { url: "template-setup", component: <TemplateSetup /> },
  { url: "printing", component: <Printing /> },
  { url: "handover", component: <Handover /> },
];

export const allSubAdminroutes = [
  { url: "", component: <CreateNewUser /> },
  { url: "create-new-user", component: <CreateNewUser /> },
  { url: "approve-users", component: <ApproveUserListing /> },
];
