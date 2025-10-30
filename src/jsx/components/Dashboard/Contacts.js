import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Modal} from 'react-bootstrap';
import swal from "sweetalert";
import {nanoid} from 'nanoid';

import user from './../../../images/pic1.jpg';
import pic1 from './../../../images/pic1.jpg';
import pic2 from './../../../images/pic2.jpg';
import pic3 from './../../../images/pic3.jpg';
import pic4 from './../../../images/pic4.jpg';
import pic5 from './../../../images/pic5.jpg';
import pic6 from './../../../images/pic6.jpg';
//import pic7 from './../../../images/contacts/1.jpg';
import pic8 from './../../../images/contacts/2.jpg';
import pic9 from './../../../images/contacts/3.jpg';
import pic10 from './../../../images/contacts/4.jpg';
import pic11 from './../../../images/contacts/5.jpg';

const contactBlog = [
	{id:1 , image: pic1, name:'Jakob Gouse', profile: 'Highspeed Inc.',},
	{id:2 , image: pic2, name:'Gretchen Aminoff', profile: 'Redblue Studios.',},
	{id:3 , image: pic3, name:'Davis Siphron', profile: 'Beep Beep Inc.',},
	{id:4 , image: pic4, name:'Zaire Lubin', profile: 'Redblue Studios',},
	{id:5 , image: pic5, name:'Jakob Gouse', profile: 'Highspeed Inc.',},
	{id:6 , image: pic6, name:'Gretchen Aminoff', profile: 'Beep Beep Inc.',},
	{id:7 , image: pic3, name:'Davis Siphron', profile: 'Redblue Studios.',},
	{id:8 , image: pic8, name:'Zaire Lubin', profile: 'Highspeed Inc.',},
	{id:9 , image: pic9, name:'Jakob Gouse', profile: 'Beep Beep Inc.',},
	{id:10 , image: pic10, name:'Davis Siphron', profile: 'Redblue Studios.',},
	{id:11 , image: pic11, name:'Gretchen Aminoff', profile: 'Highspeed Inc.',},
	{id:12 , image: pic5,  name:'Zaire Lubin', profile: 'Beep Beep Inc.',},
];

