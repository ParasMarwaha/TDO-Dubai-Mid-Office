import React,{useState,useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import {Dropdown} from 'react-bootstrap';

//Import
import { ThemeContext } from "../../../context/ThemeContext";
import BestSellingTab from '../Ventic/Home/Tab/BestSellingTab';
import RecentEvenList from '../Ventic/Home/RecentEvenList';
import Latestsaleblog from '../Ventic/Home/Latestsaleblog';
import SalesRevenueTab from '../Ventic/Home/Revenue/SalesRevenueTab';
import UpcomingEventSection from '../Ventic/Home/UpcomingEventSection';


const TicketsLineApex = loadable(() =>
	pMinDelay(import("../Ventic/Home/TicketsLineApex"), 1000)
);
const RevenueLineApex = loadable(() =>
	pMinDelay(import("../Ventic/Home/RevenueLineApex"), 1000)
);
const SalesCanvas = loadable(() =>
	pMinDelay(import("../Ventic/Home/SalesCanvas"), 1000)
);
const Donut = loadable(() =>
	pMinDelay(import("../Ventic/Home/Donut"), 1000)
);

const DashboardDark  = () => {
	const { changeBackground, background } = useContext(ThemeContext);
	  useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });
	}, []);
	
	const [timesession, setTimesession] = useState('July 27th - Auguts 27th, 2021');
	return(
		<>
			<div className="form-head mb-4 d-flex flex-wrap align-items-center">
				<div className="me-auto">
					<h2 className="font-w600 mb-0">Dashboard</h2>
					<p>Lorem ipsum  dolor sit amet </p>
				</div>	
				<div className="input-group search-area2 d-xl-inline-flex mb-2 me-lg-4 me-md-2">
					<button className="input-group-text"><i className="flaticon-381-search-2 text-primary"></i></button>
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
						<i className="fa fa-caret-down text-light scale5 ms-3"></i>
					</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
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
				<div className="col-xl-12">
					<div className="row">
						<div className="col-xl-3 col-xxl-6 col-sm-6 ">
							<div className="card">
								<div className="card-header border-0 pb-0">
									<div className="d-flex align-items-center">
										<h2 className="chart-num font-w600 mb-0">215</h2>
										<svg className="ms-2 primary-icon" width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M2.00401 11.1924C0.222201 11.1924 -0.670134 9.0381 0.589795 7.77817L7.78218 0.585786C8.56323 -0.195262 9.82956 -0.195262 10.6106 0.585786L17.803 7.77817C19.0629 9.0381 18.1706 11.1924 16.3888 11.1924H2.00401Z" fill="#0E8A74"/>
										</svg>
									</div>
									<div>
										<h5 className="text-black font-w500 mb-0">Tickets</h5>
									</div>
								</div>
								<div className="card-body pt-0">
									<div id="widgetChart1" className="chart-primary">
										<TicketsLineApex />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-6 col-sm-6 ">
							<div className="card">
								<div className="card-header border-0 pb-0">
									<div className="d-flex align-items-center">
										<h2 className="chart-num font-w600 mb-0">$536k</h2>
										<svg className="ms-2" width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M2.00401 -4.76837e-06C0.222201 -4.76837e-06 -0.670134 2.15428 0.589795 3.41421L7.78218 10.6066C8.56323 11.3876 9.82956 11.3876 10.6106 10.6066L17.803 3.41421C19.0629 2.15428 18.1706 -4.76837e-06 16.3888 -4.76837e-06H2.00401Z" fill="#FF3131"/>
										</svg>
									</div>
									<div>
										<h5 className="text-black font-w500 mb-0">Revenue</h5>
									</div>
								</div>
								<div className="card-body pt-0">
									<div id="widgetChart2">
										<RevenueLineApex />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-6 col-sm-6 ">
							<div className="card">
								<div className="card-header border-0 pb-0">
									<div className="d-flex align-items-center">
										<h2 className="chart-num font-w600 mb-0">652</h2>
										<svg className="ms-2 primary-icon" width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M2.00401 11.1924C0.222201 11.1924 -0.670134 9.0381 0.589795 7.77817L7.78218 0.585786C8.56323 -0.195262 9.82956 -0.195262 10.6106 0.585786L17.803 7.77817C19.0629 9.0381 18.1706 11.1924 16.3888 11.1924H2.00401Z" fill="#0E8A74"/>
										</svg>
									</div>
									<div>
										<h5 className="text-black font-w500 mb-0">Sales</h5>
									</div>
								</div>
								<div className="card-body pt-0">
									<SalesCanvas />
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-6 col-sm-6 ">
							<div className="card">
								<div className="card-body pt-sm-4 pt-3 d-flex align-items-center justify-content-between">
									<div className="me-3">
										<div className="d-flex align-items-center">
											<h2 className="chart-num font-w600 mb-0">45242</h2>
										</div>
										<div>
											<h5 className="text-black font-w500 mb-3 mt-2">Event Held</h5>
										</div>
										<div>
											<p className="text-primary fs-14 mb-0">
												<svg className="me-2 primary-icon" width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns=	"http://www.w3.org/2000/svg">
													<path d="M2.00401 11.1924C0.222201 11.1924 -0.670134 9.0381 0.589795 7.77817L7.78218 0.585786C8.56323 -0.195262 9.82956 -0.195262 10.6106 0.585786L17.803 7.77817C19.0629 9.0381 18.1706 11.1924 16.3888 11.1924H2.00401Z" fill="#0E8A74"/>
												</svg>
												2.4%
												<span className="op-6 text-light">than Last Week</span>
											</p>
										</div>
									</div>
									<div>
										<div className="d-inline-block position-relative donut-chart-sale">									 
											{background.value === "dark" ? (
											  <Donut
												value={66}
												backgroundColor="rgba(14, 138, 116,1)"
												backgroundColor2="rgba(0,0,0,0.5)"
											  />
											) : (
											  <Donut value={66} backgroundColor="rgba(14, 138, 116,1)" backgroundColor2="rgba(0,0,0,0.1)" />
											)}
											<small className="text-black" >66%</small>
										</div>
									</div>	
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-12">
					<div className="row">		
						<div className="col-xl-6">
							<BestSellingTab />
						</div>	
						<div className="col-xl-6">
							<div className="card bg-primary">
								<div className="card-body">
									<div className="d-sm-flex d-block pb-sm-3 align-items-end mb-2">
										<div className="me-auto pe-3 mb-3 mb-sm-0">
											<span className="chart-num-3 font-w200 d-block mb-sm-3 mb-2 text-white">Ticket Sold Today</span>
											<h2 className="chart-num-2 text-white mb-0">456,502<span className="fs-18 me-2 ms-3">pcs</span></h2>
										</div>
										<div className="d-flex flex-wrap mb-3 mb-sm-0">
											<svg width="87" height="58" viewBox="0 0 87 58" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M18.4571 37.6458C11.9375 44.6715 4.81049 52.3964 2 55.7162H68.8125C77.6491 55.7162 84.8125 48.5528 84.8125 39.7162V2L61.531 31.9333C56.8486 37.9536 48.5677 39.832 41.746 36.4211L37.3481 34.2222C30.9901 31.0432 23.2924 32.4352 18.4571 37.6458Z" fill="url(#paint0_linear)"/>
												<path d="M2 55.7162C4.81049 52.3964 11.9375 44.6715 18.4571 37.6458C23.2924 32.4352 30.9901 31.0432 37.3481 34.2222L41.746 36.4211C48.5677 39.832 56.8486 37.9536 61.531 31.9333L84.8125 2" stroke="white" strokeWidth="4" strokeLinecap="round"/>
												<defs>
												<linearGradient id="paint0_linear" x1="43.4062" y1="8.71453" x2="46.7635" y2="55.7162" gradientUnits="userSpaceOnUse">
												<stop stopColor="white" offset="0"/>
												<stop offset="1" stopColor="white" stopOpacity="0"/>
												</linearGradient>
												</defs>
											</svg>
											<div className="ms-3">
												<p className="fs-20 mb-0 font-w500 text-white">+4%</p>
												<span className="fs-12 text-white">than last day</span>
											</div>
										</div>
									</div>
									<div className="progress style-1" style={{height:"15px"}}>
										<div className="progress-bar bg-white progress-animated" style={{width: "55%", height:"15px"}} role="progressbar">
											<span className="sr-only">55% Complete</span>
											<span className="bg-white arrow"></span>
											<span className="font-w600 counter-bx text-black"><strong className="counter font-w400">985pcs Left</strong></span>
										</div>
									</div>
									<p className="fs-12 text-white pt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mini</p>
									<Link to={"#"} className="text-white">View detail<i className="las la-long-arrow-alt-right scale5 ms-3"></i></Link>
								</div>
							</div>
						</div>
					</div>
				</div>	
				<div className="col-xl-9 col-xxl-8">
					<div className="row">	
						<div className="col-xl-12">
							<RecentEvenList />
						</div>
						<div className="col-xl-6 col-xxl-12">
							<Latestsaleblog />	
						</div>
						<div className="col-xl-6 col-xxl-12">
							<SalesRevenueTab />
						</div>
					</div>
				</div>	
				<div className="col-xl-3 col-xxl-4">
					<div className="row">
						<div className="col-xl-12">
							<UpcomingEventSection />
						</div>
					</div>	
					
				</div>
			</div>	
		</>
	)
}
export default DashboardDark;