import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Pagination from "../permitUsers/Pagination";
import { useNavigate } from "react-router-dom";

const ManpowerAllocationList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [manpowerList, setManpowerList] = useState([]); // Replace with your data source
  const navigate = useNavigate();

  // Filtered list based on search
  const filteredList = manpowerList.filter((item) =>
    item.assignedPeople?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (id) => {
    // Implement remove logic
    console.log("Remove manpower with ID:", id);
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Manpower Allocation List</h5>
            <Button
              variant="primary"
              onClick={() => navigate("/manpower-allocation")}
            >
              Allot Manpower
            </Button>
          </div>

          <div className="pb-2 row">
            <div className="col-md-1">
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

            <div className="col-md-3">
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control form-control-sm me-2"
                  placeholder="Search assigned people"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => console.log("Search")}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="w-100 table-responsive">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Assigned People</th>
                    <th>Venues & Zones</th>
                    <th>Time Stamp</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length > 0 ? (
                    filteredList.map((item, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{item.assignedPeople || "N/A"}</td>
                        <td>
                          {item.venues?.length > 0 ? (
                            item.venues.map((venue) => (
                              <div key={venue.id}>
                                <strong>{venue.name}</strong>
                                <div>
                                  {venue.zones?.length > 0 ? (
                                    venue.zones.map((zone) => (
                                      <span
                                        key={zone.id}
                                        style={{
                                          backgroundColor: "#f0f0f0",
                                          borderRadius: "4px",
                                          padding: "4px 8px",
                                          fontSize: "10px",
                                          marginRight: "5px",
                                        }}
                                      >
                                        {zone.name}
                                      </span>
                                    ))
                                  ) : (
                                    <span>No Zones</span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span>N/A</span>
                          )}
                        </td>
                        <td>{item.timeStamp || "N/A"}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No Manpower Allocated
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredList.length / limit)}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default ManpowerAllocationList;
