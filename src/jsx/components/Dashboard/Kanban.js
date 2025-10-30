import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import Draggable from 'react-draggable';
//import Board, { moveCard } from "@asseinfo/react-kanban";
import { board	} from './Kanban/KanbanBlog';

//images
import pic1 from './../../../images/profile/small/pic1.jpg';
import pic2 from './../../../images/profile/small/pic2.jpg';
import pic3 from './../../../images/profile/small/pic3.jpg';
import pic4 from './../../../images/profile/small/pic4.jpg';
import pic5 from './../../../images/profile/small/pic5.jpg';


import pic11 from './../../../images/contacts/pic11.jpg';
import pic22 from './../../../images/contacts/pic22.jpg';
import pic33 from './../../../images/contacts/pic33.jpg';
import pic222 from './../../../images/contacts/pic222.jpg';

// function ControlledBoard() {
// 	// You need to control the state yourself.
// 	const [controlledBoard, setBoard] = useState(board);

// 	function handleCardMove(_card, source, destination) {
// 		const updatedBoard = moveCard(controlledBoard, source, destination);
// 		setBoard(updatedBoard);
// 	}
// 	return (
// 		<Board onCardDragEnd={handleCardMove} disableColumnDrag>
// 			{controlledBoard}
// 		</Board>
// 	);
// }
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


const Kanban = () =>{
	return(
		<>
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-body">
							<div className="d-flex align-items-center justify-content-between flex-wrap">
								<div className="mb-3">
									<h4 className="fs-24 font-w700">Fillow Company Profile Website Phase 1</h4>
									<span>Created by <strong>Hajime Mahmude</strong> n on June 31, 2020</span>
									<div className="d-flex align-items-center mt-4 flex-wrap">
										<ul className="kanbanimg me-3 mb-3">
											<li><img src={pic1} alt="" /></li>
											<li><img src={pic2} alt="" /></li>
											<li><img src={pic3} alt="" /></li>
											<li><img src={pic4} alt="" /></li>
											<li><img src={pic5} alt="" /></li>
											<li><span>5+</span></li>
										</ul>
										<div className="ms-4 invite mb-3">
											<Link to={"#"} className="btn btn-primary light btn-rounded btn-md me-2 mb-2"><i className="fas fa-user-plus me-3 scale5"></i>Invite People</Link>
											<Link to={"#"} className="btn btn-outline-light btn-rounded btn-md me-2 mb-2">Edit</Link>
											<Link to={"#"} className="btn btn-outline-light btn-rounded btn-md me-2 mb-2">Private</Link>
											<Link to={"#"} className="btn btn-outline-light btn-rounded btn-md mb-2"><i className="far fa-comment-alt scale5 text-primary me-3"></i>45 Comments</Link>
										</div>
									</div>	
								</div>
								<div className="mb-3">
									<div className="d-flex align-items-center mb-4 pb-3 justify-content-end flex-wrap">
										<div className="me-3">
											<h4 className="fs-18 font-w600">Fillow Studios</h4>
											<span>Software House</span>
										</div>
										<div className="facebook-icon me-3">
											<Link to={"#"}><i className="fab fa-facebook-f"></i></Link>
										</div>
										<div>
											<Dropdown className="dropdown">
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
									<div className="d-flex  justify-content-end align-items-center">
										<span className="fs-16 font-w600 me-3">Total Progress 60%</span>
										<div className="progress default-progress flex-1">
											<div className="progress-bar bg-gradient1 progress-animated" style={{width: "45%", height:"10px"}} role="progressbar">
												<span className="sr-only">45% Complete</span>
											</div>
										</div>
									</div>
								</div>	
							</div>
						</div>
					</div>
						
				</div>				
			</div>	
			<div class="row kanban-bx">							
				{board.map((item, ind)=>(
					<div className="col" key={ind}>
						<div class="kanbanPreview-bx">
							<div class="draggable-zone dropzoneContainer">
								<div class="sub-card align-items-center d-flex justify-content-between mb-4">
									<div>
										<h4 class="fs-20 mb-0 font-w600">{item.maintitle} (<span class="totalCount">{item.number}</span>)</h4>
									</div>
									<div class="plus-bx">
										<Link to={"#"}><i class="fas fa-plus"></i></Link>
									</div>
								</div>

								{item.cards.map((data, index)=>(
									<Draggable key={index}>
										<div className="card draggable-handle draggable">
											<div className="card-body">
												<div className="d-flex justify-content-between mb-2">
													<span className={`text-${data.changeClass}`}>
														<svg className="me-2" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
															<circle cx="5" cy="5" r="5" fill={data.svgcolor}/>
														</svg>

														Databse
													</span>
													<DropdownBox />
												</div>
												<p className="font-w600 fs-18"><Link to={"#"} className="text-black">{data.title}</Link></p>
												<div className="progress default-progress my-4">
													<div 															
														className={`progress-bar bg-design progress-animated bg-${data.changeClass}`}
														style={{width: "45%", height:"10px"}} role="progressbar"
													>
														<span className="sr-only">45% Complete</span>
													</div>
												</div>
												<div className="row justify-content-between align-items-center kanban-user">
													{index ===0 ?
														<ul className="users col-6">
															<li><img src={pic22} alt="" /></li>
															<li><img src={pic222} alt="" /></li>
														</ul>
													:
													index ===1 ?
														<ul className="users col-6">
															<li><img src={pic22} alt="" /></li>
															<li><img src={pic11} alt="" /></li>
															<li><img src={pic33} alt="" /></li>
														</ul>
													:
													index ===2 ?
														<ul className="users col-6">
															<li><img src={pic22} alt="" /></li>
															<li><img src={pic11} alt="" /></li>
															<li><img src={pic33} alt="" /></li>
															<li><img src={pic222} alt="" /></li>
														</ul>
														:
														<ul className="users col-6">
															<li><img src={pic222} alt="" /></li>
														</ul>
													}
													<div className="col-6 d-flex justify-content-end">
														<span className="fs-14"><i className="far fa-clock me-2"></i>Due in 4 days</span>
													</div>
												</div>
											</div>
										</div>
									</Draggable>
								))}
							</div>
						</div>	
					</div>	
				))}								
			</div>
			{/* <div className="kanban-bx">
				<div className="kanbanPreview-bx">
					<div className="draggable-zone dropzoneContainer">
						<ControlledBoard />
					</div>
				</div>
			</div> */}
		</>
	)
}
export default Kanban;