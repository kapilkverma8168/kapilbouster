import React from 'react'
import { Row, Card, Col, Button, Modal, Container } from "react-bootstrap";
import swal from "sweetalert";
const RemarkModal = ({ remarkshowModal, setRemarkshowModal ,setRemarkdata,setVerficationList,remarkdata,currentRemarkId,updateRemark}) => {
    const handleRemarkSubmit = () => {
        updateRemark(remarkdata);
        setRemarkshowModal(false);
        setRemarkdata('');
    };
    return (
        <>
            <Modal className="fade" show={remarkshowModal}>
                <Modal.Header>
                    <Modal.Title> Remarks</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setRemarkshowModal(false)}
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3 pt-3">
                        <textarea
                            name="write-email"
                            id="write-email"
                            cols="30"
                            rows="5"
                            className="form-control"
                            placeholder="It's really an amazing.I want to know more about it..!"
                            value={remarkdata}
                            onChange={(e) => setRemarkdata(e.target.value)}
                        ></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>

                    <button
                    
                    onClick={handleRemarkSubmit} 
                        className="btn btn-warning btn sweet-confirm"
                    >
                       Remarks
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RemarkModal