import React from 'react';
import {Tab, Nav} from 'react-bootstrap';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

const SalesApexChart1 = loadable(() =>
	pMinDelay(import("./SalesApexChart1"), 1000)
);

const SalesRevenueTab = ()=>{
	return(
		<>	
			<Tab.Container defaultActiveKey="Monthly">
				<div className="card">
					<div className="card-header border-0 pb-0 flex-wrap">
						<h4 className="card-title font-w500">Sales Revenue</h4>
						<div className="card-action coin-tabs">
							<Nav as="ul" className="nav nav-tabs" role="tablist">
								<Nav.Item as="li" className="nav-item">
									<Nav.Link  className="nav-link" eventKey="Monthly" >
										Monthly
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link "  eventKey="Weekly" >
										Weekly
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link "  eventKey="Daily" >
										Daily
									</Nav.Link>
								</Nav.Item >
							</Nav>
						</div>
					</div>
					<div className="card-body pb-2">
						<Tab.Content >
							<div className="tab-content">
								<Tab.Pane  className="tab-pane fade" eventKey="Monthly">
									<div id="salesChart" className="chart-primary">
										<SalesApexChart1 />
									</div>
								</Tab.Pane>	
								<Tab.Pane  className="tab-pane fade" eventKey="Weekly">
									<div id="salesChart1" className="chart-primary">
										<SalesApexChart1 />
									</div>
								</Tab.Pane>	
								<Tab.Pane className="tab-pane fade" eventKey="Daily">
									<div id="salesChart2" className="chart-primary">
										<SalesApexChart1 />
									</div>
								</Tab.Pane>	
							</div>	
						</Tab.Content>	
					</div>
				</div> 
			</Tab.Container>			
		</>
	)
}
export default SalesRevenueTab;