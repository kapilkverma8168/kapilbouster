import React, { useContext, useState } from "react";
import Pagination from "./Pagination";
import { PermitUserContext } from "./PermitUserContext";
import QRCodeComponent from "./QRcode";
import { useNavigate } from "react-router-dom";

const PermitUserList = () => {
  const {
    setPage,
    limit,
    setLimit,
    totalPages,
    currentPage,
    permitUserData,
    isLoading,
  } = useContext(PermitUserContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleQRCodeClick = (permissionId) => {
    navigate(`/profile/${permissionId}`);
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Permit Users</h5>
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <tbody>
                <tr>
                  <td colSpan={100} className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </div>
          ) : (
            <>
              <div className="pb-2 row">
                <div className="col-md-1">
                  <select
                    className="form-control form-control-sm"
                    value={limit}
                    onChange={(e) => {
                      setPage(1);
                      setLimit(Number(e.target.value));
                    }}
                  >
                    {[10, 20, 30, 40, 50].map((value) => (
                      <option key={`${value}`} value={value}>
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
                      <th>Colour Code</th>
                      <th>Category Code</th>
                      <th>User Type</th>
                      <th>Functional Code</th>
                      <th>Venues and Zones</th>
                      <th>QR Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permitUserData?.data?.length > 0 ? (
                      permitUserData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{item.full_name || "N/A"}</td>
                          <td>
                            {item.gender == 1
                              ? "Male"
                              : item.gender == 2
                              ? "Female"
                              : item.gender == 3
                              ? "Both"
                              : "N/A"}
                          </td>
                          <td>{item?.sport_name || "N/A"}</td>
                          <td>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <span
                                style={{
                                  color: "#888",
                                  marginRight: "10px",
                                }}
                              >
                                {item.venue_color_code || "N/A"}
                              </span>
                              <div
                                style={{
                                  backgroundColor:
                                    item?.venue_color_code || "#ffffff",
                                  height: "24px",
                                  width: "50px",
                                  borderRadius: "10%",
                                  border: "2px solid #ddd",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                                title={`Color: ${
                                  item.venue_color_code || "Default"
                                }`}
                              ></div>
                            </div>
                          </td>
                          <td>{item?.category_code || "N/A"}</td>
                          <td>{item?.functionalCode || "N/A"}</td>
                          <td>
                            {item?.venues?.length > 0 ? (
                              item?.isInfinite ? (
                                <span
                                  style={{
                                    color: "#922b21",
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                  }}
                                >
                                  INFINITE
                                </span>
                              ) : (
                                item?.venues?.map((venue) => (
                                  <div
                                    key={venue.venue_id}
                                    style={{
                                      padding: "8px 12px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        color: "#333",
                                        display: "inline-block",
                                        marginRight: "10px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {venue?.name}
                                    </div>
                                    <div
                                      style={{
                                        display: "inline-flex",
                                        flexWrap: "wrap",
                                        gap: "8px",
                                        alignItems: "center",
                                      }}
                                    >
                                      {venue?.zones?.length > 0 ? (
                                        venue.zones.map((zone) => (
                                          <span
                                            key={zone.id}
                                            style={{
                                              backgroundColor: "#f0f0f0",
                                              borderRadius: "4px",
                                              padding: "4px 8px",
                                              fontSize: "10px",
                                              color: "#333",
                                              boxShadow:
                                                "0 1px 2px rgba(0,0,0,0.1)",
                                            }}
                                          >
                                            {zone?.name}
                                          </span>
                                        ))
                                      ) : (
                                        <span
                                          style={{
                                            color: "#b0b0b0",
                                            fontStyle: "italic",
                                            fontSize: "10px",
                                          }}
                                        >
                                          No Zones
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )
                            ) : (
                              <span
                                style={{
                                  color: "#ff4d4f",
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                }}
                              >
                                N/A
                              </span>
                            )}
                          </td>
                          <td>{item?.sub_category_name_view || "N/A"}</td>{" "}
                          {/* User Type column */}
                          <td>
                            <div
                              onClick={() =>
                                handleQRCodeClick(item.permissionId)
                              }
                            >
                              <QRCodeComponent data={item} />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
                          {" "}
                          {/* Adjusted colspan */}
                          No Users Available for given User Type, Sport and
                          Gender Combination
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setPage(page)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermitUserList;
