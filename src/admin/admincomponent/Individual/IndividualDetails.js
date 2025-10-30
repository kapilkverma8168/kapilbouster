import React from 'react'
import {
    Row,
    Col,
    Card,
    Table,
    Badge,
    Dropdown,
    ProgressBar,
    Button
} from "react-bootstrap";
import { FaUserLarge } from "react-icons/fa6";
import { formatStatus, getStatusColor } from '../../../utils/colorAsperStatus';


const IndividualDetails = ({verficationList}) => {
    console.log("verficationList====>",verficationList);
  return (
   <>
    <div className="row ">
                <Col lg={12} className="mb-3">
                    <Card style={{ height: 'auto' }}>
                        <div className="d-flex justify-content-between p-2">
                            <div className="mt-2">
                                <h4><span className="mx-2"><FaUserLarge className="text-primary" /></span><span className="mx-2">NAME OF STUDENT :{verficationList?.name}</span></h4>
                            </div>
                            <div>
                                <div><strong>User Type</strong></div>
                                <Button className="bg-primary py-1">{verficationList?.user_category_type?.category_name}</Button>
                            </div>
                        </div>
                    </Card>




                </Col>

                <Col lg={12} className="mb-3">
                    <Card style={{ height: 'auto' }}>
                        <div className="d-flex justify-content-between p-2">
                            <div className="mt-2">
                                <h4><span className="mx-2 text-danger">Current Status:  <span style={{ color: getStatusColor(verficationList?.status) }}>
                                    {verficationList?.status && formatStatus(verficationList?.status)}
                                </span></span></h4>
                            </div>


                            <div className="" style={{ lineHeight: '0px' }}>
                                <div>
                                    <h4>Attempt Count
                                    </h4>
                                </div>
                                <div className="text-center">

                                    <strong> {verficationList?.attempt_count + 1}</strong>
                                </div>

                            </div>

                        </div>
                    </Card>
                </Col>

            </div>
   </>
  )
}

export default IndividualDetails