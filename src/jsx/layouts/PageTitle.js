import React from "react";
import { Link } from "react-router-dom";

const PageTitle = ({
  motherMenu,
  activeMenu,
  pageContent,
  Button,
  fetchData = () => {},
}) => {
  //   let path = window.location.pathname.split("/");
  let path = window.location.pathname
    .split("/")
    .filter((p) => p)
    .join("/");
  return (
    <div className="row m-3">
      {/* <div className="col-sm-6 p-md-0">
			<div className="welcome-text">
			  <h4>Hi, welcome back!</h4>
			  <p className="mb-0">
				{pageContent ? pageContent : "Your business dashboard template"}
			  </p>
			</div>
		  </div>
		  <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
			<ol className="breadcrumb">
			  <li className="breadcrumb-item">
				<Link to={`/${path[path.length - 1]}`}>{motherMenu}</Link>
			  </li>
			  <li className="breadcrumb-item active c">
				<Link to={`/${path[path.length - 1]}`}>{activeMenu}</Link>
			  </li>
			</ol>
		  </div> */}

      <div className="d-flex align-items-center ">
        <ol className="breadcrumb me-auto">
          <li className="breadcrumb-item active">
            <Link to={`/${path}`}>{motherMenu}</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/${path}`}>{activeMenu}</Link>
          </li>
        </ol>
        {Button && <Button fetchData={fetchData} />}
      </div>
    </div>
  );
};

export default PageTitle;
