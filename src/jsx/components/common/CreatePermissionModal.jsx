import React, { useEffect, useState } from "react";

const CreatePermissionModal = ({ open, onClose, onCreate }) => {
  const [allZones, setAllZones] = useState(false);
  const [venue, setVenue] = useState("");
  const [zone, setZone] = useState("");
  const [transport, setTransport] = useState("");
  const [dining, setDining] = useState("");
  const [color, setColor] = useState("#000000");
  const [categoryCode, setCategoryCode] = useState("");

  useEffect(() => {
    if (open) {
      setAllZones(false);
      setVenue("");
      setZone("");
      setTransport("");
      setDining("");
      setColor("#000000");
      setCategoryCode("");
    }
  }, [open]);

  if (!open) return null;

  const canCreate = venue && zone && color && categoryCode;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Permission</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="allZonesSwitch" checked={allZones} onChange={(e) => setAllZones(e.target.checked)} />
                <label className="form-check-label" htmlFor="allZonesSwitch">All Zone Changes</label>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Select Venue <span className="text-danger">*</span></label>
                  <select className="form-select select-brand" value={venue} onChange={(e) => setVenue(e.target.value)}>
                    <option value="" disabled>Select Venue</option>
                    <option value="Aquatics Stadium">Aquatics Stadium</option>
                    <option value="Maharana pratap complex">Maharana pratap complex</option>
                  </select>
                </div>

               <div className="col-md-4">
                  <label className="form-label">Select Zone <span className="text-danger">*</span></label>
                  <select className="form-select select-brand" value={zone} onChange={(e) => setZone(e.target.value)}>
                    <option value="" disabled>Select Zone</option>
                    <option>FOP</option>
                    <option>Warm-up</option>
                    <option>Media</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Select Transport</label>
                  <select className="form-select select-brand" value={transport} onChange={(e) => setTransport(e.target.value)}>
                    <option value="" disabled>Select Transport</option>
                    <option>T1</option>
                    <option>T2</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Select Dining</label>
                  <select className="form-select select-brand" value={dining} onChange={(e) => setDining(e.target.value)}>
                    <option value="" disabled>Select Dining</option>
                    <option>D1</option>
                    <option>D2</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Color Code <span className="text-danger">*</span></label>
                  <div className="d-flex align-items-center gap-3">
                    <input type="color" className="form-control form-control-color" value={color} onChange={(e) => setColor(e.target.value)} title="Choose color" />
                    <div className="flex-grow-1">
                      <div className="rounded" style={{ height: 32, background: color }} />
                      <small className="text-muted d-block">Selected Color: {color}</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category Code <span className="text-danger">*</span></label>
                  <input className="form-control" placeholder="Enter Category Code" value={categoryCode} onChange={(e) => setCategoryCode(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>Close</button>
              <button className="btn btn-primary" disabled={!canCreate} onClick={() => { onCreate && onCreate({ allZones, venue, zone, transport, dining, color, categoryCode }); onClose && onClose(); }}>Create</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default CreatePermissionModal;
