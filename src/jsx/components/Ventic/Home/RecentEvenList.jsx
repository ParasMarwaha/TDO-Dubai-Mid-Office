import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';

//Images
import pic15 from './../../../../assets/images/card/Untitled-15.jpg';
import pic16 from './../../../../assets/images/card/Untitled-16.jpg';
import pic17 from './../../../../assets/images/card/Untitled-17.jpg';


function Ticket1(){
	return(
		<>
			<span className="ticket-icon-1 mb-3">
				<i className="fa fa-ticket text-primary" />
			</span>
			
		</>
	)
}
function Ticket2(){
	return(
		<>
			<span className="ticket-icon-1 mb-3 disabled">
				<i className="fa fa-ticket text-primary" />
			</span>
		</>
	)
}

const CardEvent = [
	{title:'Envato International Online Meetup 2023', image: pic15, ticketleft:<Ticket1 />, },
	{title:'Google I/O Developer Conference', image: pic16, ticketleft:<Ticket2 />,},
	{title:'Apple Worldwide Developers Conference (WWDC)', image: pic17, ticketleft:<Ticket2 />,},
	{title:'TED Global Summit 2023', image: pic15, ticketleft:<Ticket2 />,},
	{title:'Adobe MAX Creative Conference', image: pic16, ticketleft:<Ticket1 />,},
]; 

const RecentEvenList = ()=>{
	const [data, setData] = useState(CardEvent);
	const [refresh, setRefresh] = useState(false);
	const handleLoad = () => {
		setRefresh(true);
		setTimeout(() => {
		  setData([
			...data,
			data[Math.floor(Math.random() * Math.floor(data.length - 1))],
		  ]);
		  setRefresh(false);
		}, 1000);
	};
	return(
		<>
			<div className="card event-bx">
				<div className="card-header border-0 mb-0">
					<h4 className="card-title font-w500">Recent Event List</h4>
					<Dropdown className="dropdown custom-dropdown mb-0 tbl-orders-style" >
						<Dropdown.Toggle  as="div" className="btn sharp tp-btn i-false c-pointer" >
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#194039" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#194039" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#194039" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</Dropdown.Toggle>
						<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
							<Dropdown.Item>Details</Dropdown.Item>
							<Dropdown.Item className="text-danger">Cancel</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="dz-scroll">
					<div className="card-body  loadmore-content pt-0" id="EventListContent">
						{data.map((data,index)=>(
							<div className="media event-list pb-3 border-bottom mb-3" key={index}>
								<div className="image">	
									<img src={data.image} alt="" />
									<i className="fa fa-music image-icon"></i>
								</div>
								<div className="media-body">
									<h4 className="fs-18 mb-sm-0 mb-2"><Link to={"#"} className="text-black">{data.title}</Link></h4>
									<span className="fs-14 d-block mb-sm-3 mb-2 text-secondary">Medan, Indonesia</span>
									<p className="fs-12">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mini</p>
								</div>
								<div className="media-footer">
									<div className="text-center">
										<span className="ticket-icon-1 mb-3">
											<i className="fa fa-usd text-primary" />
										</span>
										<div className="fs-12 text-primary">$124,00</div>
									</div>
									<div className="text-center">
										{data.ticketleft}
										<div className="fs-12 text-primary">561 pcs Left</div>
									</div>
									<div className="text-center">
										<span className="ticket-icon-1 mb-3">
											<i className="fa fa-calendar text-primary"/>
										</span>
										<div className="fs-12 text-primary">24 Nov 2023</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>	
				<div className="card-footer text-center pt-0 border-0">
					<Link to={"#"} className="btn btn-secondary btn-lg text-white dz-load-more" 
						onClick={() => handleLoad()}
					>
						Load More{" "}
						{refresh && <i className="fa fa-refresh" />}
					</Link>
				</div>	
					
			</div>			
			
			
		</>
	)
}
export default RecentEvenList;