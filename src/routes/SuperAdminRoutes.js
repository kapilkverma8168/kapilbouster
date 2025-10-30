import CommonTable from "../jsx/components/CommonTable/CommonTable";
import Home from "../jsx/components/Dashboard/Home";
import Client from "../jsx/components/SuperAdmin/client/Client";
import { getAllUserLevel } from "../services/superadminService/UserLevel";
import { getAllUserCategory } from "../services/superadminService/CategoreyType";
import tableConfig from "../config/tableConfig";
import CategoryTypeList from "../admin/admincomponent/categoryType/CategoryTypeList";
import SubCategoryList from "../admin/admincomponent/subCategory/SubCategoryList";
import CreateNewUser from "../admin/admincomponent/users/CreateNewUser";
import ApproveUserListing from "../admin/admincomponent/users/ApproveUserListing";

export const allSuperAdminroutes = [
  /// Dashboard
  { url: "", component: <Home /> },
  { url: "dashboard", component: <Home /> },
  { url: "super-admin-client", component: <Client /> },
  {
    url: "user-level",
    component: (
      <CommonTable
        fetchData={getAllUserLevel}
        config={tableConfig["user-level"]}
      />
    ),
  },
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
  { url: "approve-users", component: <ApproveUserListing /> },

];
