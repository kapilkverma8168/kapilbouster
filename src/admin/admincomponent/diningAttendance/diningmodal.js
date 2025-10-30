import React, { useState, useEffect } from "react";
import { Button, Alert, Row, Col, Card } from "react-bootstrap";
import swal from "sweetalert";
import axiosInstance from "../../../../src/services/AxiosInstance";
import DiningAtt from "./diningAtt";

const DiningModal = () => {
  const [pageDate] = useState(new Date().toISOString().split("T")[0]);
  const [formData, setFormData] = useState({
    date: pageDate,
    venue: "",
    mealType: "all",
  });

  const [error, setError] = useState("");
  const [venues, setVenues] = useState([]);
  const [mealCounts, setMealCounts] = useState({
    breakfast: 0,
    lunch: 0,
    refreshment: 0,
    dinner: 0,
  });
  const [filters, setFilters] = useState({ date: pageDate, mealType: "all" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Venues
        const venueResponse = await axiosInstance.get("/venue");
        setVenues(venueResponse.data.data || []);

        // Fetch Dining Counts
        const diningResponse = await axiosInstance.get(
          "/attendance/dining-count",
          {
            params: {
              date: filters.date,
              type: filters.mealType !== "all" ? filters.mealType : undefined,
              venue_id: filters.venue || undefined,
            },
          }
        );

        setMealCounts(
          diningResponse.data.typeCounts || {
            breakfast: 0,
            lunch: 0,
            refreshment: 0,
            dinner: 0,
          }
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        swal("Error", "Failed to fetch data. Please try again later.", "error");
      }
    };

    fetchData();
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };
      setFilters(updatedFormData); // Apply filters immediately
      return updatedFormData;
    });
    setError("");
  };

  const handleResetFilters = () => {
    setFormData({ date: null, venue: "", mealType: "all" });
    setFilters({ date: null, venue: "", mealType: "all" });
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/attendance/dining-count/", {
        params: {
          venue_id: filters.venue || undefined,
          type:
            filters.mealType !== "all"
              ? filters.mealType.toLowerCase()
              : undefined,
          date: filters.date || undefined,
          excel: true,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Dining_Attendance.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to export data. Please try again.");
    }
  };

  return (
    <div className="col-12">
      <div className="card mb-4">
        <div className="card-body">
          <Row>
            {["breakfast", "lunch", "refreshment", "dinner"].map((meal) => (
              <Col sm={3} key={meal}>
                <Card className="text-center">
                  <Card.Body>
                    <h6
                      style={{
                        textDecoration: "underline",
                        fontWeight: "bold",
                      }}
                    >
                      {meal === "refreshment"
                        ? "High Tea"
                        : meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </h6>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        marginBottom: "0",
                      }}
                    >
                      {mealCounts[meal] || 0}
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#666" }}>people</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="row mb-3">
            <div className="col-lg-3">
              <label>Select Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                onChange={handleChange}
                value={formData.date || ""}
              />
            </div>
            <div className="col-lg-3">
              <label>Select Venue</label>
              <select
                className="form-control"
                name="venue"
                onChange={handleChange}
                value={formData.venue}
              >
                <option value="">All Venues</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-3">
              <label>Select Meal Type</label>
              <select
                className="form-control"
                name="mealType"
                onChange={handleChange}
                value={formData.mealType}
              >
                <option value="all">All</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="refreshment">High Tea</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div className="col-lg-3 d-flex align-items-center justify-content-start gap-3">
              <Button className="btn btn-md btn-secondary" onClick={handleResetFilters}>
                Reset
              </Button>
              <Button className="btn btn-md btn-success" onClick={handleExport}>
                Export
              </Button>
            </div>
          </form>
        </div>
      </div>
      <DiningAtt filters={filters} />
    </div>
  );
};

export default DiningModal;