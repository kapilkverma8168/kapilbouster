import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { ListGroup, Modal } from 'react-bootstrap';
import PageTitle from "../../../layouts/PageTitle";

import Editable from '../../../pages/Editable';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

import AddModal from '../../CommonTable/AddModal';
import { getAllClientByIDList, getAllClientList } from '../../../../services/superadminService/ClientService';
import ClientAddModal from './ClientAddModal';
import "./style.css";
import ClientEditModal from './ClientEditModal';
import ReactPaginate from 'react-paginate';
import ClientUploadLogo from './ClientUploadLogo';



const Client = () => {
    const perPage = 10;
    const [addCard, setAddCard] = useState(false);
    const [contents, setContents] = useState([]);
    const [clientData, setClientData] = useState([]);
    const [basicModal, setBasicModal] = useState(false);
    const [clientViewList, setClientViewList] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [clientId, setClientId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [editContentId, setEditContentId] = useState(null);
    const [showlogoModal, setShowlogoModal] = useState(false);

    // Edit function button click to edit
    const handleEditClick = (clientID) => {
        setShowEditModal(true)
        setClientId(clientID)
        ClientListByIdApi(clientID)



    };

    // edit  data  
    const [editFormData, setEditFormData] = useState({
        name: '',
        department: '',
        gender: '',
        education: '',
        mobile: '',
        email: '',
    })

    //update data function
    const handleEditFormChange = (event) => {
        event.preventDefault();
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;
        setEditFormData(newFormData);
    };

    // edit form data submit
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const editedContent = {
            id: editContentId,
            name: editFormData.name,
            department: editFormData.department,
            gender: editFormData.gender,
            education: editFormData.education,
            mobile: editFormData.mobile,
            email: editFormData.email,
        }
        const newContents = [...contents];
        const index = contents.findIndex((content) => content.id === editContentId);
        newContents[index] = editedContent;
        setContents(newContents);
        setEditContentId(null);
        // setEditModal(false);
    }
    //Cencel button to same data
    const handleCancelClick = () => {
        setEditContentId(null);
    };

    const viewClientFun = (clientId) => {
        ClientListByIdApi(clientId)
        setBasicModal(true)
    }

    const OpenlogoupdateModal = (clientId) => {
        setClientId(clientId)
        setShowlogoModal(true)
    }





    const ClientListByIdApi = async (clientId) => {
        try {

            const response = await getAllClientByIDList(clientId);
            setClientViewList(response?.data)

        } catch (error) {
            console.error('Login error:', error);
        }
    }

    const ClientListApi = async (pageNumber = 1) => {
        //console.log("pageNumber==>",pageNumber);
        try {
            const response = await getAllClientList(pageNumber);
            //console.log("responseClient===>", response.data.data);
            setClientData(response?.data || []);

        } catch (error) {
            console.error('Login error:', error);
        }
    }

    const handlePageChange = ({ selected }) => {
        ClientListApi((selected + 1))
        //dispatch(getBlogsData(selected+1));
        setCurrentPage(selected + 1);
    };



    useEffect(() => {
        ClientListApi(currentPage);
    }, [currentPage]);
    return (

        <>
            <PageTitle activeMenu="Table" motherMenu="Post" />
            <div className="col-12">
                <ClientAddModal addCard={addCard} setAddCard={setAddCard} ClientListApi={ClientListApi} />
                <div className="card">
                    <div className="card-header d-flex">
                        <div>
                            <div className="input-group search-area">
                                <input type="text"
                                    className={`form-control `}
                                    placeholder="Search here..."
                                />
                                <span className="input-group-text" >
                                    <Link to={"#"}><i className="flaticon-381-search-2"></i></Link>
                                </span>
                            </div>
                        </div>
                        <div>
                            <Dropdown as={ButtonGroup}>
                                <Button variant="primary" onClick={() => setAddCard(true)}>Add  <i className="fa fa-plus"></i></Button>


                            </Dropdown>
                        </div>

                    </div>
                    <div className="card-body">
                        <div className="w-100 table-responsive">
                            <div id="example_wrapper" className="dataTables_wrapper">
                                <form onSubmit={handleFormSubmit}>
                                    <table id="example" className="display w-100 dataTable">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Contact</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientData?.data?.length > 0 ? (
                                                clientData.data.map((data, index) => {
                                                    console.log("data====>", data.id);
                                                    return (
                                                        <tr key={index}>
                                                            {editContentId === data?.id ? (
                                                                <Editable
                                                                    editFormData={editFormData}
                                                                    handleEditFormChange={handleEditFormChange}
                                                                    handleCancelClick={handleCancelClick}
                                                                />
                                                            ) : (
                                                                <>
                                                                    <td>{data.id}</td>
                                                                    <td>{data?.name}</td>
                                                                    <td>{data?.email}</td>
                                                                    <td>xyz</td>
                                                                    <td>{data?.mobile}</td>
                                                                    <td>
                                                                        <div className="d-flex">
                                                                            <Link
                                                                                className="btn btn-secondary shadow btn-xs sharp me-2"
                                                                                onClick={(event) => handleEditClick(data?.id)}
                                                                            >
                                                                                <i className="fas fa-pen"></i>
                                                                            </Link>
                                                                            <Link
                                                                                className="btn btn-danger shadow btn-xs sharp me-2"
                                                                                onClick={() => viewClientFun(data?.id)}
                                                                            >
                                                                                <i className="fa fa-eye"></i>
                                                                            </Link>
                                                                            <Link
                                                                                className="btn btn-info shadow btn-xs sharp"
                                                                                onClick={() => OpenlogoupdateModal(data?.id)}
                                                                            >
                                                                                <i className="fa fa-image"></i>
                                                                            </Link>
                                                                        </div>
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center">Data is not available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>



                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={8}
                    marginPagesDisplayed={7}
                    pageCount={Math.ceil(clientData?.total / perPage)}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />

            </div>

            <Modal className="fade" show={basicModal}>
                <Modal.Header>
                    <Modal.Title>View Client</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setBasicModal(false)}
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="basic-list-group">
                        <ListGroup>

                            <ListGroup.Item
                                className="d-flex justify-content-between align-items-center"

                            >
                                <div>
                                    <ul>
                                        <li className="list_of_client">Name</li>
                                        <li className="list_of_client">Email</li>
                                        <li className="list_of_client">Mobile</li>
                                        <li className="list_of_client">Password</li>
                                    </ul>
                                </div>
                                <div>
                                    <ul>
                                        <li className="mb-2">{clientViewList?.name}</li>
                                        <li className="mb-2">{clientViewList?.email}</li>
                                        <li className="mb-2">{clientViewList?.mobile}</li>
                                        <li className="mb-2">{clientViewList?.db_password}</li>
                                    </ul>

                                </div>

                                {/* <Badge variant="primary" pill>
                        {i + 1}
                      </Badge> */}
                            </ListGroup.Item>

                        </ListGroup>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setBasicModal(false)}
                        variant="danger light"
                    >
                        Close
                    </Button>
                    <Button variant="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
            <ClientUploadLogo showlogoModal={showlogoModal} setShowlogoModal={setShowlogoModal} ClientId={clientId} />
            <ClientEditModal showEditModal={showEditModal} setShowEditModal={setShowEditModal} ClientId={clientId} clientViewList={clientViewList} ClientListApi={ClientListApi} />
        </>

    )
}

export default Client