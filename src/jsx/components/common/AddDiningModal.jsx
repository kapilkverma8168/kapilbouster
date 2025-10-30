import React, { useState, useEffect } from "react";

const defaultValues = {
  dining_category: "",
  dining_name: "",
  latitude: "",
  longitude: "",
  capacity: "",
  range: "",
  description: "",
  venue_id: "",
  image: null
};

const AddDiningModal = ({ open, onClose, onSave, editData, venueId }) => {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData({
          dining_category: editData.dining_category || "",
          dining_name: editData.dining_name || "",
          latitude: editData.latitude || "",
          longitude: editData.longitude || "",
          capacity: editData.capacity || "",
          range: editData.range || "",
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
  const canSave = formData.dining_category && formData.dining_name;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editData ? "Edit Dining" : "Add Dining"}</h5>
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
                {/* Dining Category */}
                <div className="col-md-6">
                  <label className="form-label">Dining Category <span className="text-danger">*</span></label>
                  <input 
                    className={`input-control form-control ${errors.dining_category ? 'is-invalid' : ''}`}
                    placeholder="Enter Dining Category" 
                    value={formData.dining_category} 
                    onChange={(e) => setField("dining_category", e.target.value.toUpperCase())}
                    maxLength={100}
                  />
                  {errors.dining_category && (
                    <div className="invalid-feedback">{errors.dining_category}</div>
                  )}
                </div>

                {/* Dining Name */}
                <div className="col-md-6">
                  <label className="form-label">Dining Name <span className="text-danger">*</span></label>
                  <input 
                    className={`input-control form-control ${errors.dining_name ? 'is-invalid' : ''}`}
                    placeholder="Enter Dining Name" 
                    value={formData.dining_name} 
                    onChange={(e) => setField("dining_name", e.target.value.toUpperCase())}
                    maxLength={100}
                  />
                  {errors.dining_name && (
                    <div className="invalid-feedback">{errors.dining_name}</div>
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
                    min="1"
                    max="10000"
                  />
                  {errors.capacity && (
                    <div className="invalid-feedback">{errors.capacity}</div>
                  )}
                </div>

                {/* Range */}
                <div className="col-md-6">
                  <label className="form-label">Range (in meters)</label>
                  <input 
                    type="number"
                    className={`input-control form-control ${errors.range ? 'is-invalid' : ''}`}
                    placeholder="Enter Range (Optional)" 
                    value={formData.range} 
                    onChange={(e) => setField("range", e.target.value)}
                    min="1"
                    max="10000"
                  />
                  {errors.range && (
                    <div className="invalid-feedback">{errors.range}</div>
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
                {editData ? "Update Dining" : "Save Dining"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default AddDiningModal;
