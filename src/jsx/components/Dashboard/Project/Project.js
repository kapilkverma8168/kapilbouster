import React from 'react';
import {Link} from 'react-router-dom';	
import {Dropdown} from 'react-bootstrap';

//Images
import cust11 from './../../../../images/customers/11.jpg';
import cust22 from './../../../../images/customers/22.jpg';
import cust33 from './../../../../images/customers/33.jpg';
import cust44 from './../../../../images/customers/44.jpg';
import cust55 from './../../../../images/customers/55.jpg';

const PendingBlog =()=>{
	return(
		<>
			<Link to={"#"} className="btn bgl-warning text-warning fs-18 font-w600">PENDING</Link>
		</>
	)
}
const ProgressBlog =() =>{
	return(
		<>
			<Link to={"#"} className=" btn bg-progress fs-18 font-w600 text-nowrap text-bg-progress">ON PROGRESS</Link>
		</>
	)
}
const CloseBlog =()=>{
	return(
		<>
			<Link to={"#"} className=" btn bgl-success fs-18 font-w600 text-nowrap text-success">CLOSED</Link>
		</>
	)
}

const TabCard = [
	{image: cust11, image2: cust22, title: 'James Jr.', status: <PendingBlog />,},
	{image: cust33, image2: cust44, title: 'Jakob Vetrovs ', status: <ProgressBlog />,},
	{image: cust55, image2: cust11, title: 'James Jr.', status: <CloseBlog />,},
	{image: cust22, image2: cust33, title: 'Jakob Vetrovs ', status: <ProgressBlog />,},
	{image: cust44, image2: cust11, title: 'James Jr.', status: <PendingBlog />,},
];

const TabCard2 = [
	{image: cust33, image2: cust44, title: 'Jakob Vetrovs ', status: <ProgressBlog />,},
	{image: cust22, image2: cust33, title: 'Jakob Vetrovs ', status: <ProgressBlog />,},
];

const TabCard3 = [
	{image: cust11, image2: cust22, title: 'James Jr.', status: <PendingBlog />,},
	{image: cust44, image2: cust11, title: 'James Jr.', status: <PendingBlog />,},
];
const TabCard4 = [
	{image: cust55, image2: cust11, title: 'James Jr.', status: <CloseBlog />,},
];

const ProgressTab = () => {	
	return(
		<>
			{TabCard2.map((item,index)=>(
				<div className="card" key={index}>
					<div className="card-body">
						<div className="row align-items-center">
							<div className="col-xl-3  col-lg-6 col-sm-12 align-items-center customers">
								<div className="media-body">
									<span className="text-primary d-block fs-18 font-w500 mb-1">#P-000441425</span>
									<h3 className="fs-18 text-black font-w600">Redesign Owlio Landing Page Web..</h3>
									<span className="d-block mb-lg-0 mb-0 fs-16"><i className="fas fa-calendar me-3"></i>Created on Sep 8th, 2020</span>
								</div>
							</div>
							<div className="col-xl-2  col-lg-3 col-sm-4  col-6 mb-3">
								<div className="d-flex project-image">
									<img src={item.image} alt="" />
									<div>
										<small className="d-block fs-16 font-w400">Client</small>
										<span className="fs-18 font-w500">{item.title}</span>
									</div>
								</div>
							</div>
							<div className="col-xl-2 col-lg-3 col-sm-4 col-6 mb-3 text-lg-center">
								<div className="d-flex project-image">
									<img src={item.image2} alt="" />
									<div>
										<small className="d-block fs-16 font-w400">Person in charge</small>
										<span className="fs-18 font-w500">Marley Dokidis</span>
									</div>
								</div>
							</div>
							<div className="col-xl-3  col-lg-6 col-sm-6 mb-sm-4 mb-0">
								<div className="d-flex project-image">
									<svg className="me-3" width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="27.5" cy="27.5" r="27.5" fill="#886CC0"/>
										<g clipPath="url(#clip0)">
										<path d="M37.2961 23.6858C37.1797 23.4406 36.9325 23.2843 36.661 23.2843H29.6088L33.8773 16.0608C34.0057 15.8435 34.0077 15.5738 33.8826 15.3546C33.7574 15.1354 33.5244 14.9999 33.2719 15L27.2468 15.0007C26.9968 15.0008 26.7656 15.1335 26.6396 15.3495L18.7318 28.905C18.6049 29.1224 18.604 29.3911 18.7294 29.6094C18.8548 29.8277 19.0873 29.9624 19.3391 29.9624H26.3464L24.3054 38.1263C24.2255 38.4457 24.3781 38.7779 24.6725 38.9255C24.7729 38.9757 24.8806 39 24.9872 39C25.1933 39 25.3952 38.9094 25.5324 38.7413L37.2058 24.4319C37.3774 24.2215 37.4126 23.931 37.2961 23.6858Z" fill="white"/>
										</g>
										<defs>
										<clipPath>
										<rect width="24" height="24" fill="white" transform="translate(16 15)"/>
										</clipPath>
										</defs>
									</svg>
									<div>
										<small className="d-block fs-16 font-w400">Deadline</small>
										<span className="fs-18 font-w500">Tuesday,  Sep 29th 2020</span>
									</div>
								</div>
							</div>
							<div className="col-xl-2  col-lg-6 col-sm-4 mb-sm-3 mb-3 text-end">
								<div className="d-flex justify-content-end project-btn">
									{item.status}
									<Dropdown className="dropdown ms-4 mt-auto mb-auto">
										<Dropdown.Toggle as="div" className="btn-link i-false">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-right" >
											<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
											<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>	
							</div>
						</div>	
					</div>	
				</div>
			))}
		</>
	)
}
 
