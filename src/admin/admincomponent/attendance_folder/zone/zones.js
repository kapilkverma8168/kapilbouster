import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../../../../jsx/layouts/PageTitle";
import axiosInstance from "../../../../services/AxiosInstance";
import ZoneList from "./zoneslist";
import ZoneModal from "./zonesModal";

function Zones() {
  const [showZoneModal, setShowZoneModal] = React.useState(false);
  const [zones, setZones] = useState([]);
  const [activePage, setActivePage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [itemsPerPage] = useState(10); 
  const { id } = useParams(); 

  const handleClose = () => setShowZoneModal(false);

  const fetchZones = React.useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/venue/${id}/zones`, {
        params: {
          page: activePage,
          limit: itemsPerPage,
        },
      });
      const { data } = res.data;
      setZones(data.zones || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  }, [id, activePage, itemsPerPage]);

  

  useEffect(() => {
    fetchZones();
  }, [id, activePage, fetchZones]); 

  return (
    <div className="card">
      <PageTitle
        activeMenu={`List `} 
        motherMenu="Zones"
        // Button={() => <Button onClick={handleShow}>Add Zone</Button>}
      />
  <div className="border-top mx-4" style={{ borderColor: "#E5EAF2" }} />
      <div className="d-flex justify-content-end mb-3">
        <ZoneModal
          show={showZoneModal}
          handleClose={handleClose}
          fetchZones={fetchZones}
          venueId={id}
        />
      </div>
      <div className="zone-list">
        <ZoneList
          venueId={id}
          fetchZones={fetchZones}
          zones={zones}
          setZones={setZones}
          activePage={activePage}
          setActivePage={setActivePage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}

export default Zones;
