import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const upcomingBlog = [
	{ day:'12', week:'Sat', ticket:'561'},
	{ day:'19', week:'Tus', ticket:'450'},
	{ day:'28', week:'Wed', ticket:'500'},
];

const UpcomingEventSection = () =>{
	const [value, onChange] = useState(new Date());

	const [data, setData] = useState(upcomingBlog);
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
			<div className="card">
				<div className="card-body text-center event-calender small-calendar pb-4 ">				
					<Calendar onChange={onChange} value={value} />
				</div>
				<div className="card-header py-0 border-0">
					<h4 className="text-black fs-20">Upcoming Events</h4>
				</div>
				<div className="card-body pb-0  height450 dz-scroll">
					{data.map((item, index)=>(
						<div className="media mb-5 align-items-center event-list" key={index}>
							<div className="p-3 text-center me-3 date-bx bgl-primary">
								<h2 className="mb-0 text-secondary fs-28 font-w600">{item.day}</h2>
								<h5 className="mb-1 text-black">{item.week}</h5>
							</div>
							<div className="media-body px-0">
								<h6 className="mt-0 mb-3 fs-14"><Link to={"/event"} className="text-black" >Live Concert Choir Charity Event 2023</Link></h6>
								<ul className="fs-14 list-inline mb-2 d-flex justify-content-between">
									<li>Ticket Sold</li>
									<li>{item.ticket}/650</li>
								</ul>
								<div className="progress mb-0" style={{height:"4px", width:"100%"}}>
									<div className="progress-bar bg-warning progress-animated" style={{width:"60%", height:"8px"}} role="progressbar">
										<span className="sr-only">60% Complete</span>
									</div>
								</div>
							</div>
						</div>
					))}
					
				</div>
				<div className="card-footer pt-0 border-0"
					onClick={()=>handleLoad()}
				>
					<Link to={"#"} className="btn btn-secondary btn-block text-white">
						Load More{" "}
						{refresh && <i className="fa fa-refresh" />}
					</Link>
				</div>
			</div>
			
		</>
	)
}
export default UpcomingEventSection; 