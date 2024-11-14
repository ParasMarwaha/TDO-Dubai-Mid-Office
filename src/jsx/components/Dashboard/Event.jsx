import React, {useState} from 'react';
import { Link } from "react-router-dom";
import { Dropdown} from "react-bootstrap";
import pic6 from './../../../assets/images/card/pic6.jpg';

import CanvasRevenue from '../Ventic/Event/CanvasRevenue';
import DoughnutChart from '../Ventic/Event/DoughnutChart';
import WidgetChartApex from '../Ventic/Event/WidgetChartApex';
import RecentSaleTable from '../Ventic/Event/RecentSaleTable';
import EventLineApex from '../Ventic/Event/EventLineApex';

import EventGallery from '../Ventic/Event/EventGallery';

const Event = () => {
	const [timesession, setTimesession] = useState('July 27th - Auguts 27th, 2023');
	const [control, setControl] = useState('Monthly');
	const [control2, setControl2] = useState('Monthly');
	const [control3, setControl3] = useState('This Week');
	
	return(
		<>
			<div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item "><Link to={"#"}>Dashboard</Link></li>
					<li className="breadcrumb-item active"><Link to={"#"}>Event </Link></li>
				</ol>
			</div>
			<div className="form-head mb-4 d-flex flex-wrap align-items-center">
				<div className="me-auto">
					<h2 className="font-w600 mb-0">Event Details</h2>
					<p className="text-light">Lorem ipsum  dolor sit amet </p>
				</div>	
				<div className="input-group search-area2 d-xl-inline-flex mb-2 me-lg-4 me-md-2">
					<button className="input-group-text"><i className="flaticon-381-search-2 text-primary" /></button>
					<input type="text" className="form-control" placeholder="Search here..." />
				</div>
				<Dropdown className="dropdown custom-dropdown mb-2 period-btn" >
					<Dropdown.Toggle  as="div" className="btn btn-sm  d-flex align-items-center i-false c-pointer" >
						<svg className="primary-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M22.167 5.83362H21.0003V3.50028C21.0003 3.19087 20.8774 2.89412 20.6586 2.67533C20.4398 2.45653 20.143 2.33362 19.8336 2.33362C19.5242 2.33362 19.2275 2.45653 19.0087 2.67533C18.7899 2.89412 18.667 3.19087 18.667 3.50028V5.83362H9.33362V3.50028C9.33362 3.19087 9.2107 2.89412 8.99191 2.67533C8.77312 2.45653 8.47637 2.33362 8.16695 2.33362C7.85753 2.33362 7.56079 2.45653 7.34199 2.67533C7.1232 2.89412 7.00028 3.19087 7.00028 3.50028V5.83362H5.83362C4.90536 5.83362 4.01512 6.20237 3.35874 6.85874C2.70237 7.51512 2.33362 8.40536 2.33362 9.33362V10.5003H25.667V9.33362C25.667 8.40536 25.2982 7.51512 24.6418 6.85874C23.9854 6.20237 23.0952 5.83362 22.167 5.83362Z" fill="#0E8A74"/>
							<path d="M2.33362 22.1669C2.33362 23.0952 2.70237 23.9854 3.35874 24.6418C4.01512 25.2982 4.90536 25.6669 5.83362 25.6669H22.167C23.0952 25.6669 23.9854 25.2982 24.6418 24.6418C25.2982 23.9854 25.667 23.0952 25.667 22.1669V12.8336H2.33362V22.1669Z" fill="#0E8A74"/>
						</svg>
						<div className="text-start ms-3 flex-1">
							<span className="d-block text-black">Change Periode</span>
							<small className="d-block text-muted">{timesession}</small>
						</div>
						<i className="fa fa-caret-down text-light scale5 ms-3" />
					</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
						<Dropdown.Item onClick={()=>setTimesession("October 29th - November 29th, 2023")}>
							October 29th - November 29th, 2023
						</Dropdown.Item>
						<Dropdown.Item onClick={()=>setTimesession("July 27th - Auguts 27th, 2023")}>
							July 27th - Auguts 27th, 2023
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
			<div className="row">
				<div className="col-xl-9 col-xxl-8">
					<div className="row">
						<div className="col-xl-12">
							<div className="card">
								<div className="card-body">
									<div className="event-img">
										<img src={pic6} className="img-fluid"  alt="" />
										<div className="event-content">
											<h4 className="fs-28 font-w500  mt-3">Envato International Online Meetup 2023</h4>
											<Link to={"#"} className="btn btn-secondary text-white">
												<svg className="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M0.648712 9.33093V14.3327C0.648712 15.2524 1.39698 16 2.31597 16H14.3203C15.24 16 15.9875 15.2524 15.9875 14.3327V9.33093H0.648712Z" fill="white"/>
													<path d="M7.89532 1.52481L5.39974 2.11702L7.49049 5.19347L10.1935 4.5786L7.89532 1.52481Z" fill="white"/>
													<path d="M4.70618 2.28177L2.01652 2.91931L4.08526 5.9671L6.79224 5.35153L4.70618 2.28177Z" fill="white"/>
													<path d="M15.9769 2.90997L15.4093 0.757192C15.2786 0.23366 14.7424 -0.0957707 14.2136 0.0249289L11.9728 0.55712L14.0989 3.69159L15.7281 3.3208C15.8168 3.30079 15.8928 3.24543 15.9395 3.16809C15.9862 3.09075 15.9996 2.998 15.9769 2.90997Z" fill="white"/>
													<path d="M11.2785 0.721863L8.60357 1.35675L10.9057 4.41719L13.4006 3.84964L11.2785 0.721863Z" fill="white"/>
													<path d="M4.00924 5.99707L2.9422 8.66404H5.55849L6.62553 5.99707H4.00924Z" fill="white"/>
													<path d="M7.34378 5.99707L6.27674 8.66404H8.89299L9.96006 5.99707H7.34378Z" fill="white"/>
													<path d="M15.6541 5.99707H14.0129L12.9458 8.66469H15.9876V6.3305C15.9875 6.14578 15.8388 5.99707 15.6541 5.99707Z" fill="white"/>
													<path d="M10.6783 5.99707L9.61125 8.66404H12.2269L13.2946 5.99707H10.6783Z" fill="white"/>
													<path d="M1.32296 3.08472L0.779418 3.21342C0.514667 3.27344 0.290587 3.43416 0.148536 3.66493C0.00648451 3.89635 -0.0355306 4.16845 0.0304931 4.43186L0.648715 6.8754V8.66404H2.22394L3.22495 6.16248L3.38767 6.12581L1.32296 3.08472Z" fill="white"/>
												</svg>{" "}
												Video Conference Meeting
											</Link> 
											<p className="fs-16  font-w400 mt-3  mb-4">
												Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
												Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
											</p>
										</div>
									</div>
									<div className="row">
										<div className="col-lg-3 col-sm-6 col-xxl-6 mb-3">
											<div className="media event-card p-3 rounded align-items-center">	
												<svg className="me-4 dolor" width="32" height="25" viewBox="0 0 14 25" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M6.07438 25H7.95454V22.6464C11.8595 22.302 14 19.6039 14 16.8197C14 12.7727 10.8471 11.9977 7.95454 11.3088V5.10907C9.34297 5.4535 10.1529 6.5155 10.2686 7.66361H13.7975C13.5372 4.42021 11.281 2.61194 7.95454 2.32492V0H6.07438V2.35362C2.4876 2.66935 0 4.87945 0 8.09415C0 12.1412 3.18182 12.9449 6.07438 13.6625V19.977C4.45455 19.69 3.64463 18.628 3.52893 17.1929H0C0 20.4363 2.54545 22.3594 6.07438 22.6751V25ZM10.6736 16.992C10.6736 18.4845 9.69008 19.69 7.95454 19.977V14.1504C9.51653 14.6383 10.6736 15.3559 10.6736 16.992ZM3.35537 7.92193C3.35537 6.17107 4.48347 5.22388 6.07438 5.02296V10.8209C4.5124 10.333 3.35537 9.58668 3.35537 7.92193Z" fill="#194039"/>
												</svg>
												<div className="media-body event-size">
													<span className="fs-14 d-block mb-1 text-primary">Ticket Price</span>
													<span className="fs-18 font-w500 event-size-1">$124,00</span>
												</div>
											</div>
										</div>
										<div className="col-lg-4 col-sm-6 col-xxl-6 mb-3">
											<div className="media event-card p-3 rounded align-items-center">	
												<svg className="me-4 calendar-icon" width="32" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<g clipPath="url(#clip0)">
													<path d="M21 3H20C20 2.20435 19.6839 1.44129 19.1213 0.87868C18.5587 0.31607 17.7956 0 17 0C16.2044 0 15.4413 0.31607 14.8787 0.87868C14.3161 1.44129 14 2.20435 14 3H10C10 2.20435 9.68393 1.44129 9.12132 0.87868C8.55871 0.316071 7.79565 4.47035e-08 7 4.47035e-08C6.20435 4.47035e-08 5.44129 0.316071 4.87868 0.87868C4.31607 1.44129 4 2.20435 4 3H3C2.20435 3 1.44129 3.31607 0.87868 3.87868C0.31607 4.44129 0 5.20435 0 6L0 21C0 21.7956 0.31607 22.5587 0.87868 23.1213C1.44129 23.6839 2.20435 24 3 24H21C21.7956 24 22.5587 23.6839 23.1213 23.1213C23.6839 22.5587 24 21.7956 24 21V6C24 5.20435 23.6839 4.44129 23.1213 3.87868C22.5587 3.31607 21.7956 3 21 3ZM3 5H4C4 5.79565 4.31607 6.55871 4.87868 7.12132C5.44129 7.68393 6.20435 8 7 8C7.26522 8 7.51957 7.89464 7.70711 7.70711C7.89464 7.51957 8 7.26522 8 7C8 6.73478 7.89464 6.48043 7.70711 6.29289C7.51957 6.10536 7.26522 6 7 6C6.73478 6 6.48043 5.89464 6.29289 5.70711C6.10536 5.51957 6 5.26522 6 5V3C6 2.73478 6.10536 2.48043 6.29289 2.29289C6.48043 2.10536 6.73478 2 7 2C7.26522 2 7.51957 2.10536 7.70711 2.29289C7.89464 2.48043 8 2.73478 8 3V4C8 4.26522 8.10536 4.51957 8.29289 4.70711C8.48043 4.89464 8.73478 5 9 5H14C14 5.79565 14.3161 6.55871 14.8787 7.12132C15.4413 7.68393 16.2044 8 17 8C17.2652 8 17.5196 7.89464 17.7071 7.70711C17.8946 7.51957 18 7.26522 18 7C18 6.73478 17.8946 6.48043 17.7071 6.29289C17.5196 6.10536 17.2652 6 17 6C16.7348 6 16.4804 5.89464 16.2929 5.70711C16.1054 5.51957 16 5.26522 16 5V3C16 2.73478 16.1054 2.48043 16.2929 2.29289C16.4804 2.10536 16.7348 2 17 2C17.2652 2 17.5196 2.10536 17.7071 2.29289C17.8946 2.48043 18 2.73478 18 3V4C18 4.26522 18.1054 4.51957 18.2929 4.70711C18.4804 4.89464 18.7348 5 19 5H21C21.2652 5 21.5196 5.10536 21.7071 5.29289C21.8946 5.48043 22 5.73478 22 6V10H2V6C2 5.73478 2.10536 5.48043 2.29289 5.29289C2.48043 5.10536 2.73478 5 3 5ZM21 22H3C2.73478 22 2.48043 21.8946 2.29289 21.7071C2.10536 21.5196 2 21.2652 2 21V12H22V21C22 21.2652 21.8946 21.5196 21.7071 21.7071C21.5196 21.8946 21.2652 22 21 22Z" fill="#194039"/>
													<path d="M12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z" fill="#194039"/>
													<path d="M18 16C18.5523 16 19 15.5523 19 15C19 14.4477 18.5523 14 18 14C17.4477 14 17 14.4477 17 15C17 15.5523 17.4477 16 18 16Z" fill="#194039"/>
													<path d="M6 16C6.55228 16 7 15.5523 7 15C7 14.4477 6.55228 14 6 14C5.44771 14 5 14.4477 5 15C5 15.5523 5.44771 16 6 16Z" fill="#194039"/>
													<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="#194039"/>
													<path d="M18 20C18.5523 20 19 19.5523 19 19C19 18.4477 18.5523 18 18 18C17.4477 18 17 18.4477 17 19C17 19.5523 17.4477 20 18 20Z" fill="#194039"/>
													<path d="M6 20C6.55228 20 7 19.5523 7 19C7 18.4477 6.55228 18 6 18C5.44771 18 5 18.4477 5 19C5 19.5523 5.44771 20 6 20Z" fill="#194039"/>
													</g>
													<defs>
													<clipPath id="clip0">
													<rect width="24" height="24" fill="white"/>
													</clipPath>
													</defs>
												</svg>
												<div className="media-body event-size">
													<span className="fs-14 d-block mb-1 text-primary">Date</span>
													<span className="fs-18 font-w500 event-size-1 ">Sunday, 12 June 2023</span>
												</div>
											</div>
										</div>
										<div className="col-lg-5 col-md-12 col-xxl-12">
											<div className="media event-card p-3 rounded align-items-center">	
												<svg className="me-4 location" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
													<g clipPath="">
													<path d="M27.5711 13.4286C27.5711 22.4286 15.9997 30.1428 15.9997 30.1428C15.9997 30.1428 4.42822 22.4286 4.42822 13.4286C4.42822 10.3596 5.64735 7.41638 7.81742 5.24632C9.98748 3.07625 12.9307 1.85712 15.9997 1.85712C19.0686 1.85712 22.0118 3.07625 24.1819 5.24632C26.3519 7.41638 27.5711 10.3596 27.5711 13.4286Z" stroke="#194039" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
													<path d="M15.9997 17.2857C18.13 17.2857 19.8569 15.5588 19.8569 13.4286C19.8569 11.2983 18.13 9.57141 15.9997 9.57141C13.8695 9.57141 12.1426 11.2983 12.1426 13.4286C12.1426 15.5588 13.8695 17.2857 15.9997 17.2857Z" stroke="#194039" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
													</g>
													<defs>
													<clipPath id="clip1">
													<rect width="30.8571" height="30.8571" fill="white" transform="translate(0.571289 0.571411)"/>
													</clipPath>
													</defs>
												</svg>
												<div className="media-body event-size">
													<span className="fs-14 d-block mb-1 text-primary">Location</span>
													<span className="fs-18 font-w500 event-size-1">Indonesa “Sarbini Hall”</span>
												</div>
												<Link to={"#"}>
													<svg className="right" width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M23.725 5.14889C23.7247 5.14861 23.7245 5.14828 23.7242 5.148L18.8256 0.272997C18.4586 -0.0922062 17.865 -0.0908471 17.4997 0.276184C17.1345 0.643168 17.1359 1.23675 17.5028 1.602L20.7918 4.875H0.9375C0.419719 4.875 0 5.29472 0 5.8125C0 6.33028 0.419719 6.75 0.9375 6.75H20.7917L17.5029 10.023C17.1359 10.3882 17.1345 10.9818 17.4998 11.3488C17.865 11.7159 18.4587 11.7172 18.8256 11.352L23.7242 6.477C23.7245 6.47671 23.7248 6.47639 23.7251 6.47611C24.0923 6.10964 24.0911 5.51414 23.725 5.14889Z" fill="#194039"/>
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xxl-12 col-xl-4">
							<div className="card overflow-hidden">
								<div className="card-header border-0 pb-0">
									<div>
										<p className="mb-2 font-w100">Revenue</p>
										<h3 className="mb-0 fs-24 font-w600 ">$124,136</h3>
									</div>
								</div>
								<div className="card-body p-0">	
									<div className="col-7 px-0 offset-5 mt-widget">	
										<CanvasRevenue />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xxl-6 col-xl-4 col-sm-6">
							<div className="card">
								<div className="card-header border-0 pb-0 pt-2">
									<h3 className="mb-0 fs-16 font-w600 ">$456,623</h3>
									<Dropdown className=" default-select" >
										<Dropdown.Toggle  as="div" className="btn btn-sm  text-primary d-flex align-items-center i-false" >
											{control}
											<i className="fa fa-caret-down text-primary scale5 ms-3"></i>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
											<Dropdown.Item className="py-0 text-primary"  onClick={()=>setControl("Monthly")}>
												Monthly
											</Dropdown.Item>
											<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl("Weekly")}>
												Weekly
											</Dropdown.Item>
											<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl("Daily")}>
												Daily
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="card-body p-0">	
									<div id="widgetChart3" className="chart-primary">
										<WidgetChartApex />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xxl-6 col-xl-4 col-sm-6">
							<div className="card">
								<div className="card-body pt-2">
									<div className="index-chart-point">
										<div className="check-point-area">
											<DoughnutChart />
										</div>
										<div>
											<Dropdown className=" float-end default-select" >
												<Dropdown.Toggle  as="div" className="btn btn-sm  text-primary d-flex align-items-center i-false" >
													{control2}
													<i className="fa fa-caret-down text-primary scale5 ms-3"></i>
												</Dropdown.Toggle>
												<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
													<Dropdown.Item className="py-0  text-primary" onClick={()=>setControl2("Monthly")}>
														Monthly
													</Dropdown.Item>
													<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl2("Weekly")}>
														Weekly
													</Dropdown.Item>
													<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl2("Daily")}>
														Daily
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
											<ul className="index-chart-point-list">
												<li><i className="fa fa-stop text-danger"></i>Tickets A</li>
												<li><i className="fa fa-stop text-info"></i> Tickets B</li>
												<li><i className="fa fa-stop text-success"></i> Tickets C</li>
												<li><i className="fa fa-stop text-warning"></i> Tickets D</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12">
							<h4 className="fs-20 mb-4">Recent Sales</h4>
						</div>
						<div className="col-xl-12">
							<RecentSaleTable />
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-xxl-4">
					<div className="row">
						<div className="col-xl-12">
							<div className="card overflow-hidden bg-image-2 bg-secondary">
								<div className="card-header  border-0">
									<div>
										<p className="mb-2 font-w100 text-white">Ticket Refunded</p>
										<h3 className="mb-0 fs-24 font-w600 text-white">25 Left</h3>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12 col-sm-6">
							<div className="card">
								<div className="card-header d-block border-0 pb-0">
									<div className="d-flex align-items-center mb-3">
										<h4 className="card-title">Sales Summary</h4>										
										<Dropdown className="ms-auto float-end default-select" >
											<Dropdown.Toggle  as="div" className="btn btn-sm  text-primary d-flex align-items-center i-false" >
												{control3}
												<i className="fa fa-caret-down text-primary ms-2"></i>
											</Dropdown.Toggle>
											<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
												<Dropdown.Item className="py-0 text-primary"  onClick={()=>setControl3("This Week")}>
													This Week
												</Dropdown.Item>
												<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl3("Next Week")}>
													Next Week
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
									<div className="border p-3 d-flex justify-content-between fs-14 rounded-lg mb-2">
										<span className="text-black">Tuesday</span>
										<span className="text-black">215,523 pcs</span>
									</div>
								</div>
								<div className="card-body pt-0 pb-2 px-2">
									<div id="lineChart">
										<EventLineApex />
									</div>
								</div>
								<div className="card-footer border-0 p-0">
									<Link to={"#"} className="btn btn-primary d-block rounded text-white">Generate Statistic</Link>
								</div>
							</div>
						</div>
						<div className="col-xl-12 col-sm-6 mt-3">
							<h4 className="mb-3">Event Galleries</h4>
							<EventGallery /> 
						</div>
					</div>
				</div>
			</div>		
		</>
	)
}
export default Event;