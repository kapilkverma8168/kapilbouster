import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import { PermissionContext } from "./PermissionContext";
import Pagination from "../permitUsers/Pagination";

const PermissionList = ({ userType, gender, sport, subSportId }) => {
  const {
    permissionList,
    totalPages,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    sports,
  } = useContext(PermissionContext);

  const [loading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditPermission = (item) => {
    // Normalize structure to what EditModal expects
    const normalized = {
      ...item,
      id: item.permission_id, // Map permission_id to id for EditModal
      venues: (item.venues || []).map((v) => ({
        venue_id: v.venue_id ?? v.id,
        venue_name: v.venue_name ?? v.name,
        zones: (v.zones || []).map((z) => ({
          zone_id: z.zone_id ?? z.id,
          zone_name: z.zone_name ?? z.name,
        })),
      })),
      dinings: item.dinings || [],
      travels: item.travels || [],
      is_infinite: item.is_infinite ?? item.isInfinite ?? false,
    };
    setEditData(normalized);
    setShowEditModal(true);
  };

  return (
    <div>
      <div>
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Permission List</h5>
          </div>

          <div className="pb-2 row">
            {/* <div className="col-md-3">
              <label className="form-label">Filter by User Type:</label>
              <select
                className="form-control form-control-sm"
                value={selectedUserType}
                onChange={(e) => handleUserTypeFilter(e.target.value)}
                disabled={!userTypes || userTypes.length === 0}
              >
                <option value="">All User Types</option>
                {userTypes && userTypes.length > 0 ? (
                  userTypes.map((type) => (
                    <option key={type.sub_category_id} value={type.sub_category_id}>
                      {type.sub_category_name_view}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading user types...</option>
                )}
              </select>
            </div> */}
            <div className="col-md-1">
              <label className="form-label">Per Page:</label>
              <select
                className="form-control form-control-sm"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="w-100 table-responsive">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User Type</th>
                    <th>Category Code</th>
                    <th>Gender</th>
                    <th>Sport</th>
                    <th>Venue</th>
                    <th>Zones</th>
                    <th>Dining</th>
                    <th>Transport</th>
                    <th>Colour Code</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionList?.data?.length > 0 ? (
                    permissionList?.data?.map((item, index) => {
                      // Zones: flatten across venues, show zone_name
                      const allZones = (item?.venues || []).flatMap((v) => v?.zones || []);
                      const zonesInfo = allZones.length > 0
                        ? allZones.map((zone) => zone.zone_name || zone.name).join(", ")
                        : "N/A";

                      // Dining: top-level array per new API
                      const diningInfo = (item?.dinings || []).length > 0
                        ? item.dinings.map((d) => d.dining_name || d.name).join(", ")
                        : "-";

                      // Transport: top-level array per new API
                      const transportInfo = (item?.travels || []).length > 0
                        ? item.travels.map((t) => t.travel_name || t.transport_name || t.name).join(", ")
                        : "-";

                      // Venues: show first venue name or INFINITE
                      const firstVenueName = item?.is_infinite || item?.isInfinite
                        ? "INFINITE"
                        : item?.venues?.[0]?.venue_name || item?.venues?.[0]?.name || "N/A";

                      // Gender: handle string (male/female/both) or numeric legacy
                      const genderDisplay = typeof item?.gender === "string"
                        ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1)
                        : item.gender === 1
                          ? "Male"
                          : item.gender === 2
                            ? "Female"
                            : item.gender === 3
                              ? "Both"
                              : "N/A";

                      return (
                        <tr key={index}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>
                            {item?.user_category_sub_type?.sub_category_name_view || "N/A"}
                          </td>
                          <td>
                            {item?.category_code || "N/A"}
                          </td>
                          <td>
                            {genderDisplay}
                          </td>
                          <td>
                            {(() => {
                              const itemSportId = Number(item?.sport_id);
                              const sport = (sports || []).find((s) => Number(s?.sport_id) === itemSportId);
                              return sport?.sport_name || item?.sport_name || item?.sport_id || "N/A";
                            })()}
                          </td>
                          <td>{firstVenueName}</td>
                          <td>{zonesInfo}</td>
                          <td>{diningInfo}</td>
                          <td>{transportInfo}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#888" }}>{item.venue_color_code || "N/A"}</span>
                              <div
                                style={{
                                  backgroundColor: item?.venue_color_code || "#ffffff",
                                  height: "20px",
                                  width: "36px",
                                  borderRadius: 4,
                                  border: "1px solid #ddd",
                                }}
                                title={`Color: ${item.venue_color_code || "Default"}`}
                              />
                            </div>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditPermission(item)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center">
                        No Permissions Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/**
       * Legacy table retained for reference (previous UI with Venue & Zones chips).
       * See commented block below.
       */}

      {/**
      <div>
        <div>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Permission List</h5>
            </div>
            <div className="w-100 table-responsive"> ... previous table ... </div>
          </div>
        </div>
      </div>
      */}

      <CreateModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
      />

      <EditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        editData={editData}
        userType={userType}
        gender={gender}
        sport={sport}
        subSportId={subSportId}
      />
    </div>
  );
};

export default PermissionList;
