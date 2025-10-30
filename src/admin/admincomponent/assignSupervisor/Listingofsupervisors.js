import React, { useState, useEffect } from "react";
import { Spinner, Button } from "react-bootstrap";

function Listingofsupervisors() {
  const [loading, setLoading] = useState(true);
  const [supervisors, setSupervisors] = useState([]);

  // Simulate fetching data with useEffect
  useEffect(() => {
    setTimeout(() => {
      // Example data fetched
      setSupervisors([
        { id: 1, name: "John Doe", dept: "Financial Depaertment" },
        { id: 2, name: "Jane Smith", dept: "Catering Depaertment" },
        { id: 3, name: "Michael Brown", dept: "Sports Depaertment" },
      ]);
      setLoading(false);
    }, 2000); // Simulate a 2-second API delay
  }, []);

  return (
    <div className="w-100 table-responsive">
      {loading ? (
        <div className="text-center py-5">
          {/* React Bootstrap Spinner */}
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3">Loading supervisors...</p>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Department Name</th>
              <th>Supervisor Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {supervisors.length > 0 ? (
              supervisors.map((supervisor, index) => (
                <tr key={supervisor.id}>
                  <td>{index + 1}</td>
                  <td>{supervisor.dept}</td>
                  <td>{supervisor.name}</td>
                  <td>
                    <Button variant="primary" size="sm">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" className="mx-2">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No supervisors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Listingofsupervisors;
