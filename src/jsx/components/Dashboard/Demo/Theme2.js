import React,{useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import {Dropdown} from 'react-bootstrap';

//Images
import chart1 from './../../../../images/chart.png';
import pic3 from './../../../../images/profile/small/pic3.jpg';
import pic4 from './../../../../images/profile/small/pic4.jpg';
import pic5 from './../../../../images/profile/small/pic5.jpg';
import pic6 from './../../../../images/profile/small/pic6.jpg';
//import pic7 from './../../../../images/profile/small/pic7.jpg';
import pic8 from './../../../../images/profile/small/pic8.jpg';
import wind from './../../../../images/big-wind.png';
import hunt from './../../../../images/circle-hunt.png';

//Import Components
import { ThemeContext } from "../../../../context/ThemeContext";
import ProjectStatisticsTab from './../Dashboard/ProjectStatisticsTab';
import ProfileSlider from './../Dashboard/ProfileSlider';
const CompletionApexChart = loadable(() =>
	pMinDelay(import("./../Dashboard/CompletionApexChart"), 1000)
);
const ClientsColumnChart = loadable(() =>
	pMinDelay(import("./../Dashboard/ClientsColumnChart"), 1000)
);
const NewCustomersApex = loadable(() =>
	pMinDelay(import("./../Dashboard/NewCustomersApex"), 1000)
);
const NewCustomersApex2 = loadable(() =>
	pMinDelay(import("./../Dashboard/NewCustomersApex2"), 1000)
);
const ProfileRedialApex = loadable(() =>
	pMinDelay(import("./../Dashboard/ProfileRedialApex"), 1000)
);
const EmailChartApex = loadable(() =>
	pMinDelay(import("./../Dashboard/EmailChartApex"), 1000)
);


const MessagesBlog  = [
	{images: pic8, title: 'Maren Rosser', para: 'Hei, dont forget to clear server cache!', datetime:'25min ago' },
	{images: pic5, title: 'Kaiya Bergson', para: 'I remember that project due is tomorrow.', datetime:'Yesterday, 8:24 AM' },
	{images: pic6, title: 'Ruben Press', para: 'Ok sir. I will fix it as soon as possible', datetime:'December 12th, 2020 10:24 AM' },
	{images: pic3, title: 'Cristofer Torff', para: 'Maybe we should schedule that meeting', datetime:'December 12th, 2020 10:24 AM' },
	{images: pic4, title: 'Ann Rosser', para: 'I dont’t know where that files saved dude.', datetime:'Yesterday, 8:24 AM' },
];

const Theme2 = () => {	
	const { 
		changeBackground,  changePrimaryColor,
		changeNavigationHader,chnageSidebarColor,
		changeSideBarStyle
	} = useContext(ThemeContext);
	  useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
		changePrimaryColor('color_9');
		changeNavigationHader('color_9');
		chnageSidebarColor('color_9');	
		changeSideBarStyle({ value: "mini", label: "Mini" });
		
	}, []);
	
	return(
		<>
			<div className="row">
				<div className="col-xl-12">
					<div className="row">
						<div className="col-xl-6">
							<div className="row">
								<div className="col-xl-12">
									<div className="card tryal-gradient">
										<div className="card-body tryal row">
											<div className="col-xl-7 col-sm-6">
												<h2>Manage your project in one touch</h2>
												<span>Let Fillow manage your project automatically with our best AI systems </span>
												<Link to={"#"} className="btn btn-rounded  fs-18 font-w500">Try Free Now</Link>
											</div>
											<div className="col-xl-5 col-sm-6">
												<img src={chart1} alt="" className="sd-shape" />
											</div>
										</div>
									</div>
								</div>
								
								
								<div className="col-xl-12">
									<ProjectStatisticsTab />
								</div>
								<div className="col-xl-12">
									<div className="card">
										<div className="card-header border-0 pb-0">
											<h4 className="fs-20 font-w700 mb-0">Completion Project Rate</h4>
											<Dropdown className="dropdown ms-2">
												<Dropdown.Toggle as="div" className="btn-link i-false" data-bs-toggle="dropdown">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<circle cx="12.4999" cy="3.5" r="2.5" fill="#A5A5A5"/>
														<circle cx="12.4999" cy="11.5" r="2.5" fill="#A5A5A5"/>
														<circle cx="12.4999" cy="19.5" r="2.5" fill="#A5A5A5"/>
													</svg>
												</Dropdown.Toggle>
												<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
													<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
													<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
										<div className="card-body pb-0">
											<div id="revenueMap" className="revenueMap">
												<CompletionApexChart />
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-12">
									<div className="card">
										<div className="card-header border-0">
											<div>
												<h4 className="fs-20 font-w700">Recent Emails</h4>
												<span className="fs-14 font-w400">Lorem ipsum dolor sit amet</span>
											</div>
											<div>
												<Link to={"#"} className="btn btn-outline-primary btn-rounded fs-18">View More</Link>
											</div>
										</div>
										<div className="card-body px-0">
											<div className="d-flex justify-content-between recent-emails">
												<div className="d-flex">
													<div className="profile-k">
														<span className="bg-success">K</span>	
													</div>
													<div className="ms-3">
														<h4 className="fs-18 font-w500">How to improve project management flows</h4>
														<span className="font-w400 d-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do <br /> eiusmod tempor incididunt ut labore et dolore magna aliqua...</span>
													</div>
												</div>
												<div className="email-check">
													<label className="like-btn mb-0">
														<input type="checkbox" />
														<span className="checkmark"></span>
													</label>
												</div>
											</div>
											<div className="d-flex justify-content-between recent-emails">
												<div className="d-flex">
													<div className="profile-k">
														<img src={pic6} alt="" />
													</div>
													<div className="ms-3">
														<h4 className="fs-18 font-w500">Fillow Final UseCase Diagram</h4>
														<span className="font-w400 d-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do <br /> eiusmod tempor incididunt ut labore et dolore magna aliqua...</span>
														<div className="final-badge">
															<span className="badge text-black border"><i className="far fa-file-alt me-3"></i>Master_file.fig</span>
															<span className="badge text-black border"><i className="fas fa-image me-2"></i>CoverPreview.jpg</span>
															<span className="badge border bgl-primary font-w700">4 files more</span>
														</div>
													</div>
												</div>
												<div className="email-check">
													<label className="like-btn mb-0">
														<input type="checkbox" />
														<span className="checkmark"></span>
													</label>
												</div>
											</div>
											<div className="d-flex justify-content-between recent-emails">
												<div className="d-flex">
													<div className="profile-k">
														<span className="bg-warning">G</span>	
													</div>
													<div className="ms-3">
														<h4 className="fs-18 font-w500">Weekly Design Inspirations by Envato</h4>
														<span className="font-w400 d-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do <br /> eiusmod tempor incididunt ut labore et dolore magna aliqua...</span>
													</div>
												</div>
												<div className="email-check">
													<label className="like-btn mb-0">
														<input type="checkbox" />
														<span className="checkmark"></span>
													</label>
												</div>
											</div>
											<div className="d-flex justify-content-between recent-emails">
												<div className="d-flex">
													<div className="profile-k">
														<img src={pic8} alt="" />
													</div>
													<div className="ms-3">
														<h4 className="fs-18 font-w500">How to improve project management flows</h4>
														<span className="font-w400 d-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do <br /> eiusmod tempor incididunt ut labore et dolore magna aliqua...</span>
													</div>
												</div>
												<div className="email-check">
													<label className="like-btn mb-0">
														<input type="checkbox" />
														<span className="checkmark"></span>
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
								
							</div>	
						</div>	
						<div className="col-xl-6">
							<div className="row">
								<div className="col-xl-12">
									<div className="row">
										<div className="col-xl-6 col-sm-6">
											<div className="card">
												<div className="card-body d-flex px-4 pb-0 justify-content-between">
													<div>
														<h4 className="fs-18 font-w600 mb-4 text-nowrap">Total Clients</h4>
														<div className="d-flex align-items-center">
															<h2 className="fs-32 font-w700 mb-0">68</h2>
															<span className="d-block ms-4">
																<svg width="21" height="11" viewBox="0 0 21 11" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M1.49217 11C0.590508 11 0.149368 9.9006 0.800944 9.27736L9.80878 0.66117C10.1954 0.29136 10.8046 0.291359 11.1912 0.661169L20.1991 9.27736C20.8506 9.9006 20.4095 11 19.5078 11H1.49217Z" fill="#09BD3C"/>
																</svg>
																<small className="d-block fs-16 font-w400 text-success">+0,5%</small>
															</span>
														</div>
													</div>
													<div id="columnChart">
														<ClientsColumnChart />
													</div>
												</div>
											</div>
										</div>
										
										<div className="col-xl-6 col-sm-6">
											<div className="card">
												<div className="card-body px-4 pb-0">
													<h4 className="fs-18 font-w600 mb-5 text-nowrap">Total Clients</h4>
													<div className="progress default-progress">
														<div className="progress-bar bg-gradient1 progress-animated" 
															style={{width: "40%", height:"10px"}} role="progressbar"
														>
															<span className="sr-only">45% Complete</span>
														</div>
													</div>
													<div className="d-flex align-items-end mt-2 pb-3 justify-content-between">
														<span>76 left from target</span>
														<h4 className="mb-0">42</h4>
													</div>
												</div>
											</div>
										</div>
										
										<div className="col-xl-6 col-sm-6">
											<div className="card">
												<div className="card-body d-flex px-4  justify-content-between">
													<div>
														<div className="">
															<h2 className="fs-32 font-w700">562</h2>
															<span className="fs-18 font-w500 d-block">Total Clients</span>
															<span className="d-block fs-16 font-w400">
																<small className="text-danger">-2%</small> than last month
															</span>
														</div>
													</div>
													<div id="NewCustomers">
														<NewCustomersApex />
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-6 col-sm-6">
											<div className="card">
												<div className="card-body d-flex px-4  justify-content-between">
													<div>
														<div className="">
															<h2 className="fs-32 font-w700">892</h2>
															<span className="fs-18 font-w500 d-block">New Projects</span>
															<span className="d-block fs-16 font-w400"><small className="text-success">-2%</small> than last month</span>
														</div>
													</div>
													<div id="NewCustomers1">
														<NewCustomersApex2 />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-12">
									<div className="card">
										<div className="card-body">
											<div className="row">
												<div className="col-xl-6 col-sm-6">
													<ProfileSlider />
												</div>
												<div className="col-xl-6 redial col-sm-6">
													<div id="redial">
														<ProfileRedialApex />
													</div>
													<span className="text-center d-block fs-18 font-w600">On Progress <small className="text-success">70%</small></span>	
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-12 col-lg-12">
									<div className="row">
										<div className="col-xl-6 col-xxl-12 col-sm-6">
											<div className="card">
												<div className="card-header border-0">
													<div>
														<h4 className="fs-20 font-w700">Email Categories</h4>
														<span className="fs-14 font-w400 d-block">Lorem ipsum dolor sit amet</span>
													</div>	
												</div>	
												<div className="card-body">
													<div id="emailchart"> 
														<EmailChartApex />
													</div>
													<div className="mb-3 mt-4">
														<h4 className="fs-18 font-w600">Legend</h4>
													</div>
													<div>
														<div className="d-flex align-items-center justify-content-between mb-4">
															<span className="fs-18 font-w500">	
																<svg className="me-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<rect width="20" height="20" rx="6" fill="#886CC0"/>
																</svg>
																Primary (27%)
															</span>
															<span className="fs-18 font-w600">763</span>
														</div>
														<div className="d-flex align-items-center justify-content-between  mb-4">
															<span className="fs-18 font-w500">	
																<svg className="me-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<rect width="20" height="20" rx="6" fill="#26E023"/>
																</svg>
																Promotion (11%)
															</span>
															<span className="fs-18 font-w600">321</span>
														</div>
														<div className="d-flex align-items-center justify-content-between  mb-4">
															<span className="fs-18 font-w500">	
																<svg className="me-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<rect width="20" height="20" rx="6" fill="#61CFF1"/>
																</svg>
																Forum (22%)
															</span>
															<span className="fs-18 font-w600">69</span>
														</div>
														<div className="d-flex align-items-center justify-content-between  mb-4">
															<span className="fs-18 font-w500">	
																<svg className="me-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<rect width="20" height="20" rx="6" fill="#FFDA7C"/>
																</svg>
																Socials (15%) 
															</span>
															<span className="fs-18 font-w600">154</span>
														</div>
														<div className="d-flex align-items-center justify-content-between  mb-4">
															<span className="fs-18 font-w500">	
																<svg className="me-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<rect width="20" height="20" rx="6" fill="#FF86B1"/>
																</svg>
																Spam (25%) 
															</span>
															<span className="fs-18 font-w600">696</span>
														</div>
													</div>
													
												</div>
												<div className="card-footer border-0 pt-0">
													<Link to={"#"} className="btn btn-outline-primary d-block btn-rounded">Update Progress</Link>		
													
												</div>
											</div>
										</div>		
										<div className="col-xl-6 col-xxl-12 col-sm-6">
											<div className="card">
												<div className="card-header border-0 pb-0">
													<div>
														<h4 className="fs-20 font-w700">Important Projects</h4>
														<span className="fs-14 font-w400 d-block">Lorem ipsum dolor sit amet</span>
													</div>
												</div>
												<div className="card-body pb-0">
													<div className="project-details"> 
														<div className="d-flex align-items-center justify-content-between">
															<div className="d-flex align-items-center">
																<span className="big-wind">
																	<img src={wind} alt="" />
																</span>
																<div className="ms-3">
																	<h4>Big Wind</h4>
																	<span className="fs-14 font-w400">Creative Agency</span>
																</div>
															</div>	
															<Dropdown className="dropdown ms-2">
																<Dropdown.Toggle as="div" className="btn-link i-false" data-bs-toggle="dropdown">
																	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<circle cx="12.4999" cy="3.5" r="2.5" fill="#A5A5A5"/>
																		<circle cx="12.4999" cy="11.5" r="2.5" fill="#A5A5A5"/>
																		<circle cx="12.4999" cy="19.5" r="2.5" fill="#A5A5A5"/>
																	</svg>
																</Dropdown.Toggle>
																<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
																	<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
																	<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</div>
														<h4 className="fs-16 font-w600 mt-4">Optimization Dashboard Page for indexing in Google</h4>
														<div className="projects">
															<span className="badge bgl-warning text-warning font-w700 me-3">SEO</span>
															<span className="badge bgl-danger text-danger font-w700">MARKETING</span>
														</div>
														<div className="mt-3">
															<div className="progress default-progress">
																<div className="progress-bar bg-gradient1 progress-animated" style={{width: "45%", height:"10px"}} role="progressbar">
																	<span className="sr-only">45% Complete</span>
																</div>
															</div>
															<div className="d-flex align-items-end mt-3 pb-3 justify-content-between">
																<span className="fs-14 font-w400"><small className="font-w700 me-2">12</small>Task Done</span>
																<span className="fs-14 font-w400">Due date: 12/05/2020</span>
															</div>
														</div>
													</div>	
													<div className="project-details"> 
														<div className="d-flex align-items-center justify-content-between">
															<div className="d-flex align-items-center">
																<span className="big-wind">
																	<img src={hunt} alt="" />
																</span>
																<div className="ms-3">
																	<h4>Circle Hunt</h4>
																	<span className="fs-14 font-w400">Creative Agency</span>
																</div>
															</div>	
															<Dropdown className="dropdown ms-2">
																<Dropdown.Toggle as="div" className="btn-link i-false" data-bs-toggle="dropdown">
																	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<circle cx="12.4999" cy="3.5" r="2.5" fill="#A5A5A5"/>
																		<circle cx="12.4999" cy="11.5" r="2.5" fill="#A5A5A5"/>
																		<circle cx="12.4999" cy="19.5" r="2.5" fill="#A5A5A5"/>
																	</svg>
																</Dropdown.Toggle>
																<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
																	<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
																	<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</div>
														<h4 className="fs-16 font-w600 mt-4">Redesign Landing Page Website for Company Profile</h4>
														<div className="projects">
															<span className="badge bgl-primary text-primary font-w700 me-3">UI/UX</span>
															<span className="badge bgl-danger text-danger font-w700">WEBSITE</span>
														</div>
														<div className="mt-3">
															<div className="progress default-progress">
																<div className="progress-bar bg-gradient1 progress-animated" style={{width: "45%", height:"10px"}} role="progressbar">
																	<span className="sr-only">45% Complete</span>
																</div>
															</div>
															<div className="d-flex align-items-end mt-3 pb-3 justify-content-between">
																<span className="fs-14 font-w400"><small className="font-w700 me-2">12</small>Task Done</span>
																<span className="fs-14 font-w400">Due date: 12/05/2020</span>
															</div>
														</div>
													</div>	
												</div>
												<div className="card-footer pt-0 border-0">
													<Link to={"#"} className="btn btn-outline-primary d-block btn-rounded">Pin other projects</Link>
												</div>
											</div>
										</div>
									</div>
										
								</div>
								<div className="col-xl-12 col-lg-12">
									<div className="card">
										<div className="card-header border-0">
											<div>
												<h4 className="fs-20 font-w700">Messages</h4>
												<span>Lorem ipsum dolor sit amet</span>
											</div>
											<div>
												<Link to={"#"} className="btn btn-primary btn-rounded">+New Messages</Link>
											</div>
										</div>
										<div className="card-body px-0">
											{MessagesBlog.map((item,index)=>(
												<div className="msg-bx d-flex justify-content-between align-items-center" key={index}>
													<div className="msg d-flex align-items-center w-100">
														<div className="image-box active">
															<img src={item.images} alt="" />
														</div>
														<div className="ms-3 w-100 ">
															<h4 className="fs-18 font-w600">{item.title}</h4>
															<div className="d-flex justify-content-between">
																<span className="me-auto">{item.para}</span>
																<span className="me-4 fs-12">{item.datetime}</span>
															</div>
														</div>
													</div>
													<Dropdown className="dropdown ms-2">
														<Dropdown.Toggle as="div" className="btn-link i-false" data-bs-toggle="dropdown">
															<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<circle cx="12.4999" cy="3.5" r="2.5" fill="#A5A5A5"/>
																<circle cx="12.4999" cy="11.5" r="2.5" fill="#A5A5A5"/>
																<circle cx="12.4999" cy="19.5" r="2.5" fill="#A5A5A5"/>
															</svg>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
															<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
															<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
														</Dropdown.Menu>
													</Dropdown>
												</div>
											))}	
										</div>
									</div>
								
								</div>
							
							</div>							
						</div>							
								
					</div>	
				</div>	
			</div>	
			
		</>
	)
}
export default Theme2;