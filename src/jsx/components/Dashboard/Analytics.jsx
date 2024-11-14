import React,{useState,useContext} from 'react';
import {Link} from 'react-router-dom';
import { Dropdown } from "react-bootstrap";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

//Import 
import { ThemeContext } from "../../../context/ThemeContext";
import TrendingItems from '../Ventic/Analytics/TrendingItems';


const SalesBarApex = loadable(() =>
	pMinDelay(import("../Ventic/Analytics/SalesBarApex"), 1000)
);

const BestSellingTab = loadable(() =>
	pMinDelay(import("../Ventic/Analytics/BestSellingTab"), 1000)
);

const CircleApexChart = loadable(() =>
	pMinDelay(import("../Ventic/Analytics/CircleApexChart"), 1000)
);

const AnalyticsDonut = loadable(() =>
	pMinDelay(import("../Ventic/Analytics/AnalyticsDonut"), 1000)
);
const WidgetChart1 = loadable(() =>
	pMinDelay(import("../Ventic/Analytics/WidgetChart1"), 1000)
);
const PieChart1 = loadable(() =>
	pMinDelay(import("../Ventic/Analytics/PieChart1"), 1000)
);
const MonthlyApexChart2 = loadable(() =>
	pMinDelay(import("../Ventic/Analytics/MonthlyApexChart2"), 1000)
);

const WidgetChartApex = loadable(() =>
	pMinDelay(import("../Ventic/Event/WidgetChartApex"), 1000)
);
const DoughnutChart = loadable(() =>
	pMinDelay(import("../Ventic/Event/DoughnutChart"), 1000)
);

