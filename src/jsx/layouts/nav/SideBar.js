import React, { useContext, useReducer, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { AuthContext } from "../../../context/AuthContext";

import { SuperAdminMenuList, AdminMenuList, allSubAdminroutes } from "./Menu";
import SuperAdminSidebar from "./SuperAdminSidebar";
import AdminSidebar from "./AdminSidebar";

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};

const SideBar = () => {
  const { user } = useContext(AuthContext);
  const loginDetails = JSON.parse(localStorage.getItem("login_Details"));

  const { iconHover, sidebarposition, headerposition, sidebarLayout, ChangeIconSidebar } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);
  const [hideOnScroll, setHideOnScroll] = useState(true);

  // Detect scroll to hide the sidebar
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  // Filter SuperAdmin menu based on client_id
  const filteredSuperAdminMenuList = SuperAdminMenuList.filter((item) => {
    if (item.title === "Client" && loginDetails.user.client_id > 0) {
      return false; // Exclude Client menu if client_id is greater than 0
    }
    if (item.title === "users Category" && loginDetails.user.client_id === 0) {
      return false; // Exclude Users Category menu if client_id is 0
    }
    return true;
  });

  return (
    <div
      onMouseEnter={() => ChangeIconSidebar(true)}
      onMouseLeave={() => ChangeIconSidebar(false)}
      className={`dlabnav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="dlabnav-scroll">
        <ul className="metismenu" id="menu">
          {/* Display menus based on user role */}
          {loginDetails?.user?.user_type === 4 && (  // Sub-admin check (user_type 4)
            <SuperAdminSidebar
              state={state}
              setState={setState}
              menuListData={filteredSuperAdminMenuList}
            />
          )}

          {loginDetails?.user?.user_type === 3 && (  // Admin check (user_type 3)
            <AdminSidebar
              state={state}
              setState={setState}
              menuListData={AdminMenuList}
            />
          )}

          {loginDetails?.user?.user_type === 4 && (  // Sub-admin menu
            <SuperAdminSidebar
              state={state}
              setState={setState}
              menuListData={allSubAdminroutes}
            />
          )}
        </ul>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
