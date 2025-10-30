// import React from 'react';

import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';


import pic11 from './../../../../images/contacts/pic11.jpg';
import pic22 from './../../../../images/contacts/pic22.jpg';
import pic33 from './../../../../images/contacts/pic33.jpg';
import pic222 from './../../../../images/contacts/pic222.jpg';

function DropdownBox(){
	return(
		<Dropdown>
			<Dropdown.Toggle variant="" as="div" className="i-false" >	
				<Link to={"#"} data-toggle="dropdown" aria-expanded="false">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="3.5" cy="11.5" r="2.5" transform="rotate(-90 3.5 11.5)" fill="#717579"/>
						<circle cx="11.5" cy="11.5" r="2.5" transform="rotate(-90 11.5 11.5)" fill="#717579"/>
						<circle cx="19.5" cy="11.5" r="2.5" transform="rotate(-90 19.5 11.5)" fill="#717579"/>
					</svg>
				</Link>
			</Dropdown.Toggle>	
			<Dropdown.Menu  className="dropdown-menu-right"  menuAlign="right">
				<Dropdown.Item >Edit </Dropdown.Item>		
				<Dropdown.Item >Delete </Dropdown.Item>
			</Dropdown.Menu>	
		</Dropdown>
	)
}

function ColumnHeader1(){
	return(
		<>
			<div className="sub-card align-items-center d-flex justify-content-between mb-4">
				<div>
					<h4 className="fs-20 mb-0 font-w600">To-Do List (<span className="totalCount">24</span>)</h4>
				</div>
				<div className="plus-bx">
					<Link to={"#"}><i className="fas fa-plus"></i></Link>
				</div>
			</div>
		</>
	)
}
function ColumnHeader2(){
	return(
		<>
			<div className="sub-card align-items-center d-flex justify-content-between mb-4">
				<div>
					<h4 className="fs-20 mb-0 font-w600">On Progress(<span className="totalCount">2</span>)</h4>
				</div>
				<div className="plus-bx">
					<Link to={"#"}><i className="fas fa-plus"></i></Link>
				</div>
			</div>
		</>		
	)
}
function ColumnHeader3(){
	return(
		<>
			<div className="sub-card align-items-center d-flex justify-content-between mb-4">
				<div>
					<h4 className="fs-20 mb-0 font-w600">Done(<span className="totalCount">3</span>)</h4>
				</div>
				<div className="plus-bx">
					<Link to={"#"}><i className="fas fa-plus"></i></Link>
				</div>
			</div>
		</>		
	)
}
function ColumnHeader4(){
	return(
		<>
			<div className="sub-card align-items-center justify-content-between d-flex mb-4 text-white">
				<div>
					<h4 className="fs-20 mb-0 font-w600">Done(<span className="totalCount">3</span>)</h4>
				</div>
				<div className="plus-bx">
					<Link to={"#"}><i className="fas fa-plus"></i></Link>
				</div>
			</div>
		</>		
	)
}


