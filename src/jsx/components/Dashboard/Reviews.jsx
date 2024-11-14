import React, { useState } from "react";
import { Dropdown, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
// Table
import AllReviewTable from "../Ventic/Reviews/AllReviewTable";
import PublishedTable from "../Ventic/Reviews/PublishedTable";
import DeletedTable from "../Ventic/Reviews/DeletedTable";

const Reviews = () => {
 const [timesession, setTimesession] = useState('May 29th - June 29th, 2024');
  return (
		<>
			<Tab.Container defaultActiveKey="all">
				<div className="page-titles">
					<ol className="breadcrumb">
						<li className="breadcrumb-item "><Link to={"#"}>Dashboard</Link></li>
						<li className="breadcrumb-item active"><Link to={"#"}>Reviews</Link></li>
					</ol>
				</div>
				<div className="form-head mb-4 d-flex flex-wrap align-items-center">
					<div className="me-auto">
						<h2 className="font-w600 mb-0">Reviews</h2>
						<p className="text-light">Lorem ipsum  dolor sit amet </p>
					</div>	
					<div className="input-group search-area2 d-xl-inline-flex mb-2 me-lg-4 me-md-2">
						<button className="input-group-text"><i className="flaticon-381-search-2 text-primary" /></button>
						<input type="text" className="form-control" placeholder="Search here..." />
					</div>
					<Dropdown className="dropdown custom-dropdown mb-2 period-btn" >
						<Dropdown.Toggle  as="div" className="btn btn-sm  d-flex align-items-center i-false " >
							<svg className="primary-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M22.167 5.83362H21.0003V3.50028C21.0003 3.19087 20.8774 2.89412 20.6586 2.67533C20.4398 2.45653 20.143 2.33362 19.8336 2.33362C19.5242 2.33362 19.2275 2.45653 19.0087 2.67533C18.7899 2.89412 18.667 3.19087 18.667 3.50028V5.83362H9.33362V3.50028C9.33362 3.19087 9.2107 2.89412 8.99191 2.67533C8.77312 2.45653 8.47637 2.33362 8.16695 2.33362C7.85753 2.33362 7.56079 2.45653 7.34199 2.67533C7.1232 2.89412 7.00028 3.19087 7.00028 3.50028V5.83362H5.83362C4.90536 5.83362 4.01512 6.20237 3.35874 6.85874C2.70237 7.51512 2.33362 8.40536 2.33362 9.33362V10.5003H25.667V9.33362C25.667 8.40536 25.2982 7.51512 24.6418 6.85874C23.9854 6.20237 23.0952 5.83362 22.167 5.83362Z" fill="#0E8A74"/>
								<path d="M2.33362 22.1669C2.33362 23.0952 2.70237 23.9854 3.35874 24.6418C4.01512 25.2982 4.90536 25.6669 5.83362 25.6669H22.167C23.0952 25.6669 23.9854 25.2982 24.6418 24.6418C25.2982 23.9854 25.667 23.0952 25.667 22.1669V12.8336H2.33362V22.1669Z" fill="#0E8A74"/>
							</svg>
							<div className="text-start ms-3 flex-1">
								<span className="d-block text-black">Change Periode</span>
								<small className="d-block text-light">{timesession}</small>
							</div>
							<i className="fa fa-caret-down text-light scale5 ms-3" />
						</Dropdown.Toggle>
						<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
							<Dropdown.Item onClick={()=>setTimesession("May 29th - June 29th, 2024")}>
								May 29th - June 29th, 2024
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>setTimesession("July 27th - August 27th, 2024")}>
								July 27th - August 27th, 2024
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="row">
					<div className="col-xl-12">
						<div className="card">
							<div className="card-body px-4 py-3 py-md-2">
								<div className="row align-items-center">
									<div className="col-sm-12 col-md-7">
										<Nav as="ul" className="nav nav-pills review-tab" role="tablist">
											<Nav.Item as="li">
												<Nav.Link eventKey="all">
													All Review
												</Nav.Link>
											</Nav.Item>
											<Nav.Item as="li">
												<Nav.Link eventKey="publishe">
													Published
												</Nav.Link>
											</Nav.Item>
											<Nav.Item as="li">
												<Nav.Link eventKey="delete">
													Deleted
												</Nav.Link>
											</Nav.Item>
										</Nav>
									</div>
									<div className="col-sm-12 col-md-5 text-md-end mt-md-0 mt-4">
										<Link to={"#"} className="btn btn-secondary me-1 px-4">Publish</Link>
										<Link to={"#"} className="btn btn-danger px-4">Delete</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-12">
						<Tab.Content>
							<Tab.Pane eventKey="all">
								<AllReviewTable />
							</Tab.Pane>
							<Tab.Pane eventKey="publishe">
								<PublishedTable />
							</Tab.Pane>
							<Tab.Pane eventKey="delete">
								<DeletedTable />
							</Tab.Pane>
						</Tab.Content>
					</div>
				</div>
			</Tab.Container>
		</>
	);
};

export default Reviews;
