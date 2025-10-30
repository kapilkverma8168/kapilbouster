import React, { useEffect, useState } from "react";

const HandoverFlowModal = ({ open, selectedCount = 0, onClose, onConfirm }) => {
  const [step, setStep] = useState("form"); // 'form' | 'confirm'
  const [pocName, setPocName] = useState("");
  const [pocContact, setPocContact] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [handoverTime, setHandoverTime] = useState("");

  useEffect(() => {
    if (open) {
      setStep("form");
      setPocName("");
      setPocContact("");
      setHandoverDate("");
      setHandoverTime("");
    }
  }, [open]);

  if (!open) return null;

  if (step === "form") {
    return (
      <>
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Handover Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
              </div>
              <div className="modal-body">
                <div className="text-muted mb-3" style={{ fontFamily: "Lato", color: "#6B7280", fontSize:"14px" }}>{selectedCount} Users Selected</div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("confirm");
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">POC Name</label>
                    <input
                      type="text"
                      className="form-control input-control"
                      placeholder="Enter POC Name"
                      value={pocName}
                      onChange={(e) => setPocName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">POC Contact</label>
                    <input
                      type="text"
                      className="form-control input-control"
                      placeholder="Enter Contact Number"
                      value={pocContact}
                      onChange={(e) => setPocContact(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control input-control"
                      placeholder="dd/mm/yyyy"
                      value={handoverDate}
                      onChange={(e) => setHandoverDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control input-control"
                      placeholder="hh:mm AM/PM"
                      value={handoverTime}
                      onChange={(e) => setHandoverTime(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary" disabled={!pocName || !pocContact || !handoverDate || !handoverTime || selectedCount === 0}>
                      Handover
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" />
      </>
    );
  }

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Handover Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <div className="text-muted" style={{fontFamily:"Lato",fontWeight:400,fontSize:"16px",lineHeight:"150%", color:"#6B7280"}}>POC Name</div>
                <div style={{fontFamily:"Lato",fontWeight:400,fontSize:"14px",lineHeight:"150%", color:"#2D3747"}}>{pocName || "-"}</div>
              </div>
              <div className="mb-4">
                <div className="text-muted" style={{fontFamily:"Lato",fontWeight:400,fontSize:"16px",lineHeight:"150%", color:"#6B7280"}}>POC Contact</div>
                <div style={{fontFamily:"Lato",fontWeight:400,fontSize:"14px",lineHeight:"150%", color:"#2D3747"}}>{pocContact || "-"}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted" style={{fontFamily:"Lato",fontWeight:400,fontSize:"16px",lineHeight:"150%", color:"#6B7280"}}>Date</div>
                <div style={{fontFamily:"Lato",fontWeight:400,fontSize:"14px",lineHeight:"150%", color:"#2D3747"}}>{handoverDate || "-"}</div>
              </div>
              <div className="mb-4">
                <div className="text-muted" style={{fontFamily:"Lato",fontWeight:400,fontSize:"16px",lineHeight:"150%", color:"#6B7280"}}>Time</div>
                <div style={{fontFamily:"Lato",fontWeight:400,fontSize:"14px",lineHeight:"150%", color:"#2D3747"}}>{handoverTime || "-"}</div>
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onConfirm && onConfirm(pocName, pocContact, handoverDate, handoverTime);
                    onClose && onClose();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default HandoverFlowModal;
