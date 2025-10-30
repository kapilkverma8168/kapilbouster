import React, { useState, useEffect } from "react";

const defaultValues = {
  transport_category: "",
  transport_name: "",
  latitude: "",
  longitude: "",
  vehicle_type: "",
  capacity: "",
  description: "",
  venue_id: "",
  image: null
};

const AddTransportModal = ({ open, onClose, onSave, editData, venueId }) => {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData({
          transport_category: editData.transport_category || "",
          transport_name: editData.transport_name || "",
          latitude: editData.latitude || "",
          longitude: editData.longitude || "",
          vehicle_type: editData.vehicle_type || "",
          capacity: editData.capacity || "",
          description: editData.description || "",
          venue_id: venueId || "",
          image: null
        });
        // Set preview URL for existing image
        if (editData.imageURL) {
          setPreviewUrl(editData.imageURL);
        }
      } else {
        setFormData({
          ...defaultValues,
          venue_id: venueId || ""
        });
        setPreviewUrl("");
      }
      setErrors({});
      setShowPreview(false);
    }
  }, [open, editData, venueId]);

  useEffect(() => {
    if (formData.image) {
      const url = URL.createObjectURL(formData.image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (editData && editData.imageURL) {
      setPreviewUrl(editData.imageURL);
    } else {
      setPreviewUrl("");
    }
  }, [formData.image, editData]);


  const handleModalClose = () => {
    setFormData({
      ...defaultValues,
      venue_id: venueId || ""
    });
    setErrors({});
    setPreviewUrl("");
    setShowPreview(false);
    onClose();
  };

  if (!open) return null;

  const setField = (key, value) => setFormData((s) => ({ ...s, [key]: value }));
  const canSave = formData.transport_category && formData.transport_name;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editData ? "Edit Transport" : "Add Transport"}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleModalClose} />
            </div>
            <div className="modal-body">
              {/* General Error Display */}
              {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger mb-3">
                  <strong>Please fix the following errors:</strong>
                  <ul className="mb-0 mt-2">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="row g-3">
                {/* Transport Category */}
                <div className="col-md-6">
                  <label className="form-label">Transport Category <span className="text-danger">*</span></label>
                  <input 
                    className={`input-control form-control ${errors.transport_category ? 'is-invalid' : ''}`}
                    placeholder="Enter Transport Category" 
                    value={formData.transport_category} 
                    onChange={(e) => setField("transport_category", e.target.value.toUpperCase())}
                    maxLength={100}
                  />
                  {errors.transport_category && (
                    <div className="invalid-feedback">{errors.transport_category}</div>
                  )}
                </div>

                {/* Transport Name */}
                <div className="col-md-6">
                  <label className="form-label">Transport Name <span className="text-danger">*</span></label>
                  <input 
                    className={`input-control form-control ${errors.transport_name ? 'is-invalid' : ''}`}
                    placeholder="Enter Transport Name" 
                    value={formData.transport_name} 
                    onChange={(e) => setField("transport_name", e.target.value.toUpperCase())}
                    maxLength={100}
                  />
                  {errors.transport_name && (
                    <div className="invalid-feedback">{errors.transport_name}</div>
                  )}
                </div>

                {/* Vehicle Type */}
                <div className="col-md-6">
                  <label className="form-label">Vehicle Type</label>
                  <input 
                    className={`input-control form-control ${errors.vehicle_type ? 'is-invalid' : ''}`}
                    placeholder="Enter Vehicle Type (Optional)" 
                    value={formData.vehicle_type} 
                    onChange={(e) => setField("vehicle_type", e.target.value.toUpperCase())}
                    maxLength={50}
                  />
                  {errors.vehicle_type && (
                    <div className="invalid-feedback">{errors.vehicle_type}</div>
                  )}
                </div>

                {/* Capacity */}
                <div className="col-md-6">
                  <label className="form-label">Capacity</label>
                  <input 
                    type="number"
                    className={`input-control form-control ${errors.capacity ? 'is-invalid' : ''}`}
                    placeholder="Enter Capacity (Optional)" 
                    value={formData.capacity} 
                    onChange={(e) => setField("capacity", e.target.value)}
                    min="0"
                    max="1000"
                  />
                  {errors.capacity && (
                    <div className="invalid-feedback">{errors.capacity}</div>
                  )}
                </div>

                {/* Latitude */}
                <div className="col-md-6">
                  <label className="form-label">Latitude (Optional)</label>
                  <input 
                    className={`input-control form-control ${errors.latitude ? 'is-invalid' : ''}`}
                    placeholder="Enter Latitude (e.g., 28.6139)" 
                    value={formData.latitude} 
                    onChange={(e) => setField("latitude", e.target.value)}
                  />
                  {errors.latitude && (
                    <div className="invalid-feedback">{errors.latitude}</div>
                  )}
                  <small className="text-muted">Range: -90 to 90 degrees</small>
                </div>

                {/* Longitude */}
                <div className="col-md-6">
                  <label className="form-label">Longitude (Optional)</label>
                  <input 
                    className={`input-control form-control ${errors.longitude ? 'is-invalid' : ''}`}
                    placeholder="Enter Longitude (e.g., 77.2090)" 
                    value={formData.longitude} 
                    onChange={(e) => setField("longitude", e.target.value)}
                  />
                  {errors.longitude && (
                    <div className="invalid-feedback">{errors.longitude}</div>
                  )}
                  <small className="text-muted">Range: -180 to 180 degrees</small>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">Description (Optional)</label>
                  <textarea 
                    className="input-control form-control"
                    rows="3"
                    placeholder="Enter Description (Optional)" 
                    value={formData.description} 
                    onChange={(e) => setField("description", e.target.value.toUpperCase())}
                    maxLength="500"
                  />
                  <small className="text-muted">
                    {formData.description.length}/500 characters
                  </small>
                </div>

                {/* Image Upload - Optional */}
                <div className="col-12">
                  <label className="form-label">Image (Optional)</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="input-control form-control"
                      onChange={(e) => setField("image", e.target.files?.[0] || null)}
                    />
                    <button 
                      type="button" 
                      className="btn-custom" 
                      disabled={!previewUrl} 
                      onClick={() => setShowPreview((v) => !v)}
                    >
                      Preview
                    </button>
                  </div>
                  <small className="text-muted d-block mt-1">Accepted file formats: JPG, JPEG, PNG. Max size: 10MB. Image upload is optional.</small>
                  {showPreview && previewUrl && (
                    <div className="mt-3">
                      <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                className="btn-custom"
                onClick={() => {
                  const init = { ...defaultValues, ...(editData || {}), venue_id: venueId || "" };
                  setFormData(init);
                  setShowPreview(false);
                  setPreviewUrl(editData?.imageURL || "");
                }}
              >
                Reset
              </button>
              <button
                className="btn-primary-custom"
                disabled={!canSave}
                onClick={() => {
                  // Filter out empty values before sending
                  const cleanedData = Object.keys(formData).reduce((acc, key) => {
                    const value = formData[key];
                    // Only include fields that have actual values (not empty strings, null, or undefined)
                    if (value !== null && value !== undefined && value !== '') {
                      acc[key] = value;
                    }
                    return acc;
                  }, {});
                  
                  onSave && onSave(cleanedData);
                  onClose && onClose();
                }}
              >
                {editData ? "Update Transport" : "Save Transport"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default AddTransportModal;
