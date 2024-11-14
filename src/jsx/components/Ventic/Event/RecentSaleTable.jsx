import React from "react";
import {Link} from 'react-router-dom';
// import PerfectScrollbar from "react-perfect-scrollbar";

const TableData = [
	{Ticket: '51'},
	{Ticket: '52'},
	{Ticket: '53'},
	{Ticket: '54'},
	// {Ticket: '55'},
	// {Ticket: '56'},
	// {Ticket: '57'},
	// {Ticket: '58'},
	// {Ticket: '59'},
	// {Ticket: '60'},
]; 

const RecentSaleTable = () =>{
	return(
		<>
			<div className="card">
				<div className="card-body p-0">
					<div className="table-responsive fs-14 dz-scroll recent-sell" id="event-bx-2">
						<table className="table table-responsive-md card-table border-0">
							<thead>
								<tr>
									<th>Order ID</th>
									<th>Date</th>
									<th>Customer Name</th>
									<th>Location</th>
									<th>Sold Ticket</th>
									<th>Refund</th>     
								</tr>
							</thead>
							<tbody>
								{TableData.map((item,index)=>(
									<tr key={index}>
										<td>#{`12324${ index + 71}`}</td>
										<td>04/08/2023 12:34 AM</td>
										<td>Elisabeth Queen</td>
										<td>Medan, Indonesia</td>
										<td>{item.Ticket} Pcs</td>
										<td><strong>NO</strong></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className="card-footer pt-0 border-0">
					<Link to={"#"} className="btn btn-secondary d-block text-white">Load More</Link>
				</div>
			</div>
		</>
	)
}	
export default RecentSaleTable;