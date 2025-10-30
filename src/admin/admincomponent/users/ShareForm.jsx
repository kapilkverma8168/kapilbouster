import React, { useEffect, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import axiosInstance from "../../../services/AxiosInstance";
import swal from "sweetalert";
import { tokenExtractor } from "../../../utils/helper/tokenExtractor";
import { SignJWT } from 'jose';

const ShareForm = ({ addCard, setAddCard }) => {
  const [subtypes, setSubTypes] = useState([]);
  const [form, setForm] = useState({ emails: [], userType: "" });
  const [inputValue, setInputValue] = useState("");
  const [formLink, setFormLink] = useState("");
  const [isMedia, setIsMedia] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const user_id = () => tokenExtractor()?.id || null;

  const generateFormLink = useCallback(async (userType) => {
    console.log("generateFormLink called with userType:", userType);
    const payload = { 
      userType: userType || null, 
      shared_by: user_id() 
    };

    let token;
    const secret = process.env.JWT_SECRET || "Kf7jH2Xp9qRnLz4MvVt3BdCYwG";
    console.log(secret,"secret");
    try {
      const keyBytes = new TextEncoder().encode(secret);

      console.log("payload", payload);
      token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(keyBytes);
      console.log("token is", token);
    } catch (error) {
      console.error('token error', error);
      return;
    }

    const baseUrl =
      process.env.REACT_APP_FRONTEND_URL; 

      console.log("Base URL is", baseUrl);

    let formLink = `${baseUrl}/manual-registration?by=${token}`;
    
    // Add usertype_id parameter to URL if selected
    if (userType) {
      formLink += `&usertype_id=${userType}`;
      console.log("Added usertype_id to URL:", userType);
    }

    console.log("Generated form link:", formLink);
    setFormLink(formLink);
  }, []);

  // Function to generate initial form link without user type (doesn't depend on subtypes)
  const generateInitialFormLink = useCallback(async () => {
    const payload = { 
      userType: null, 
      shared_by: user_id() 
    };

    let token;
    const secret = process.env.JWT_SECRET|| "Kf7jH2Xp9qRnLz4MvVt3BdCYwG" ;
    console.log(secret,"secret");
    try {
      const keyBytes = new TextEncoder().encode(secret);
      
      // Create and sign token (minimal configuration)
      console.log("payload", payload);
      token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(keyBytes);
      console.log("token is", token);
    } catch (error) {
      console.error('token error', error);
      return;
    }

    const baseUrl =
      process.env.REACT_APP_FRONTEND_URL;

    const formLink = `${baseUrl}/manual-registration?by=${token}`;
    setFormLink(formLink);
  }, []);

  useEffect(() => {
    getUserTypes();
    generateInitialFormLink();

    const query = new URLSearchParams(window.location.search);
    if (query.get("type") === "media") {
      setIsMedia(true);
    }
  }, [generateInitialFormLink]);

  const getUserTypes = async () => {
    try {
      const response = await axiosInstance.get("/user-sub-type");
      const data = response.data?.data || [];
      // Map the API response format to the expected format
      const mappedUserTypes = data.map((item) => ({
        id: item.sub_category_id,
        sub_category_id: item.sub_category_id,
        sub_category_name_view: item.sub_category_name_view
      }));
      setSubTypes(mappedUserTypes);
    } catch (error) {
      console.error("Error fetching User Types:", error);
    }
  };

  const shareOnEmail = async (e) => {
    e.preventDefault();
    if (isSharing) return;

    if (form.emails.length === 0) {
      swal("Error", "Please enter at least one email.", "error");
      return;
    }

    try {
      setIsSharing(true);
      
      // Generate the form link with token (userType can be empty)
      await generateFormLink(form.userType);
      
      // Get the admin token
      const adminToken = localStorage.getItem("access_token");
      
      const response = await axiosInstance.post("/email/send-email", {
        to: { 
          emails: form.emails, 
          shared_by: user_id() 
        },
        admin_token: adminToken,  // Include admin token in the body
        form_link: formLink,      // Include the generated form link
        usertype_id: form.userType || null  // Include user type (can be null)
      });

      if (response.status === 200) {
        swal("Success", "Form Shared Successfully", "success");
        setAddCard(false);
        setForm({ emails: [], userType: "" }); // Reset form
      }
    } catch (error) {
      console.error("Error sharing form:", error);
      swal("Error", "Failed to share the form. Try again.", "error");
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = () => {
    if (formLink) {
      navigator.clipboard.writeText(formLink).then(() => {
        swal("Copied!", "Form link copied to clipboard.", "success");
      });
    } else {
      swal("Error", "Form link is not available.", "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    const email = inputValue.trim();
    if (email === "") return;
    
    if (!isValidEmail(email)) {
      swal("Error", "Please enter a valid email address!", "error");
      return;
    }
    
    if (form.emails.includes(email)) {
      swal("Error", "Duplicate email not allowed!", "error");
      return;
    }

    setForm((prev) => ({
      ...prev,
      emails: [...prev.emails, email],
    }));
    setInputValue("");
  };

  const removeEmail = (index) => {
    setForm((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal
      className="modal fade"
      show={addCard}
      onHide={() => setAddCard(false)}
      size="lg"
      centered
      style={{ backgroundColor: 'transparent' }}
    >
     <div className="modal-content" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
          <form onSubmit={shareOnEmail}>
            <div className="modal-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6', borderRadius: '8px 8px 0 0' }}>
              <h4 className="modal-title fs-20">Share Manual Form</h4>
              <button
                type="button"
                className="btn-close"
                onClick={() => setAddCard(false)}
                aria-label="Close"
              >
              </button>
            </div>

            <div className="modal-body" style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
              <div className="row">
                {/* Email Input Section */}
                <div className="col-12 mb-3">
                  <label className="form-label">
                    Enter User Emails <span className="text-danger">*</span>
                  </label>
                  <div className="form-control" style={{ minHeight: "100px", display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                    {form.emails.map((email, index) => (
                      <span
                        key={index}
                        className="badge me-2 mb-1 d-flex align-items-center"
                        style={{ 
                          fontSize: "12px",
                          backgroundColor: "#e3f2fd",
                          color: "#000",
                          border: "1px solid #90caf9"
                        }}
                      >
                        {email}
                        <button
                          type="button"
                          className="btn-close ms-1"
                          onClick={() => removeEmail(index)}
                          style={{ 
                            fontSize: "8px",
                            filter: "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)"
                          }}
                          aria-label="Remove email"
                        >
                        </button>
                      </span>
                    ))}
                    <input
                      type="email"
                      className="border-0 flex-grow-1"
                      placeholder="Enter email address and press Enter or comma..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={addEmail}
                      style={{
                        border: "none",
                        outline: "none",
                        padding: "4px",
                        backgroundColor: "transparent",
                        minWidth: "200px"
                      }}
                    />
                  </div>
                  <small className="text-muted">
                    Press Enter or comma to add email addresses
                  </small>
                </div>

                {/* User Type Selection */}
                <div className="col-12 mb-3">
                  <label className="form-label">
                    Select User Type <span className="text-muted">(Optional)</span>
                  </label>
                  <select
                    className="form-select"
                    value={form.userType}
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      console.log("ShareForm - User type selected:", selectedType);
                      setForm((prev) => ({
                        ...prev,
                        userType: selectedType,
                      }));
                      generateFormLink(selectedType);
                    }}
                  >
                    <option value="">Choose a user type...</option>
                    {subtypes
                      .filter((type) =>
                        isMedia
                          ? type.sub_category_id === 61 ||
                            type.sub_category_id === 62
                          : true
                      )
                      .map((type) => (
                        <option
                          key={type.sub_category_id}
                          value={type.sub_category_id}
                        >
                          {type.sub_category_name_view.trim()}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Form Link Section */}
                {/* {formLink && (
                  <div className="col-12 mb-3">
                    <label className="form-label">
                      Generated Form Link
                    </label>
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="text"
                        value={formLink}
                        readOnly
                        style={{ backgroundColor: "#f8f9fa" }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={copyToClipboard}
                      >
                        Copy Link
                      </button>
                    </div>
                    <small className="text-muted">
                      This link will be sent to the email addresses above
                    </small>
                  </div>
                )} */}
              </div>
            </div>

            <div className="modal-footer" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6', borderRadius: '0 0 8px 8px' }}>
              <button
                type="button"
                onClick={() => setAddCard(false)}
                className="btn btn-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSharing || form.emails.length === 0}
              >
                {isSharing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sharing...
                  </>
                ) : (
                  "Share Form"
                )}
              </button>
            </div>
          </form>
        </div>
    </Modal>
  );
};

export default ShareForm;
