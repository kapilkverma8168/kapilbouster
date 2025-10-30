import React, { useState, useEffect } from "react";
import { Button, Table, Alert } from "react-bootstrap";
import axiosInstance from "../../../../src/services/AxiosInstance";
import Pagination from "../permitUsers/Pagination";

const DiningAtt = ({ filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page: currentPage,
          limit,
          venue_id: filters.venue || undefined,
          type: filters.mealType && filters.mealType !== "all" ? filters.mealType.toLowerCase() : undefined,
          date: filters.date || undefined,
        };
        const response = await axiosInstance.get("/attendance/dining-count", { params });
        setData(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.total?.total_count || 0);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, currentPage, limit]); 

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Dining Attendance List</h5>
            <div>
              <span className="badge bg-primary p-3 fs-4">Total Count: {totalCount}</span>
            </div>
          </div>
          <div className="table-responsive">
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Venue Name</th>
                    <th>Meal Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{item.date || "N/A"}</td>
                        <td>{item.venue_name || "N/A"}</td>
                        <td>{item.type?.charAt(0)?.toUpperCase() + item.type?.slice(1) || "N/A"}</td>
                        <td>{item.count || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)} // Update page when pagination changes
          />
        </div>
      </div>
    </div>
  );
};

export default DiningAtt;
