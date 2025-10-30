import React, { useState } from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";

import swal from "sweetalert";
import notify from '../../../utils/notification';
import { useNavigate, useParams } from "react-router-dom";

const CleardCard = ({clerVerifyApi}) => {
    const { id } = useParams();
    const loginDetails = localStorage.getItem("login_Details");
    const loginFullDetails = JSON.parse(loginDetails);
    const [showError, setShowError] = useState(false);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const navigate = useNavigate();
    const handleCheckboxChange = () => {
        setIsCheckboxChecked(!isCheckboxChecked);
        if (showError && !isCheckboxChecked) {
            setShowError(false);
        }
    };

    const handleClearedSubmitbtn = async () => {
        if (!isCheckboxChecked) {
            setShowError(true);
            return;
        }
        const payloadData = {
            client_id: loginFullDetails?.user?.client_id,
            registration_id: id,
            status: "pass"
        };

        try {
            const response = await clerVerifyApi(payloadData);

            if (response?.data?.status === true) {
                swal(`${response?.data?.message}`);
                navigate('/Organization'); 
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
     <div className="row ">
                    <Col lg={12} className="mb-3">
                        <Card style={{ height: 'auto' }}>
                            <Card.Header>
                                <Card.Title> <IoCheckmarkOutline className="text-success" /> CASE:VERIFIED</Card.Title>
                            </Card.Header>
                            <Card.Body >
                                <div className="form-check d-flex justify-content-center">
                                    <div>
                                        <input className="form-check-input" type="checkbox"   onChange={handleCheckboxChange}
                                        checked={isCheckboxChecked}/>
                                        <label className="form-check-label">
                                            I have checked all fields including documents submitted and found no issue as per crteria. Now i am verifying and Submitting form for Unique ID generation.
                                        </label>
                                        {showError && (
                                <div className="text-danger mt-3">
                                    Please select the checkbox and one of the options before submitting.
                                </div>
                            )}
                                    </div>
                                </div>

                                <div className=" d-flex justify-content-end mt-3">
                                    <div>
                                        <Button onClick={handleClearedSubmitbtn}>
                                            Submit
                                        </Button>
                                        {/* <strong>
                                            <p> <IoMdInformationCircleOutline className="text-warning" /> Form will be Sent to Principal</p>
                                        </strong> */}

                                    </div>

                                </div>
                            </Card.Body>
                        </Card>




                    </Col>


                </div>
    </>
  )
}

export default CleardCard