const Contacts = () =>{
	const [addCard, setAddCard] = useState(false);
    const [contacts, setContacts] = useState(contactBlog);
	
	// delete data  
    const handleDeleteClick = (contactId) => {
        const newContacts = [...contacts];    
        const index = contacts.findIndex((contact)=> contact.id === contactId);
        newContacts.splice(index, 1);
        setContacts(newContacts);
    }
	//For Image upload in ListBlog
	const [file, setFile] = React.useState(null)
    const fileHandler = (e) => {
        setFile(e.target.files[0]);
		setTimeout(function(){
			var src = document.getElementById("saveImageFile").getAttribute("src");
			addFormData.image = src; 
		}, 200);
    }
	
	
	//Add data 
    const [addFormData, setAddFormData ] = useState({
        name:'',
        profile:'',
		image:'',
    }); 
    
    // Add contact function
    const handleAddFormChange = (event) => {
        event.preventDefault();    
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        const newFormData = {...addFormData};
        newFormData[fieldName] = fieldValue;
        setAddFormData(newFormData);
    };
    
     //Add Submit data
    const handleAddFormSubmit = (event)=> {
        event.preventDefault();
        var error = false;
		var errorMsg = '';
        if(addFormData.name === ""){
            error = true;
			errorMsg = 'Please fill Name';
        }else if(addFormData.profile === ""){
            error = true;
			errorMsg = 'Please fill profile.';
        }
		else if(addFormData.image === ""){
            error = true;
			errorMsg = 'Please attached image';
        }
        if(!error){
            const newContact = {
                id: nanoid(),
                name: addFormData.name,
                profile:  addFormData.profile,
				image: addFormData.image,
            };
            const newContacts = [...contacts, newContact];
            setContacts(newContacts);
            setAddCard(false);
            swal('Good job!', 'Successfully Added', "success");
            addFormData.name = addFormData.profile = addFormData.image  = '';         
            
        }else{
			swal('Oops', errorMsg, "error");
		}
    }; 
	
	//Edit Modal
	const [editModal, setEditModal] = useState(false);
    
    // Edit function editable page loop
    const [editContactId, setEditContactId] = useState(null);
   
    // Edit function button click to edit
    const handleEditClick = ( event, contact) => {
        event.preventDefault();
        setEditContactId(contact.id);
        const formValues = {
            name: contact.name,
            profile: contact.profile,
			image: contact.image,
        }
        setEditFormData(formValues);
        setEditModal(true);
    };
    
    
    // edit  data  
    const [editFormData, setEditFormData] = useState({
        name:'',
        profile:'',
		image:'',
    })
    
    //update data function
    const handleEditFormChange = (event) => {
        event.preventDefault();   
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        const newFormData = {...editFormData};
        newFormData[fieldName] = fieldValue;
        setEditFormData(newFormData);
    };
    
    // edit form data submit
    const handleEditFormSubmit = (event) => {
        event.preventDefault();
        const editedContact = {
            id: editContactId,
            name: editFormData.name,
            profile: editFormData.profile,
			image: editFormData.image,
        }
        const newContacts = [...contacts];
        const index = contacts.findIndex((contact)=> contact.id === editContactId);
        newContacts[index] = editedContact;
        setContacts(newContacts);
        setEditContactId(null);
        setEditModal(false);    
    }
	
	return(
		<>
			<div className="d-flex justify-content-between align-items-center flex-wrap">
				<div className="input-group contacts-search mb-4">
					<input type="text" className="form-control" placeholder="Search here..." />
					<span className="input-group-text"><Link to={"#"}><i className="flaticon-381-search-2"></i></Link></span>
				</div>
				<div className="mb-4">
					<Link to={"#"} className="btn btn-primary btn-rounded fs-18" onClick={()=> setAddCard(true)}>+ New Contact</Link>
					<Modal className="modal fade"  show={addCard} onHide={setAddCard} >
						<form >
							<div className="modal-header">
								<h4 className="modal-title fs-20">Add Task</h4>
								<button type="button" className="btn-close" onClick={()=> setAddCard(false)}></button>
							</div>
							<div className="modal-body">
								<i className="flaticon-cancel-12 close"></i>
								<div className="add-contact-box">
									<div className="add-contact-content">
										<div className="image-placeholder">	
											<div className="avatar-edit">
												<input type="file" onChange={fileHandler} id="imageUpload" 
													onClick={(event) => setFile(event.target.value)}
												/> 					
												<label htmlFor="imageUpload" name=''  ></label>
											</div>
											<div className="avatar-preview">
												<div id="imagePreview">
													<img id="saveImageFile" src={file? URL.createObjectURL(file) : user} 
														alt={file? file.name : null}
													/>
												</div>
											</div>
										</div> 
										 <div className="form-group mb-3">
											<label className="text-black font-w500">Name</label>
											<div className="contact-name">
												<input type="text"  className="form-control" autoComplete="off"
													name="name" required="required"
													onChange={handleAddFormChange}
													placeholder="name"
												/>
											</div>
										</div>
										<div className="form-group mb-3">
											<label className="text-black font-w500">Profile</label>
											<div className="contact-name">
												<input type="text"  className="form-control"  autoComplete="off"
													name="profile" required="required"
													onChange={handleAddFormChange}
													placeholder="profile"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-primary" onClick={handleAddFormSubmit}>Add</button>  
								<button type="button" onClick={()=> setAddCard(false)} className="btn btn-danger"> <i className="flaticon-delete-1"></i> Discard</button>      
							</div>
						</form>
					</Modal>
					<Modal className="modal fade"  show={editModal} onHide={setEditModal} >
						<form>
							<div className="modal-header">
								<h4 className="modal-title fs-20">Edit Task</h4>
								<button type="button" className="btn-close" onClick={()=> setEditModal(false)} data-dismiss="modal"></button>
							</div>
							<div className="modal-body">
								<i className="flaticon-cancel-12 close" data-dismiss="modal"></i>
								<div className="add-contact-box">
									<div className="add-contact-content">
										<div className="form-group mb-3">
											<label className="text-black font-w500">Name</label>
											<div className="contact-name">
												<input type="text"  className="form-control"  autoComplete="off"
													name="name" required="required"
													value={editFormData.name}
													onChange={handleEditFormChange}
												/>
											</div>
										</div>
										<div className="form-group mb-3">
											<label className="text-black font-w500">Profile</label>
											<div className="contact-name">
												<input type="text" className="form-control"  autoComplete="off"
													name="profile" required="required"
													value={editFormData.profile}
													onChange={handleEditFormChange}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-primary" onClick={handleEditFormSubmit}>Save</button>  
								<button type="button" onClick={()=> setEditModal(false)} className="btn btn-danger"> 
									<i className="flaticon-delete-1"></i> Discard
								</button>      
							</div>
						</form>
					</Modal>
				</div>
			</div>	
			<div className="row">
				<div className="col-xl-12">
					<div className="row">
						{contacts.map((contact,index)=>(
							<div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 items" key={index}>
								<div className="card contact-bx item-content">
									<div className="card-header border-0">
										<div className="action-dropdown">
											<Dropdown>
												<Dropdown.Toggle variant="" as="div" className="btn-link i-false" >	
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<circle cx="12.4999" cy="3.5" r="2.5" fill="#A5A5A5"/>
													<circle cx="12.4999" cy="11.5" r="2.5" fill="#A5A5A5"/>
													<circle cx="12.4999" cy="19.5" r="2.5" fill="#A5A5A5"/>
												</svg>                                  
												</Dropdown.Toggle>	
												<Dropdown.Menu alignRight={true} className="dropdown-menu-right">
													<Dropdown.Item 
														onClick={(event) => handleEditClick(event, contact)}
													>Edit
													</Dropdown.Item>
													<Dropdown.Item className="text-danger"
														onClick={()=>handleDeleteClick(contact.id)}
													>Delete
													</Dropdown.Item>		
												</Dropdown.Menu>	
											</Dropdown>
										</div>
									</div>
									<div className="card-body user-profile">
										<div className="image-bx">
											<img src={contact.image} alt="" className="rounded-circle" />
											<span className="active"></span>
										</div>
										<div className="media-body user-meta-info">
											<h6 className="fs-18 font-w600 my-1"><Link to={"/app-profile"} className="text-black user-name" data-name="Alan Green">{contact.name}</Link></h6>
											<p className="fs-14 mb-3 user-work">{contact.profile}</p>
											<ul>
												<li><Link to={"#"}><i className="fas fa-phone-alt"></i></Link></li>
												<li><Link to={"#"}><i className="far fa-comment-alt"></i></Link></li>
												<li><Link to={"#"}><i className="fas fa-video"></i></Link></li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						))}
						
						
					</div>	
				</div>	
			</div>	
		</>
	)
}
export default Contacts;