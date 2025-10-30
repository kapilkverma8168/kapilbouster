import React from 'react';
import {Nav, Tab, Dropdown} from 'react-bootstrap';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";



//Images
import DonutChart from './DonutChart';

const ProjectApexChart = loadable(() =>
	pMinDelay(import("./ProjectApexChart"), 1000)
);
const ProjectApexChart2 = loadable(() =>
	pMinDelay(import("./ProjectApexChart2"), 1000)
);

const ProjectStatisticsTab = ()=> {
	return(
		<>
			<Tab.Container defaultActiveKey="Monthly">
				<div className="card">
					<div className="card-header border-0 flex-wrap">
						<h4 className="fs-20 font-w700 mb-2">Project Statistics</h4>
						<div className="d-flex align-items-center project-tab mb-2">	
							<div className="card-tabs ">
								<Nav as="ul" className="nav nav-tabs" role="tablist">
									<Nav.Item as="li" className="nav-item">
										<Nav.Link className="nav-link" eventKey="Monthly" >Monthly</Nav.Link>
									</Nav.Item>
									<Nav.Item as="li" className="nav-item">
										<Nav.Link className="nav-link" eventKey="Weekly">Weekly</Nav.Link>
									</Nav.Item>
									<Nav.Item as="li" className="nav-item">
										<Nav.Link className="nav-link" eventKey="Today">Today</Nav.Link>
									</Nav.Item>
								</Nav>
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
					</div>
					<div className="card-body">
						<div className="d-flex justify-content-between align-items-center flex-wrap">
							<div className="d-flex">
								<div className="d-inline-block position-relative donut-chart-sale mb-3">
									<DonutChart value="63" backgroundColor="rgba(136,108,192,1)"
										backgroundColor2= "rgba(241, 234, 255, 1)"
									/>
								</div>
								<div className="ms-3">
									<h4 className="fs-24 font-w700 ">246</h4>
									<span className="fs-16 font-w400 d-block">Total Projects</span>
								</div>
							</div>
							<div className="d-flex">	
								<div className="d-flex me-5">
									<div className="mt-2">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
											<circle cx="6.5" cy="6.5" r="6.5" fill="#FFCF6D"/>
										</svg>
									</div>
									<div className="ms-3">
										<h4 className="fs-24 font-w700 ">246</h4>
										<span className="fs-16 font-w400 d-block">On Going</span>
									</div>
								</div>
								<div className="d-flex">
									<div className="mt-2">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
											<circle cx="6.5" cy="6.5" r="6.5" fill="#FFA7D7"/>
										</svg>

									</div>
									<div className="ms-3">
										<h4 className="fs-24 font-w700 ">28</h4>
										<span className="fs-16 font-w400 d-block">Unfinished</span>
									</div>
								</div>
							</div>
						</div>
						<Tab.Content>
							<Tab.Pane eventKey="Monthly" >	
								<div className="tab-pane active">
									<div id="chartBar" className="chartBar">
										<ProjectApexChart />
									</div>
								</div>	
							</Tab.Pane>	
							<Tab.Pane eventKey="Weekly">	
								<div className="tab-pane">
									<div id="chartBar1" className="chartBar">
										<ProjectApexChart2 />
									</div>
								</div>
							</Tab.Pane>	
							<Tab.Pane eventKey="Today" >	
								<div className="tab-pane">
									<div id="chartBar2" className="chartBar">
										<ProjectApexChart />
									</div>
								</div>
							</Tab.Pane>		
						</Tab.Content>	
						<div className="d-flex align-items-center">
							<label className="form-check-label font-w400 fs-16 mb-0" htmlFor="flexSwitchCheckChecked1">Number</label>
							<div className="form-check form-switch toggle-switch">
								<input className="form-check-input custome" type="checkbox" id="flexSwitchCheckChecked1" defaultChecked />
							</div>
							<label className="form-check-label font-w400 fs-16 mb-0 ms-3" htmlFor="flexSwitchCheckChecked2">Analytics</label>	
							<div className="form-check form-switch toggle-switch">
							  <input className="form-check-input custome" type="checkbox" id="flexSwitchCheckChecked2" defaultChecked />
							</div>
						</div>
					</div>
				</div>
			</Tab.Container>	
		</>
	)
}
export default ProjectStatisticsTab;