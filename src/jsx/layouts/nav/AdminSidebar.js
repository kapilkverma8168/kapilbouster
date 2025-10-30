import React, {
  Component,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { MenuList } from "./Menu";
import { Link } from "react-router-dom";
import Collapse from "react-bootstrap/Collapse"; /// Link

const AdminSidebar = ({ state, setState, menuListData }) => {
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  const handleMenuActive = (status) => {
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  };
  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };
  return (
    <>
      {menuListData?.map((data, index) => {
        let menuClass = data.classsChange;
        if (menuClass === "menu-title") {
          return (
            <li className={menuClass} key={index}>
              {data.title}
            </li>
          );
        } else {
          return (
            <li
              className={` ${state.active === data.title ? "mm-active" : ""}`}
              key={index}
            >
              {data.content && data.content.length > 0 ? (
                <>
                  <Link
                    to={"#"}
                    className="has-arrow"
                    onClick={() => {
                      handleMenuActive(data.title);
                    }}
                  >
                    {data.iconStyle}{" "}
                    <span className="nav-text">
                      {data.title}
                      {data.update && data.update.length > 0 ? (
                        <span className="badge badge-xs badge-danger ms-2">
                          {data.update}
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  </Link>
                  <Collapse in={state.active === data.title ? true : false}>
                    <ul
                      className={`${
                        menuClass === "mm-collapse" ? "mm-show" : ""
                      }`}
                    >
                      {data.content &&
                        data.content.map((data, index) => {
                          return (
                            <li
                              key={index}
                              className={`${
                                state.activeSubmenu === data.title
                                  ? "mm-active"
                                  : ""
                              }`}
                            >
                              {data.content && data.content.length > 0 ? (
                                <>
                                  <Link
                                    to={data.to}
                                    className={data.hasMenu ? "has-arrow" : ""}
                                    onClick={() => {
                                      handleSubmenuActive(data.title);
                                    }}
                                  >
                                    {data.title}
                                  </Link>
                                  <Collapse
                                    in={
                                      state.activeSubmenu === data.title
                                        ? true
                                        : false
                                    }
                                  >
                                    <ul
                                      className={`${
                                        menuClass === "mm-collapse"
                                          ? "mm-show"
                                          : ""
                                      }`}
                                    >
                                      {data.content &&
                                        data.content.map((data, index) => {
                                          return (
                                            <>
                                              <li key={index}>
                                                <Link
                                                  className={`${
                                                    path === data.to
                                                      ? "mm-active"
                                                      : ""
                                                  }`}
                                                  to={data.to}
                                                >
                                                  {data.title}
                                                </Link>
                                              </li>
                                            </>
                                          );
                                        })}
                                    </ul>
                                  </Collapse>
                                </>
                              ) : (
                                <Link to={data.to}>{data.title}</Link>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  </Collapse>
                </>
              ) : (
                <Link to={data.to}>
                  {data.iconStyle}
                  <span className="nav-text">{data.title}</span>
                </Link>
              )}
            </li>
          );
        }
      })}
    </>
  );
};

export default AdminSidebar;