const PendingTab = () => {	
	return(
		<>
			{TabCard3.map((item,index)=>(
				<div className="card" key={index}>
					<div className="card-body">
						<div className="row align-items-center">
							<div className="col-xl-3  col-lg-6 col-sm-12 align-items-center customers">
								<div className="media-body">
									<span className="text-primary d-block fs-18 font-w500 mb-1">#P-000441425</span>
									<h3 className="fs-18 text-black font-w600">Redesign Owlio Landing Page Web..</h3>
									<span className="d-block mb-lg-0 mb-0 fs-16"><i className="fas fa-calendar me-3"></i>Created on Sep 8th, 2020</span>
								</div>
							</div>
							<div className="col-xl-2  col-lg-3 col-sm-4  col-6 mb-3">
								<div className="d-flex project-image">
									<img src={item.image} alt="" />
									<div>
										<small className="d-block fs-16 font-w400">Client</small>
										<span className="fs-18 font-w500">{item.title}</span>
									</div>
								</div>
							</div>
							<div className="col-xl-2 col-lg-3 col-sm-4 col-6 mb-3 text-lg-center">
								<div className="d-flex project-image">
									<img src={item.image2} alt="" />
									<div>
										<small className="d-block fs-16 font-w400">Person in charge</small>
										<span className="fs-18 font-w500">Marley Dokidis</span>
									</div>
								</div>
							</div>
							<div className="col-xl-3  col-lg-6 col-sm-6 mb-sm-4 mb-0">
								<div className="d-flex project-image">
									<svg className="me-3" width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="27.5" cy="27.5" r="27.5" fill="#886CC0"/>
										<g clipPath="url(#clip0)">
										<path d="M37.2961 23.6858C37.1797 23.4406 36.9325 23.2843 36.661 23.2843H29.6088L33.8773 16.0608C34.0057 15.8435 34.0077 15.5738 33.8826 15.3546C33.7574 15.1354 33.5244 14.9999 33.2719 15L27.2468 15.0007C26.9968 15.0008 26.7656 15.1335 26.6396 15.3495L18.7318 28.905C18.6049 29.1224 18.604 29.3911 18.7294 29.6094C18.8548 29.8277 19.0873 29.9624 19.3391 29.9624H26.3464L24.3054 38.1263C24.2255 38.4457 24.3781 38.7779 24.6725 38.9255C24.7729 38.9757 24.8806 39 24.9872 39C25.1933 39 25.3952 38.9094 25.5324 38.7413L37.2058 24.4319C37.3774 24.2215 37.4126 23.931 37.2961 23.6858Z" fill="white"/>
										</g>
										<defs>
										<clipPath>
										<rect width="24" height="24" fill="white" transform="translate(16 15)"/>
										</clipPath>
										</defs>
									</svg>
									<div>
										<small className="d-block fs-16 font-w400">Deadline</small>
										<span className="fs-18 font-w500">Tuesday,  Sep 29th 2020</span>
									</div>
								</div>
							</div>
							<div className="col-xl-2  col-lg-6 col-sm-4 mb-sm-3 mb-3 text-end">
								<div className="d-flex justify-content-end project-btn">
									{item.status}
									<Dropdown className="dropdown ms-4 mt-auto mb-auto">
										<Dropdown.Toggle as="div" className="btn-link i-false">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-right" >
											<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
											<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>	
							</div>
						</div>	
					</div>	
				</div>
			))}
		</>
	)
}
const CloseTab = () => {	
	return(
		<>
			{TabCard4.map((item,index)=>(
				<div className="card" key={index}>
					<div className="card-body">
						<div className="row align-items-center">
							<div className="col-xl-3  col-lg-6 col-sm-12 align-items-center customers">
								<div className="media-body">
									<span className="text-primary d-block fs-18 font-w500 mb-1">#P-000441425</span>
									<h3 className="fs-18 text-black font-w600">Redesign Owlio Landing Page Web..</h3>
									<span className="d-block mb-lg-0 mb-0 fs-16"><i className="fas fa-calendar me-3"></i>Created on Sep 8th, 2020</span>
								</div>
							</div>
							<div className="col-xl-2  col-lg-3 col-sm-4  col-6 mb-3">
								<div className="d-flex project-image">
									<img src={item.image} alt="" />
									<div>
										<small className="d-block fs-16 font-w400">Client</small>
										<span className="fs-18 font-w500">{item.title}</span>
									</div>
								</div>
							</div>
							<div className="col-xl-2 col-lg-3 col-sm-4 col-6 mb-3 text-lg-center">
								<div className="d-flex project-image">
									<img src={item.image2} alt="" />
									<div>
										<small className="d-block fs-16 font-w400">Person in charge</small>
										<span className="fs-18 font-w500">Marley Dokidis</span>
									</div>
								</div>
							</div>
							<div className="col-xl-3  col-lg-6 col-sm-6 mb-sm-4 mb-0">
								<div className="d-flex project-image">
									<svg className="me-3" width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="27.5" cy="27.5" r="27.5" fill="#886CC0"/>
										<g clipPath="url(#clip0)">
										<path d="M37.2961 23.6858C37.1797 23.4406 36.9325 23.2843 36.661 23.2843H29.6088L33.8773 16.0608C34.0057 15.8435 34.0077 15.5738 33.8826 15.3546C33.7574 15.1354 33.5244 14.9999 33.2719 15L27.2468 15.0007C26.9968 15.0008 26.7656 15.1335 26.6396 15.3495L18.7318 28.905C18.6049 29.1224 18.604 29.3911 18.7294 29.6094C18.8548 29.8277 19.0873 29.9624 19.3391 29.9624H26.3464L24.3054 38.1263C24.2255 38.4457 24.3781 38.7779 24.6725 38.9255C24.7729 38.9757 24.8806 39 24.9872 39C25.1933 39 25.3952 38.9094 25.5324 38.7413L37.2058 24.4319C37.3774 24.2215 37.4126 23.931 37.2961 23.6858Z" fill="white"/>
										</g>
										<defs>
										<clipPath>
										<rect width="24" height="24" fill="white" transform="translate(16 15)"/>
										</clipPath>
										</defs>
									</svg>
									<div>
										<small className="d-block fs-16 font-w400">Deadline</small>
										<span className="fs-18 font-w500">Tuesday,  Sep 29th 2020</span>
									</div>
								</div>
							</div>
							<div className="col-xl-2  col-lg-6 col-sm-4 mb-sm-3 mb-3 text-end">
								<div className="d-flex justify-content-end project-btn">
									{item.status}
									<Dropdown className="dropdown ms-4 mt-auto mb-auto">
										<Dropdown.Toggle as="div" className="btn-link i-false">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-right" >
											<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
											<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>	
							</div>
						</div>	
					</div>	
				</div>
			))}
		</>
	)
}


export { 
	TabCard, PendingBlog,ProgressBlog, CloseBlog,
	PendingTab,ProgressTab,CloseTab
};