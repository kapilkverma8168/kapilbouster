import React from "react";
import ManualForm from "./ManualForm";
import WideStrip from "./assets/wide_strip.png";
import "./PublicForm.css";

const PublicRegistrationForm = () => {
  return (
    <div className="public-registration">
      {/* <img 
        src={WideStrip} 
        alt="Uttarakhand National Games Banner" 
        className="banner-image"
      /> */}
      <div className="form-section">
        <ManualForm />
      </div>
    </div>
  );
};

export default PublicRegistrationForm;