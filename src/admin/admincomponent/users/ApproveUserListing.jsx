import React, { useState } from "react";
import PageTitle from "../../../jsx/layouts/PageTitle";
import { Button } from "react-bootstrap";
import PendingList from "./PendingList";

const ApproveUserListing = () => {
  // const [addCard, setAddCard] = useState(false);
  return (
    <div className="card">
      <PageTitle
        activeMenu="List"
        motherMenu="Users"
        // Button={() => (
        //   <Button onClick={() => setAddCard(true)}> Share Form</Button>
        // )}
      />
      <div className="border-top border-2 mx-4" style={{ borderColor: "#D1D5DB" }} />
      <PendingList />
    </div>
  );
};

export default ApproveUserListing;
