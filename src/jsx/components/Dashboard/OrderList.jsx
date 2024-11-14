import React, { useState, useRef, useEffect } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const tableData = [
	{ location:'Sydney, Australia', name:'Envato Interantional Meetup 2020', customer:'Bella Simatupang', ticket:'2', revenue:'65.22'},
	{ location:'Jakarta, Indonesia', name:'UI Design Workshop With Best Author Envato 2020', customer:'David Bekam', ticket:'3', revenue:'124.65'},
	{ location:'Bangkok, Thailand', name:'Envato Interantional Meetup 2020', customer:'Andrew Stevano', ticket:'4', revenue:'150.25'},
	{ location:'Medan, Indonesia', name:'UI Design Workshop With Best Author Envato 2020', customer:'Bella Simatupang', ticket:'2', revenue:'78.25'},
	{ location:'London, US', name:'Envato Interantional Meetup 2020', customer:'Cive Slauw', ticket:'4', revenue:'185.50'},
	{ location:'Penang, Malaysia', name:'UI Design Workshop With Best Author Envato 2020', customer:'Frank Azire', ticket:'3', revenue:'170.50'},
	{ location:'London, US', name:'Envato Interantional Meetup 2020', customer:'Eddy Cusuma', ticket:'4', revenue:'180.75'},
	{ location:'Medan, Indonesia', name:'UI Design Workshop With Best Author Envato 2020', customer:'Bella Simatupang', ticket:'1', revenue:'135.30'},
	{ location:'Bangkok, Thailand', name:'Envato Interantional Meetup 2020', customer:'Cive Slauw', ticket:'5', revenue:'190.55'},
	{ location:'Medan, Indonesia', name:'UI Design Workshop With Best Author Envato 2020', customer:'David Bekam', ticket:'3', revenue:'155.69'},
	{ location:'Jakarta, Indonesia', name:'Envato Interantional Meetup 2020', customer:'Andrew Stevano', ticket:'2', revenue:'178.45'},
	{ location:'Sydney, Australia', name:'UI Design Workshop With Best Author Envato 2020', customer:'David Bekam', ticket:'1', revenue:'187.36'},
	{ location:'London, US', name:'Envato Interantional Meetup 2020', customer:'Frank Azire', ticket:'4', revenue:'139.36'},
	{ location:'Jakarta, Indonesia', name:'UI Design Workshop With Best Author Envato 2020', customer:'Cive Slauw', ticket:'6', revenue:'174.26'},
];

