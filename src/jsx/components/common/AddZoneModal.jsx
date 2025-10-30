import React, { useEffect, useState } from "react";

const defaultValues = {
  code: "",
  name: "",
  latitude: "",
  longitude: "",
  capacity: "",
  range: "",
  description: "",
  image: null,
};

const AddZoneModal = ({ open, onClose, onSave, initialValues }) => {
  const [form, setForm] = useState(defaultValues);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (open) {
      const init = { ...defaultValues, ...(initialValues || {}) };
      setForm(init);
      setShowPreview(false);
      setPreviewUrl("");
    }
  }, [open, initialValues]);

  useEffect(() => {
    if (form.image) {
      const url = URL.createObjectURL(form.image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [form.image]);

  if (!open) return null;

  const setField = (key, value) => setForm((s) => ({ ...s, [key]: value }));
  const canSave = form.code && form.name;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Zone</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Zone Code <span className="text-danger">*</span></label>
                  <input className="input-control form-control" placeholder="Enter Zone Code" value={form.code} onChange={(e) => setField("code", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Zone Name <span className="text-danger">*</span></label>
                  <input className="input-control form-control" placeholder="Enter Zone Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Latitude</label>
                  <input className="input-control form-control" placeholder="Enter Latitude" value={form.latitude} onChange={(e) => setField("latitude", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Longitude</label>
                  <input className="input-control form-control" placeholder="Enter Longitude" value={form.longitude} onChange={(e) => setField("longitude", e.target.value)} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Capacity</label>
                  <input type="number" className="input-control form-control" placeholder="Enter Capacity" value={form.capacity} onChange={(e) => setField("capacity", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Range (in meters)</label>
                  <input type="number" className=" input-control form-control" placeholder="Enter Range" value={form.range} onChange={(e) => setField("range", e.target.value)} />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <input className="input-control form-control" placeholder="Enter Description" value={form.description} onChange={(e) => setField("description", e.target.value)} />
                </div>

                <div className="col-12">
                  <label className="form-label">Image</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="input-control form-control"
                      onChange={(e) => setField("image", e.target.files?.[0] || null)}
                    />
                    <button type="button" className="btn-custom" disabled={!form.image} onClick={() => setShowPreview((v) => !v)}>
                      Preview
                    </button>
                  </div>
                  <small className="text-muted d-block mt-1">Accepted file formats: JPG, JPEG, PNG</small>
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
                  const init = { ...defaultValues, ...(initialValues || {}) };
                  setForm(init);
                  setShowPreview(false);
                }}
              >
                Reset
              </button>
              <button
                className="btn-primary-custom"
                disabled={!canSave}
                onClick={() => {
                  onSave && onSave(form);
                  onClose && onClose();
                }}
              >
                Save Zone
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default AddZoneModal;
