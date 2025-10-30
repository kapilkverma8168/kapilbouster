import React, { useEffect, useState } from "react";

const EditUserModal = ({ open, onClose, onSave, user }) => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    organisation: "",
    userType: "",
    idNumber: "",
    profileImage: null,
    idPhoto: null,
  });

  useEffect(() => {
    if (open) {
      setForm({
        firstName: user?.firstName || "",
        middleName: user?.middleName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        organisation: user?.responsibleOrg || "",
        userType: user?.userType || "",
        idNumber: user?.idNumber || "",
        profileImage: null,
        idPhoto: null,
      });
    }
  }, [open, user]);

  if (!open) return null;

  const setField = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const required = form.firstName && form.lastName && form.email && form.phone && form.userType && form.idNumber;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">First Name <span className="text-danger">*</span></label>
                  <input className="form-control" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Middle Name</label>
                  <input className="form-control" value={form.middleName} onChange={(e) => setField("middleName", e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Last Name <span className="text-danger">*</span></label>
                  <input className="form-control" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email Id <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => setField("email", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                  <input className="form-control" value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Responsible Organisation</label>
                  <input className="form-control" value={form.organisation} onChange={(e) => setField("organisation", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">User Type <span className="text-danger">*</span></label>
                  <select className="form-select select-brand" value={form.userType} onChange={(e) => setField("userType", e.target.value)}>
                    <option value="" disabled>Select</option>
                    <option>GMS</option>
                    <option>Broadcast</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Profile Image <span className="text-danger">*</span></label>
                  <input type="file" className="form-control" onChange={(e) => setField("profileImage", e.target.files?.[0] || null)} />
                  {form.profileImage && <small className="text-muted">{form.profileImage.name}</small>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">ID Photo <span className="text-danger">*</span></label>
                  <input type="file" className="form-control" onChange={(e) => setField("idPhoto", e.target.files?.[0] || null)} />
                  {form.idPhoto && <small className="text-muted">{form.idPhoto.name}</small>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">ID Number <span className="text-danger">*</span></label>
                  <input className="form-control" value={form.idNumber} onChange={(e) => setField("idNumber", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>Close</button>
              <button className="btn btn-primary" disabled={!required} onClick={() => { onSave && onSave(form); onClose && onClose(); }}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default EditUserModal;
