import React,{useState} from 'react';
import {Link} from 'react-router-dom';
// import PerfectScrollbar from "react-perfect-scrollbar";
import {Dropdown} from 'react-bootstrap';

//Image
import pic1 from './../../../../assets/images/contacts/pic1.jpg';
import pic2 from './../../../../assets/images/contacts/pic2.jpg';
import pic3 from './../../../../assets/images/contacts/pic3.jpg';

const SalesBlog = [
	{image: pic1, title:'Olivia Johanson', time: '2m',},
	{image: pic2, title:'Griezerman', time: '5m',},
	{image: pic3, title:'Uli Trumb', time: '8m',},
	{image: pic2, title:'Oconner', time: '9m',},
	{image: pic1, title:'Olivia Johanson', time: '2m',},
];

const Latestsaleblog = () =>{
	
	const [data, setData] = useState(SalesBlog);
	// This is load more function 
	const [refresh, setRefresh] = useState(false);
	const onClick = () => {
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
			<div className="card latest-sales-bx">
				<div className="card-header border-0 mb-0">
					<h4 className="card-title font-w500">Latest Sales</h4>
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
				<div className="dz-scroll ">
					<div className="card-body pb-0 loadmore-content pt-0" id="LatestSalesContent">
						{data.map((data,index)=>(	
							<div className="media pb-3 border-bottom mb-3 align-items-center" key={index}>
								<div className="media-image me-2">
									<img src={data.image} alt="" />
								</div>
								<div className="media-body">
									<h6 className="fs-16 mb-0">{data.title}</h6>
									<div className="d-flex">
										<span className="fs-14 me-auto text-secondary"><i className="fa fa-ticket me-1"></i>High Performance Conert 2020..</span>
										<span className="fs-14 text-nowrap">{data.time} ago</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>	
				<div className="card-footer style-1 border-0 px-0">
					<Link  to={"#"} className="dz-load-more fa fa-long-arrow-down text-secondary" onClick={() => onClick()}>{" "}
						{refresh && <i className="fa fa-refresh"></i>}
					</Link>
				</div>
			</div>
		</>
	)
}
export default Latestsaleblog; 