const Analytics = () =>{
	const {  background } = useContext(ThemeContext);
	const [timesession, setTimesession] = useState('July 27th - Auguts 27th, 2021');
	const [control, setControl] = useState('Monthly');
	const [control2, setControl2] = useState('Monthly');
	const [control3, setControl3] = useState('This Week');
	const [control4, setControl4] = useState('This Week');
	const [control5, setControl5] = useState('This Week');
	return(
		<>
			<div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item "><Link to={"#"}>Dashboard</Link></li>
					<li className="breadcrumb-item active"><Link to={"#"}>Analytics </Link></li>
				</ol>
			</div>
			<div className="form-head mb-4 d-flex flex-wrap align-items-center">
				<div className="me-auto">
					<h2 className="font-w600 mb-0">Analytics</h2>
					<p className="">Lorem ipsum  dolor sit amet </p>
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
							<span className="d-block text-black ">Change Periode</span>
							<small className="d-block text-muted">{timesession}</small>
						</div>
						<i className="fa fa-caret-down text-light scale5 ms-3" />
					</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
						<Dropdown.Item onClick={()=>setTimesession("October 29th - November 29th, 2021")}>
							October 29th - November 29th, 2021
						</Dropdown.Item>
						<Dropdown.Item onClick={()=>setTimesession("July 27th - Auguts 27th, 2021")}>
							July 27th - Auguts 27th, 2021
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">
							<div className="card bg-primary">	
								<div className="card-header border-0 pb-0 align-items-center justify-content-center">
									<div className="me-auto">
										<h4 className="chart-num-3 mb-0 text-white">Sales Comparison</h4>
										<span className="chart-num-3 font-w100 text-white">Than last day</span>
									</div>
									<span className="font-w600 me-2 text-white chart-num-2">94%</span>
									<svg width="27" height="13" viewBox="0 0 27 13" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M26.002 13L13.002 1.55023e-07L0.00195312 13" fill="white"/>
									</svg>
								</div>
								<div className="card-body pb-0 p-2">
									<div id="line-chart-2">
										<SalesBarApex />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12">	
							<BestSellingTab />
						</div>
						<div className="col-xxl-12 col-md-6">
							<div className="col-xl-12">
								<div className="card">
									<div className="card-header pb-0 border-0">
										<h4 className="card-title font-w500 mb-0">Pie Chart </h4>
										<Dropdown className="ms-auto float-end default-select" >
											<Dropdown.Toggle  as="div" className="btn btn-sm  text-primary d-flex align-items-center i-false" >
												{control3}
												<i className="fa fa-caret-down text-primary ms-2" />
											</Dropdown.Toggle>
											<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
												<Dropdown.Item className="py-0 text-primary"  onClick={()=>setControl3("This Week")}>
													This Week
												</Dropdown.Item>
												<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl3("Next Week")}>
													Next Week
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>	
									</div>
									<div className="card-body pt-2">
										<div id="chartCircle" className="chartseries">
											<CircleApexChart />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xxl-12 col-md-6">
							<div className="card">
								<div className="card-header pb-0 border-0">
									<h4 className="card-title font-w500 mb-0">Customers </h4>
								</div>
								<div className="card-body">
									<div className="d-flex align-items-center justify-content-center">
										<div className="d-inline-block position-relative donut-chart-sale mb-3">
											{background.value === "dark" ? (
											  <AnalyticsDonut
												value={50}
												backgroundColor="rgba(14, 138, 116,1)"
												backgroundColor2="rgba(0,0,0,0.5)"
											  />
											) : (
											  <AnalyticsDonut value={50} backgroundColor="rgba(14, 138, 116,1)" backgroundColor2="rgba(0,0,0,0.1)"/>
											)}
											<small>50%</small>
										</div>
										<div className="ms-4">
											<h5 className="fs-18 text-black mb-0 ">Adult</h5>
											<span className="text-primary fs-14">30 - 45 Years</span>
										</div>
									</div>
									<div className="d-flex align-items-center mt-4 justify-content-center">
										<div className="d-inline-block position-relative donut-chart-sale mb-3">
											{background.value === "dark" ? (
											  <AnalyticsDonut
												value={84}
												backgroundColor="rgba(14, 138, 116,1)"
												backgroundColor2="rgba(0,0,0,0.5)"
											  />
											) : (
											  <AnalyticsDonut value={84} backgroundColor="rgba(14, 138, 116,1)" backgroundColor2="rgba(0,0,0,0.1)"/>
											)}
											<small>84%</small>
										</div>
										<div className="ms-4">
											<h5 className="fs-18 text-black mb-0 ">Young</h5>
											<span className="text-primary fs-14">17 - 24 Years</span>
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
							<div className="card">
								<div className="card-header border-0 pb-0 flex-wrap">
									<h4 className="card-title font-w500 mb-0">Best Selling</h4>
									<Dropdown className=" float-end default-select" >
										<Dropdown.Toggle  as="div" className="btn btn-sm  text-primary d-flex align-items-center i-false" >
											{control2}
											<i className="fa fa-caret-down text-primary scale5 ms-3"></i>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
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
								</div>
								<div className="card-body pb-2">
									<div className="d-flex border justify-content-between align-items-center p-3 rounded">	
										<span className="fs-14  font-w500">Tuesday</span>
										<span className="fs-14  font-w500">215,523 pcs</span>
									</div>
									<div className="row align-items-center">
										<div className="col-sm-6 p-0">
											<div id="lineChart">
												<WidgetChart1 />
											</div>
										</div>	
										<div className="col-sm-6">
											<div id="pieChart" className="d-flex justify-content-center">
												<PieChart1 />
											</div>
											<div className="chart-point mt-4 text-center">
												<div className="fs-13 col px-1 text-primary text-start">
													<div className="mb-2">
														<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
															<rect y="6.10352e-05" width="22.0298" height="21" rx="8" fill="#FB3E7A"/>
														</svg>
													</div>	
													Movies Ticket
												</div>
												<div className="fs-13 col px-1 text-primary text-start">
													<div className="mb-2">
														<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
															<rect x="0.128906" y="6.10352e-05" width="22.0298" height="21" rx="8" fill="#0E8A74"/>
														</svg>
													</div>
													Music Ticket
												</div>
												<div className="fs-13 col px-1 text-primary text-start">
													<div className="mb-2">
														<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
															<rect x="0.24707" y="6.10352e-05" width="22.0298" height="21" rx="8" fill="#C8C8C8"/>
														</svg>
													</div>
													Football Ticket
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-xxl-12 col-sm-6">
							<div className="card">
								<div className="card-header align-items-start pb-0 border-0">
									<span className="fs-20 font-w400 mb-0 ticket-size">Ticket Sold</span>
									<h4 className="fs-16 mb-0 ticket-size-1">456k Pcs</h4>
								</div>
								<div className="card-body">
									<div className="progress" style={{height:"9px"}}>
										<div className="progress-bar bg-secondary progress-animated" style={{width: "80%", height:"9px"}}>
											<span className="sr-only">60% Complete</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-xxl-12 col-sm-6">
							<div className="card">
								<div className="card-header align-items-center pb-2 pt-2 border-0">
									<h4 className="fs-16 mb-0 ">451,509</h4>
									<Dropdown className=" float-end default-select" >
										<Dropdown.Toggle  as="div" className="btn btn-sm  text-primary d-flex align-items-center i-false" >
											{control}
											<i className="fa fa-caret-down text-primary scale5 ms-3" />
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
											<Dropdown.Item className="py-0  text-primary" onClick={()=>setControl("Monthly")}>
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
									<div className="card-body p-0">
										<div id="widgetChart1" className="dashboard-chart">
											<MonthlyApexChart2 />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-xxl-12 col-sm-6">
							<div className="card">
								<div className="card-header align-items-center pb-0 border-0">
									<h4 className="fs-16 mb-0 ">$456,623</h4>
									<Dropdown className=" float-end default-select" >
										<Dropdown.Toggle  as="div" className="btn btn-sm  text-primary d-flex align-items-center i-false" >
											{control4}
											<i className="fa fa-caret-down text-primary scale5 ms-3"></i>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
											<Dropdown.Item className="py-0  text-primary" onClick={()=>setControl4("Monthly")}>
												Monthly
											</Dropdown.Item>
											<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl4("Weekly")}>
												Weekly
											</Dropdown.Item>
											<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl4("Daily")}>
												Daily
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="card-body p-0">
									<div className="card-body p-0">
										<div id="widgetChart3" className="chart-primary">
											<WidgetChartApex />
										</div>
									</div>
								</div>
							</div>
						</div>	
						<div className="col-xl-6 col-xxl-12 col-sm-6">
							<div className="card">
								<div className="card-body pt-2">
									<div className="index-chart-point">
										<div className="check-point-area">
											<DoughnutChart  />
										</div>
										<div className="">
											<Dropdown className=" float-end default-select" >
												<Dropdown.Toggle  as="div" className="btn btn-sm  text-primary d-flex align-items-center i-false" >
													{control5}
													<i className="fa fa-caret-down text-primary scale5 ms-3"></i>
												</Dropdown.Toggle>
												<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
													<Dropdown.Item className="py-0  text-primary" onClick={()=>setControl5("Monthly")}>
														Monthly
													</Dropdown.Item>
													<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl5("Weekly")}>
														Weekly
													</Dropdown.Item>
													<Dropdown.Item className="py-0 text-primary" onClick={()=>setControl5("Daily")}>
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
							<TrendingItems />
						</div>						
					</div>	
				</div>
			</div>		
		</>
	)
}
export default Analytics;