import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { Modal } from 'react-bootstrap';
import PageTitle from "../../layouts/PageTitle";
import pic1 from '../../../images/profile/small/pic1.jpg';
import Editable from '../../pages/Editable';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';


import AddModal from './AddModal';



const CommonTable = ({ fetchData, config }) => {
    
    const [addCard, setAddCard] = useState(false);
    const [contents, setContents] = useState([]);
    const [editItem, setEditItem] = useState(null);

   
    // delete data  
    const handleDeleteClick = (contentId) => {
        const newContents = [...contents];
        const index = contents.findIndex((content) => content.id === contentId);
        newContents.splice(index, 1);
        setContents(newContents);
    }







    //Edit start 
    //const [editModal, setEditModal] = useState(false);	
    // Edit function editable page loop
    const [editContentId, setEditContentId] = useState(null);

    // Edit function button click to edit
    const handleEditClick = (event, content) => {
        event.preventDefault();
        setEditContentId(content.id);
        const formValues = {
            name: content.name,
            department: content.department,
            gender: content.gender,
            education: content.education,
            mobile: content.mobile,
            email: content.email,
        }
        setEditFormData(formValues);
        //setEditModal(true);
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
    const handleEditFormSubmit = (event) => {
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

    const userLevelListApi = async () => {
        try {
            const response = await fetchData();
            setContents(response.data.data || []);


        } catch (error) {
            console.error('Login error:', error);
        }
    }

    useEffect(() => {
        userLevelListApi()
    }, [])

    if (!contents) {
        return <div>Loading...</div>;
      }

    return (
        <>
            <PageTitle activeMenu="Table" motherMenu="Post"  />
            <div className="col-12">
                <AddModal addCard={addCard} setAddCard={setAddCard} payloadStructure={editItem || { sub_category_name: '', name: '', date: '', status: '' }}/>
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
                        <Button variant="primary" onClick={() => setAddCard(true)}>Add  <i className="fa fa-plus"></i></Button>
                        </div>

                    </div>
                    <div className="card-body">
                        <div className="w-100 table-responsive">
                            <div id="example_wrapper" className="dataTables_wrapper">
                                <form onSubmit={handleEditFormSubmit}>
                                    <table id="example" className="display w-100 dataTable">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contents?.data?.map((content, index) => (
                                                <tr key={index}>
                                                    {editContentId === content[config?.id] ?
                                                        (
                                                            <Editable editFormData={editFormData}
                                                                handleEditFormChange={handleEditFormChange} handleCancelClick={handleCancelClick} />
                                                        ) :
                                                        (
                                                            <>
                                                                <td>{content[config?.id]}</td>
                                                                <td>{content[config?.name]}</td>


                                                                <td>{content[config?.date]}</td>
                                                                <td>
                                                                    <Form.Check 
                                                                        type="switch"
                                                                        id="custom-switch"
                                                                        label=""
                                                                    />
                                                                </td>
                                                               
                                                                <td>
                                                                    <div className="d-flex">
                                                                        <Link className="btn btn-primary shadow btn-xs sharp me-2"
                                                                            onClick={() => setAddCard(true)}
                                                                        >
                                                                            <i className="fa fa-plus"></i>
                                                                        </Link>
                                                                        <Link className="btn btn-secondary	 shadow btn-xs sharp me-2"
                                                                            onClick={(event) => handleEditClick(event, content)}
                                                                        >
                                                                            <i className="fas fa-pen"></i>
                                                                        </Link>
                                                                        <Link className="btn btn-danger shadow btn-xs sharp"
                                                                            onClick={() => handleDeleteClick(content.id)}
                                                                        >
                                                                            <i className="fa fa-trash"></i>
                                                                        </Link>

                                                                    </div>
                                                                </td>
                                                            </>
                                                        )
                                                    }
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CommonTable;