function SubCard1(){
	return(
		<>
			<div className="card draggable-handle draggable">
				<div className="card-body">
					<div className="d-flex justify-content-between mb-2">
						<span className="sub-title">
							<svg className="me-2" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="5" cy="5" r="5" fill="#FFA7D7"/>
							</svg>
							Deisgner
						</span>
						<DropdownBox />
					</div>
					<p className="font-w600 fs-18"><Link to={"#"} className="text-black">Create wireframe for landing page phase 1</Link></p>
					<div className="progress default-progress my-4">
						<div className="progress-bar bg-design progress-animated" style={{width: "45%", height:"10px"}} role="progressbar">
							<span className="sr-only">45% Complete</span>
						</div>
					</div>
					<div className="row justify-content-between align-items-center kanban-user">
						<ul className="users col-6">
							<li><img src={pic11} alt="" /></li>
							<li><img src={pic22} alt="" /></li>
							<li><img src={pic33} alt="" /></li>
						</ul>
						<div className="col-6 d-flex justify-content-end">
							<span className="fs-14"><i className="far fa-clock me-2"></i>Due in 4 days</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

function SubCard2(){
	return(
		<>
			<div className="card draggable-handle draggable">
				<div className="card-body">
					<div className="d-flex justify-content-between mb-2">
						<span className="text-warning">
							<svg className="me-2" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="5" cy="5" r="5" fill="#FFCF6D"/>
							</svg>
							Important
						</span>
						<DropdownBox />
					</div>
					<p className="font-w600 fs-18"><Link to={"#"} className="text-black">Visual Graphic for Presentation to Client</Link></p>
					<div className="progress default-progress my-4">
						<div className="progress-bar bg-warning progress-animated" style={{width: "45%", height:"10px"}} role="progressbar">
							<span className="sr-only">45% Complete</span>
						</div>
					</div>
					<div className="row justify-content-between align-items-center kanban-user">
						<ul className="users col-6">
							<li><img src={pic11} alt="" /></li>
							<li><img src={pic22} alt="" /></li>
							<li><img src={pic33} alt="" /></li>
							<li><img src={pic222} alt="" /></li>
						</ul>
						<div className="col-6 d-flex justify-content-end">
							<span className="fs-14"><i className="far fa-clock me-2"></i>Due in 4 days</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
function SubCard3(){
	return(
		<>
			<div className="card draggable-handle draggable">
				<div className="card-body">
					<div className="d-flex justify-content-between mb-2">
						<span className="text-success">
							<svg className="me-2" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="5" cy="5" r="5" fill="#09BD3C"/>
							</svg>

							Databse
						</span>
						<DropdownBox />
					</div>
					<p className="font-w600 fs-18"><Link to={"#"} className="text-black">Setup database for create API connection</Link></p>
					<div className="progress default-progress my-4">
						<div className="progress-bar bg-success progress-animated" style={{width: "45%", height:"10px"}} role="progressbar">
							<span className="sr-only">45% Complete</span>
						</div>
					</div>
					<div className="row justify-content-between align-items-center kanban-user">
						<ul className="users col-6">
							<li><img src={pic22} alt="" /></li>
							<li><img src={pic222} alt="" /></li>
						</ul>
						<div className="col-6 d-flex justify-content-end">
							<span className="fs-14"><i className="far fa-clock me-2"></i>Due in 4 days</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
function SubCard4(){
	return(
		<>
			<div className="card draggable-handle draggable">
				<div className="card-body">
					<div className="d-flex justify-content-between mb-2">
						<span className="text-danger">
							<svg className="me-2" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="5" cy="5" r="5" fill="#FC2E53"/>
							</svg>
							BUGS FIXING
						</span>
						<DropdownBox/>
					</div>
					<p className="font-w600 fs-18"><Link to={"#"} className="text-black">Update information in footer section</Link></p>
					<div className="progress default-progress my-4">
						<div className="progress-bar bg-danger progress-animated" style={{width: "45%", height:"10px"}} role="progressbar">
							<span className="sr-only">45% Complete</span>
						</div>
					</div>
					<div className="row justify-content-between align-items-center kanban-user">
						<ul className="users col-6">
							<li><img src={pic11} alt="" /></li>
							<li><img src={pic22} alt="" /></li>
							<li><img src={pic33} alt="" /></li>
						</ul>
						<div className="col-6 d-flex justify-content-end">
							<span className="fs-14"><i className="far fa-clock me-2"></i>Due in 4 days</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export const board = [
			{
				id: 1,	
				maintitle: "To-Do List",
				number:"24",
				cards: [
					{
						id: 10,
						title: "Create wireframe for landing page phase 1",
						changeClass:"success",
						svgcolor:"#09BD3C"
					},
					{
						id: 11,
						title: "Visual Graphic for Presentation to Client",
						changeClass:"design",
						svgcolor:"#FFA7D7"
					},
					{
						id: 12,
						title: "Setup database for create API connection",
						changeClass:"warning",
						svgcolor:"#FFCF6D"
					
					},
					{
						id: 13,
						title: "Update information in footer section",
						changeClass:"danger",
						svgcolor:"#FC2E53"
					
					},
					
				]
			},
			{
				id: 2,
				maintitle: "On Progress",
				number:"2",
				cards: [
					{
						id: 14,
						title: "Update information in footer section",
						changeClass:"info",
						svgcolor:"#D653C1"
					},
					{
						id: 15,
						title: "Setup database for create API connection",
						changeClass:"danger",
						svgcolor:"#FC2E53"
					},
				]
			},
			{
				id: 3,
				maintitle:"Done",
				number:"3",
				cards: [
					{
						id: 16,
						title: "Visual Graphic for Presentation to Client",
						changeClass:"danger",
						svgcolor:"#FC2E53"
					},
					{
						id: 17,
						title: "Update information in footer section",
						changeClass:"success",
						svgcolor:"#09BD3C"
						
					},
					{
						id: 18,
						title: "Create wireframe for landing page phase 1",
						changeClass:"design",
						svgcolor:"#FFA7D7"
						
					},
				]
			},
			{
				id: 4,
				maintitle:"Done",
				number:"4",
				cards: [
					
					{
						id: 19,
						title: "Create wireframe for landing page phase 1",
						changeClass:"info",
						svgcolor:"#D653C1"
					},
					
					{
						id: 20,
						title: "Create wireframe for landing page phase 1",
						changeClass:"warning",
						svgcolor:"#FFCF6D"
					},
				]
			},
];

// const KanbanData = () =>{
	// const data = {
	// 	medium: generateQuoteMap(100),
	// 	large: generateQuoteMap(500)
	// };
	// return(
		// <>
			{/* <Board initial={data.medium} withScrollableColumns /> */}
			{/* <Board initial={data.medium} withScrollableColumns /> */}
		// </>
	// )
// } 

// export { ColumnHeader1, ColumnHeader2, ColumnHeader3, ColumnHeader4,
// 	SubCard1, SubCard2, SubCard3, SubCard4 };
// export default  KanbanData;