const OrderList = () => {
	const [orderModal, setOrderModal ] = useState(false);
	const [timesession, setTimesession] = useState('August 28th - October 28th, 2023');	
	const [session, setSession] = useState('This Week')
	const [data, setData] = useState(
		document.querySelectorAll("#example2_wrapper tbody tr")
	);
	const sort = 10;
	const activePag = useRef(0);
	const [test, settest] = useState(0);

	// Active data
	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};
   // use effect
   useEffect(() => {
      setData(document.querySelectorAll("#example2_wrapper tbody tr"));
      //chackboxFun();
	}, [test]);

  
   // Active pagginarion
   activePag.current === 0 && chageData(0, sort);
   // paggination
   let paggination = Array(Math.ceil(data.length / sort))
      .fill()
      .map((_, i) => i + 1);

   
	const onClick = (i) => {
		activePag.current = i;
		chageData(activePag.current * sort, (activePag.current + 1) * sort);
		settest(i);
	};

   
	const chackbox = document.querySelectorAll(".sorting_1 input");
	const motherChackBox = document.querySelector(".sorting_asc input");   
	const chackboxFun = (type) => {
      for (let i = 0; i < chackbox.length; i++) {
         const element = chackbox[i];
         if (type === "all") {
            if (motherChackBox.checked) {
               element.checked = true;
            } else {
               element.checked = false;
            }
         } else {
            if (!element.checked) {
               motherChackBox.checked = false;
               break;
            } else {
               motherChackBox.checked = true;
            }
         }
      }
   };
	return (
		<>
			<div className="row page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item "><Link to={"#"}>Dashboard</Link></li>
					<li className="breadcrumb-item active"><Link to={"#"}>Order List</Link></li>
				</ol>
			</div>
			<div className="form-head mb-4 d-flex flex-wrap align-items-center">
				<div className="me-auto">
					<h2 className="font-w600 mb-0">Order List</h2>
					<p>Lorem ipsum  dolor sit amet </p>
				</div>	
				<div className="input-group search-area2 d-xl-inline-flex mb-2 me-4">
					<button className="input-group-text"><i className="flaticon-381-search-2 text-primary"></i></button>
					<input type="text" className="form-control" placeholder="Search here..." />
				</div>
				<Dropdown className="dropdown custom-dropdown mb-2 period-btn" >
					<Dropdown.Toggle  as="div" className="btn btn-sm  d-flex align-items-center i-false c-pointer" >
						<svg className="primary-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M22.167 5.83362H21.0003V3.50028C21.0003 3.19087 20.8774 2.89412 20.6586 2.67533C20.4398 2.45653 20.143 2.33362 19.8336 2.33362C19.5242 2.33362 19.2275 2.45653 19.0087 2.67533C18.7899 2.89412 18.667 3.19087 18.667 3.50028V5.83362H9.33362V3.50028C9.33362 3.19087 9.2107 2.89412 8.99191 2.67533C8.77312 2.45653 8.47637 2.33362 8.16695 2.33362C7.85753 2.33362 7.56079 2.45653 7.34199 2.67533C7.1232 2.89412 7.00028 3.19087 7.00028 3.50028V5.83362H5.83362C4.90536 5.83362 4.01512 6.20237 3.35874 6.85874C2.70237 7.51512 2.33362 8.40536 2.33362 9.33362V10.5003H25.667V9.33362C25.667 8.40536 25.2982 7.51512 24.6418 6.85874C23.9854 6.20237 23.0952 5.83362 22.167 5.83362Z" fill="#0E8A74"/>
							<path d="M2.33362 22.1669C2.33362 23.0952 2.70237 23.9854 3.35874 24.6418C4.01512 25.2982 4.90536 25.6669 5.83362 25.6669H22.167C23.0952 25.6669 23.9854 25.2982 24.6418 24.6418C25.2982 23.9854 25.667 23.0952 25.667 22.1669V12.8336H2.33362V22.1669Z" fill="#0E8A74"/>
						</svg>
						<div className="text-left ms-3">
							<span className="d-block text-black text-start">Change Periode</span>
							<small className="d-block text-muted">{timesession}</small>
						</div>
						<i className="fa fa-caret-down text-light scale5 ms-3"></i>
					</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
						<Dropdown.Item onClick={()=>setTimesession("October 29th - November 29th, 2023")}>
							October 29th - November 29th, 2023
						</Dropdown.Item>
						<Dropdown.Item onClick={()=>setTimesession("July 27th - September 27th, 2023")}>
							July 27th - September 27th, 2023
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
			<div className="row mb-4 align-items-center">
				<div className="col-xl-9">
					<div className="card m-0 ">
						<div className="card-body px-4 py-3 py-lg-2">
							<div className="row align-items-center">
								<div className="col-xl-3 col-xxl-12 col-lg-12 my-2">
									<p className="mb-0 fs-14">Lorem Ipsum is simply dummy text of the printing and</p>
								</div>
								<div className="col-xl-7 col-xxl-12 col-lg-12">
									<div className="row align-items-center">
										<div className="col-xl-4 col-md-4 col-sm-4 my-2">
											<div className="media align-items-center style-2">
												<span className="me-3">
													<svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
														<rect width="3.54545" height="26" rx="1.77273" transform="matrix(-1 0 0 1 24.8181 0)" fill="#FB3E7A"/>
														<rect width="3.54545" height="18.9091" rx="1.77273" transform="matrix(-1 0 0 1 17.7272 7.09088)" fill="#FB3E7A"/>
														<rect width="3.54545" height="8.27273" rx="1.77273" transform="matrix(-1 0 0 1 10.6362 17.7273)" fill="#FB3E7A"/>
														<rect width="4" height="16" rx="2" transform="matrix(-1 0 0 1 4 10)" fill="#FB3E7A"/>
													</svg>
												</span>
												<div className="media-body ml-1">
													<p className="mb-0 fs-12">Income</p>
													<h4 className="mb-0 font-w600  fs-22">$126,000</h4>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-md-4 col-sm-4 my-2">
											<div className="media align-items-center style-2">
												<span className="me-3">
													<svg width="30" height="19" viewBox="0 0 30 19" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path fillRule="evenodd" clipRule="evenodd" d="M29.3124 0.990819C30.1459 1.71561 30.234 2.97887 29.5092 3.81239L20.7578 13.8765C19.359 15.4851 16.9444 15.7141 15.2681 14.397L11.1176 11.1359L3.87074 17.9564C3.06639 18.7135 1.80064 18.6751 1.04361 17.8708C0.286573 17.0664 0.324929 15.8007 1.12928 15.0436L8.3761 8.22309C9.817 6.86695 12.0329 6.76812 13.5888 7.99062L17.7394 11.2518L26.4908 1.18767C27.2156 0.354158 28.4788 0.266024 29.3124 0.990819Z" fill="#FB3E7A"/>
													</svg>
												</span>
												<div className="media-body ml-1">
													<p className="mb-0 fs-12">Customer</p>
													<h4 className="mb-0 font-w600  fs-22">765 Person</h4>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-md-4 col-sm-4 my-2">
											<div className="media align-items-center style-2">
												<span className="me-3">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path fillRule="evenodd" clipRule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#C8C8C8"/>
														<path fillRule="evenodd" clipRule="evenodd" d="M15.9999 0.686289C14.7205 0.233951 13.3682 0 11.9999 0V3.93696C13.4442 3.93696 14.8619 4.32489 16.105 5.06021C17.3481 5.79553 18.3708 6.85124 19.0664 8.117C19.7619 9.38277 20.1047 10.8121 20.0589 12.2557C20.0131 13.6992 19.5804 15.104 18.806 16.3231C18.0317 17.5422 16.9441 18.531 15.6569 19.186C14.3697 19.8411 12.9302 20.1384 11.4888 20.0468C10.0475 19.9553 8.65715 19.4783 7.46319 18.6656C6.26922 17.853 5.31544 16.7346 4.70154 15.4273L1.13794 17.1007C1.71955 18.3393 2.50612 19.4639 3.45939 20.4297C4.00364 20.9811 4.60223 21.4807 5.24803 21.9203C7.02498 23.1297 9.09416 23.8396 11.2393 23.9759C13.3845 24.1121 15.5268 23.6697 17.4425 22.6948C19.3582 21.7199 20.9768 20.2483 22.1293 18.4339C23.2818 16.6195 23.9257 14.5289 23.9939 12.3805C24.062 10.2321 23.5519 8.10484 22.5167 6.22104C21.4816 4.33724 19.9595 2.76605 18.1094 1.6717C17.4371 1.27398 16.7304 0.944541 15.9999 0.686289Z" fill="#FB3E7A"/>
													</svg>
												</span>
												<div className="media-body ml-1">
													<p className="mb-0 fs-12">Than last week</p>
													<h4 className="mb-0 font-w600 fs-22">72%{" "}
														<svg className="ml-2" width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M0 6L6 2.62268e-07L12 6" fill="#13B497"></path>
														</svg>
													</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-2 col-xxl-12 my-2">
									<Dropdown className="dropdown d-inline-block">
										<Dropdown.Toggle as="div" className="dropdown-toggle mb-0 fs-18  c-pointer">
											<span className="font-w400 text-primary">{session}</span>
										</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item onClick={()=>setSession('Newest')}>Newest</Dropdown.Item>
											<Dropdown.Item onClick={()=>setSession('Old')}>Old</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</div>							
						</div>
					</div>
				</div>
				<div className="col-xl-3 mt-3 mt-xl-0 Generate">
					<Link to={"#"} className="btn btn-secondary d-block"
						onClick={()=>setOrderModal(true)}
					>
						<i className="fa fa-file-text-o scale5 me-3" />Generate Order Report
					</Link>
				</div>	
			</div>
			<div id="All" className="tab-pane">
				<div className="table-responsive">
					<div id="example2_wrapper" className="dataTables_wrapper no-footer">
						<table
							id="example2"
							className="table card-table display dataTablesCard dataTable no-footer"							
						>
							<thead>
								<tr role="row">
									<th className="sorting_asc" >
										<div className="form-check checkbox-secondary">
											<input type="checkbox" onClick={() => chackboxFun("all")} className="form-check-input" id="checkAll" required=""/>
											<label className="form-check-label" htmlFor="checkAll"></label>
										</div>
										
									</th>
									<th className="sorting_asc">Order ID</th>
									<th className="sorting">Date</th>
									<th className="sorting">Event Name</th>
									<th className="sorting">Customer{" "}</th>
									<th className="sorting">Location</th>
									<th className="sorting">Sold Ticket</th>
									<th className="sorting">Available</th>
									<th className="sorting">Refund</th>
									<th className="sorting">Total Revenue</th>
								</tr>
							</thead>
							<tbody>
								{tableData.map((item,ind)=>(
									<tr role="row" className="odd" key={ind}>
										<td className="sorting_1">
											<div className="form-check checkbox-secondary">
												<input type="checkbox" onClick={() => chackboxFun()} className="form-check-input"
													id="customCheckBox2" required=""
												/>
												<label className="form-check-label" htmlFor="customCheckBox2"></label>
											</div>
										</td>
										<td className="sorting_1">#{`00124${ ind + 51}`}</td>
										<td> 04/08/2023 <br /> 12:34 AM</td>
										<td >
										<span className="text-nowrap">
											Charity Fun Games at <br /> Lapangan Merdeka
										</span>
										</td>
										<td>{item.customer}</td>
										<td>{item.location}</td>
										<td>{item.ticket} Pcs</td>
										<td>567k left</td>
										<td>
											{item.ticket === "4" ?
												<strong>NO</strong>
												:
												<strong>YES</strong>
											}
										</td>
										<td><Link to="#" className="btn btn-secondary btn-sm light">${item.revenue}</Link></td>
									</tr>
								))}								
							</tbody>
						</table>
						<div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
							
							<div></div>
							<div
								className="dataTables_paginate paging_simple_numbers"
								id="example2_paginate"
							>
								<Link
									className="paginate_button previous disabled"
									to="/order-list"
									onClick={() =>
									   activePag.current > 0 &&
									   onClick(activePag.current - 1)
									}
								 >
									<i className="fa fa-angle-double-left" />
								</Link>
								<span>
									{paggination.map((number, i) => (
									   <Link
										  key={i}
										  to="/order-list"
										  className={`paginate_button  ${
											 activePag.current === i ? "current" : ""
										  } `}
										  onClick={() => onClick(i)}
									   >
										  {number}
									   </Link>
									))}
								</span>

								<Link
									className="paginate_button next"
									to="/order-list"
									onClick={() =>
									   activePag.current + 1 < paggination.length &&
									   onClick(activePag.current + 1)
									}
								>
									<i className="fa fa-angle-double-right" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<Modal className="modal fade" centered onHide={setOrderModal} show={orderModal}>						
				<div className="modal-header">
					<h1 className="modal-title fs-5" >Order Report</h1>
					<button type="button" className="btn-close" onClick={()=>setOrderModal(false)}></button>
				</div>
				<div className="modal-body">
					<form>
						<div className="row">
							<div className="col-xl-6">
								<div className="mb-3">
									<label htmlFor="exampleFormControlInput1" className="form-label">Order ID</label>
									<input type="number" className="form-control" id="exampleFormControlInput1" placeholder="#0012451" />
								</div>
							</div>
							<div className="col-xl-6">
								<div className="mb-3">
									<label htmlFor="exampleFormControlInput2" className="form-label">Customer Name</label>
									<input type="text" className="form-control" id="exampleFormControlInput2" placeholder="Frank Azire" />
								</div>
							</div>
							<div className="col-xl-12">
								<div className="mb-3">
									<label htmlFor="exampleFormControlInput3" className="form-label">Event NAME</label>
									<input type="email" className="form-control"  placeholder="UI Design Workshop With Best Author Envato 2020" />
								</div>
							</div>
						</div>
					</form>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-danger light" onClick={()=>setOrderModal(false)} >Close</button>
					<button type="button" className="btn btn-primary">Save changes</button>
				</div>
				
			</Modal>
		</>  
	);
};

export default OrderList;