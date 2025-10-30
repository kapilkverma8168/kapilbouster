import React, { useEffect, useState } from "react";
import VenueModal from "./venueModal";
import { Button } from "react-bootstrap";
import VenueList from "./venueList";
import PageTitle from "../../../../jsx/layouts/PageTitle";
import axiosInstance from "../../../../services/AxiosInstance";

function Venue() {
  const [showVenueModal, setShowVenueModal] = React.useState(false);
  const [editData, setEditData] = useState(null); // Add edit data state
  const [data, setData] = useState([]);
  const handleClose = () => {
    setShowVenueModal(false);
    setEditData(null); // Reset edit data when closing
  };
  const handleShow = () => {
    setEditData(null); // Reset edit data when adding new venue
    setShowVenueModal(true);
  };
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityList, setCityList] = useState([]);

  // Add function to handle edit venue
  const handleEditVenue = (venueData) => {
    setEditData(venueData);
    setShowVenueModal(true);
  };

  const fetchData = async (query=null) => {
    try {
      const params = {
        page: currPage,
        limit: 10,
      };
      if (query) {
        params.search = query;
        params.page = 1;
      }
      const res = await axiosInstance.get(`/venue`, {
        params,
      });
      setData(res.data.data);
      setCurrPage(res?.data?.currentPage);
      setTotalPage(res?.data?.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchVenueById = async (id) => {
    try {
      const res = await axiosInstance.get(`/venue/${id}`);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching venue:", error);
      return null;
    }
  };
  const fetchCities = async () =>{
    try {
      const res = await axiosInstance.get(`/venue/allCities`);
      setCityList(res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching venue:", error);
      return null;
    }
  }
  useEffect(() => {
    fetchData();
  }, [currPage]);
  useEffect(()=>{
    fetchCities();
  },[])
  return (
    <div className="card">
      <PageTitle
        activeMenu="List"
        motherMenu="Venue"
        Button={() => <Button onClick={handleShow}>Add Venue</Button>}
      />
  <div className="border-top border-2 mx-4" style={{ borderColor: "#D1D5DB" }} />
      <div className="d-flex justify-content-end mb-3 border-t-2">
        <VenueModal
          show={showVenueModal}
          handleClose={handleClose}
          fetchData={fetchData}
          editData={editData} // Pass edit data to modal
          cityList={cityList}
        />
      </div>
      <div className="venue-list">
        <VenueList
          currPage={currPage}
          setCurrPage={setCurrPage}
          totalPage={totalPage}
          fetchData={fetchData}
          data={data}
          setData={setData}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          cityList={cityList}
          onEditVenue={handleEditVenue} // Pass edit handler
        />
      </div>

      {/* <div className="venue-preview mt-4">
        <SingleVenuePreview />
      </div> */}
    </div>
  );
}

export default Venue;
