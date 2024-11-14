import React from 'react';
import {Tab, Nav} from 'react-bootstrap';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

const DountApexChart = loadable(() =>
	pMinDelay(import("./DountApexChart"), 1000)
);

const SellingBlog = ()=>{
	return(
		<>
			<div className="d-sm-flex d-block align-items-center justify-content-center">
				<div className="col-xl-6 col-xxl-5 text-center">
					<DountApexChart />
				</div>	
				<div className="col-xl-6 col-xxl-7">
					<p className="fs-14 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
					<div className="d-flex  mt-4">
						<div className="me-4">
							<svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="20" height="8" rx="4" fill="#FB3E7A"/>
							</svg>
							<h4 className="fs-18 text-black mb-0 font-w600">21,512</h4>
							<span className="fs-14">Ticket Left</span>
						</div>
						<div className="me-4">
							<svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="20" height="8" rx="4" fill="#0E8A74"/>
							</svg>
							<h4 className="fs-18 text-black mb-0 font-w600">45,612</h4>
							<span className="fs-14">Ticket Sold</span>
						</div>
						<div className="">
							<svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="20" height="8" rx="4" fill="#C8C8C8"/>
							</svg>
							<h4 className="fs-18 text-black mb-0 font-w600">275</h4>
							<span className="fs-14">Event Held</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const BestSellingTab = ()=>{
	return(
		<>	
			<Tab.Container defaultActiveKey="1">
				<div className="card">
					<div className="card-header border-0 pb-0 flex-wrap">
						<h4 className="card-title font-w500">Best Selling</h4>
						<div className="card-action coin-tabs">
							<Nav as="ul" className="nav nav-tabs" role="tablist">
								<Nav.Item as="li" className="nav-item">
									<Nav.Link  className="nav-link" eventKey="1" >
										Monthly
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link "  eventKey="2" >
										Weekly
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link "  eventKey="3" >
										Daily
									</Nav.Link>
								</Nav.Item >
							</Nav>
						</div>
					</div>
					<div className="card-body pt-2">
						<Tab.Content >
							<Tab.Pane   eventKey="1">
								<SellingBlog />
							</Tab.Pane >	
							<Tab.Pane  eventKey="2">
								<SellingBlog />
							</Tab.Pane >	
							<Tab.Pane  eventKey="3">												
								<SellingBlog />
							</Tab.Pane >	
						</Tab.Content >	
					</div>
				</div> 
				
			</Tab.Container>			
		</>
	)
}
export default BestSellingTab;