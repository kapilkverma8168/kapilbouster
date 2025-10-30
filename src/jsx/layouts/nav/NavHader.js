import React, { Fragment, useContext, useEffect, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import jharkhandlogo1 from "../../../images/jharkhandlogo1.png";
import jharkhandlogo2 from "../../../images/jharkhandlogo2.png";
import jharkhandlogo3 from "../../../images/jharkhand logo3.png";
import "./style.css";
import UKLOGO from "../../../images/uk_logo.png"
import ASIANAQUATICSLOGO_COLLAPSED from "../../../images/AquaticsLogoCollapsed.png";



export function NavMenuToggle(callback) {
  setTimeout(() => {
    const mainwrapper = document.querySelector("#main-wrapper");
    if (!mainwrapper) return;

    const isNowCollapsed = mainwrapper.classList.toggle("menu-toggle");
    callback?.(isNowCollapsed);
  }, 300);
}
const NavHader = () => {
  const loginDetails = localStorage.getItem("login_Details");
  const loginFullDetails = JSON.parse(loginDetails);
  console.log("loginDetails", loginFullDetails?.user?.name);
  const [toggle, setToggle] = useState(false);
  console.log("toggle===>", toggle);
  const { navigationHader, openMenuToggle, background } =
    useContext(ThemeContext);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateState = () => {
      const mainwrapper = document.querySelector("#main-wrapper");
      const isCollapsed = mainwrapper?.classList.contains("menu-toggle");
      setIsSidebarCollapsed(isCollapsed || screenWidth < 1024);
      setScreenWidth(window.innerWidth);
    };

    updateState();
    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  }, [screenWidth]);

  const showCollapsedLogo = screenWidth < 1024 || isSidebarCollapsed;

  return (
    <div className="nav-header" style={{ zIndex: 11}}>
      <Link to="/dashboard" className=" target-div">
        {background.value === "dark" || navigationHader !== "color_1" ? (
          <Fragment>
            <img
              style={{
                objectFit: showCollapsedLogo ? "contain" : "fill",
                width: "100%",
                height: "100%",
              }}
              height={55}
              width={55}
              src={
                showCollapsedLogo
                  ? ASIANAQUATICSLOGO_COLLAPSED
                  : UKLOGO
              }
              alt="logo"
            />
          </Fragment>
        ) : (
          <Fragment>
             <img
              style={{
                objectFit: showCollapsedLogo ? "contain" : "fill",
                width: "100%",
              }}
              height={70}
              width={55}
              src={
                showCollapsedLogo
                  ? ASIANAQUATICSLOGO_COLLAPSED
                  : UKLOGO
              }
              alt="logo"
            />
          </Fragment>
        )}
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle((prev) => !prev);
          NavMenuToggle(setIsSidebarCollapsed);
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
