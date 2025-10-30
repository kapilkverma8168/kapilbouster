import React, { useState } from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { RiInformation2Line } from "react-icons/ri";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { insertCorrectionVerifcationForm } from '../../../services/adminApiService/insituteVerficationApi/InsituteVerficationApiService';
import swal from "sweetalert";
import notify from '../../../utils/notification';
import { useNavigate, useParams } from 'react-router-dom';
const NotCleardCard = ({ insituteVerifyList ,userType}) => {
 
    const { id } = useParams();
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [isRadioSelected, setIsRadioSelected] = useState(false);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleCheckboxChange = () => {
        setIsCheckboxChecked(!isCheckboxChecked);
    };

    const handleRadioSelect = (status) => {
        setIsRadioSelected(true);
        setSelectedStatus(status);
        
        setShowError(false); // Hide error message when a radio button is selected
       
    };

    const filteredList = insituteVerifyList.filter(item => item.remark && item.remark.trim() !== "");

    const handleNotClearedSubmitbtn = async () => {
        if (!isCheckboxChecked || !isRadioSelected) {
            setShowError(true);
            return;
        }

        const payloadData = {
            registration_correction: filteredList,
            registration_id: id,
            registration_type: 1,
            status: selectedStatus
        };

        try {
            const response = await insertCorrectionVerifcationForm(payloadData);

            if (response?.data?.status === true) {
                swal(`${response?.data?.message}`);
                navigate('/Individual'); // Navigate to /Individual upon successful response
            } else {
                notify('error', response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                notify('error', error.response.data.message);
            } else {
                notify('error', 'An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <div className="row">
                <Col lg={12} className="mb-3">
                    <Card style={{ height: 'auto' }}>
                        <Card.Header>
                            <Card.Title className="w-100">
                                <div className="d-flex justify-content-between w-100">
                                    <div>
                                        <span><RiInformation2Line className="text-danger" /></span> CASE: NOT CERTIFIED
                                    </div>
                                </div>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-check d-flex justify-content-start">
                                <div>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        onChange={handleCheckboxChange}
                                        checked={isCheckboxChecked}
                                    />
                                    <label className="form-check-label">
                                    I have checked all information's and documents uploaded and found some incorrect information's. This can lead to either Rejection or Asking for Re-submit Application. <br/>(Choose one of the below options to complete your process).
                                    </label>
                                </div>
                            </div>

                            <div className="d-flex mt-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input bg-danger"
                                        type="radio"
                                        name="reject"
                                        value="reject"
                                        checked={selectedStatus === "reject"}
                                        onChange={() => handleRadioSelect("reject")}
                                    />
                                    <label className="form-check-label">
                                        Not Meeting Criteria
                                    </label>
                                </div>

                                <div className="form-check mx-3">
                                    <input
                                        className="form-check-input bg-warning"
                                        type="radio"
                                        name="resubmit"
                                        value="ask_for_resubmit"
                                        checked={selectedStatus === "ask_for_resubmit"}
                                        onChange={() => handleRadioSelect("ask_for_resubmit")}
                                    />
                                    <label className="form-check-label">
                                        Form Incomplete
                                    </label>
                                </div>
                            </div>

                            {showError && (
                                <div className="text-danger mt-3">
                                    Please select the checkbox and one of the options before submitting.
                                </div>
                            )}

                            <div className="d-flex justify-content-end mt-3">
                                <div>
                                    <Button
                                        onClick={handleNotClearedSubmitbtn}
                                        // disabled={!isCheckboxChecked || !isRadioSelected}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </div>
        </>
    );
};

export default NotCleardCard;


