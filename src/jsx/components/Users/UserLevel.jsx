import React, { useEffect, useMemo, useState } from 'react';
import PageTitle from "../../layouts/PageTitle";
import {
    Row,
    Col,
    Card,
    Table,
    Badge,
    Dropdown,
    ProgressBar,
    Button,
} from "react-bootstrap";
import { getAllUserLevel } from '../../../services/superadminService/UserLevel';
import { Link } from "react-router-dom";

const UserLevel = () => {
    const [userList, setUserList] = useState([]);
    const userLevelListApi = async () => {
        try {
            const response = await getAllUserLevel();
            setUserList(response.data.data || []);


        } catch (error) {
            console.error('Login error:', error);
        }
    }

    useEffect(() => {
        userLevelListApi()
    }, [])

    
    return (
        <>
            <PageTitle activeMenu="Table" motherMenu="Bootstrap" />
            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title className=" w-100">
                                <div className="d-flex justify-content-between">
                                    <div>Exam Toppers</div>
                                    <div><Button className="me-2" variant="primary">
                                       Add
                                    </Button></div>
                                </div>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive>
                                <thead>
                                    <tr>

                                        <th>
                                            <strong>Id</strong>
                                        </th>
                                        <th>
                                            <strong>NAME</strong>
                                        </th>
                                        <th>
                                            <strong>Email</strong>
                                        </th>
                                        <th>
                                            <strong>Date</strong>
                                        </th>
                                        <th>
                                            <strong>Status</strong>
                                        </th>
                                        <th>
                                            <strong>Action</strong>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userList.map((item) => {
                                        return (
                                            <>
                                                <tr>

                                                    <td>
                                                        <strong>{item.id}</strong>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">

                                                            <span className="w-space-no">{item?.user_level_name}</span>
                                                        </div>
                                                    </td>
                                                    <td>example@example.com </td>
                                                    <td>01 August 2020</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <i className="fa fa-circle text-success me-1"></i>{" "}
                                                            Successful
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Link
                                                                href="#"
                                                                className="btn btn-primary shadow btn-xs sharp me-1"
                                                            >
                                                                <i className="fas fa-pencil-alt"></i>
                                                            </Link>
                                                            <Link
                                                                href="#"
                                                                className="btn btn-danger shadow btn-xs sharp"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })}


                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>


            </Row>

        </>
    )
}

export default UserLevel