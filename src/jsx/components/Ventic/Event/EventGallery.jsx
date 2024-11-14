import React, { Component } from "react";
import Slider from "react-slick";


//Images
import pic1 from './../../../../assets/images/events/pic1.jpg';
import pic2 from './../../../../assets/images/events/pic2.jpg';
import pic3 from './../../../../assets/images/events/pic3.jpg';
import pic4 from './../../../../assets/images/events/pic4.jpg';
import pic5 from './../../../../assets/images/events/pic5.jpg';
import pic6 from './../../../../assets/images/events/pic6.jpg';
import pic7 from './../../../../assets/images/events/pic7.jpg';
import pic8 from './../../../../assets/images/events/pic8.jpg';
import pic9 from './../../../../assets/images/events/pic9.jpg';
import pic10 from './../../../../assets/images/events/pic10.jpg';
import pic11 from './../../../../assets/images/events/pic11.jpg';
import pic12 from './../../../../assets/images/events/pic12.jpg';


const galleryBlog = [
	{image: pic7, title:'Easy Event Setup'},
	{image: pic8, title:'Smart Ticketing'},
	{image: pic9, title:'Extensive Distribution'},
	{image: pic10, title:'Host Virtual Experiences'},
	{image: pic11, title:'Track Analytics'},
	{image: pic12, title:'Communication'},
];

const imageBlog = [
	{ image : pic1},
	{ image : pic2},
	{ image : pic3},
	{ image : pic4},
	{ image : pic5},
	{ image : pic6}
];

export default class EventGallery extends Component{
	constructor(props) {
	super(props);
		this.state = {
		  nav1: null,
		  nav2: null
		};
	}
	
	componentDidMount() {
		this.setState({
		  nav1: this.slider1,
		  nav2: this.slider2
		});
	}
	
	render() {
		var settings = {		
			arrows: false,				
		};
		return(
			<>			
				<Slider
					asNavFor={this.state.nav2}
					ref={slider => (this.slider1 = slider)}
					className=""
					{...settings}
				>
					{galleryBlog.map((data,index)=>(	
						<div className="item p-1" key={index}>
							<div className="event-card">
								<img src={data.image} alt="" style={{width:"100%"}} />
								<div className="event-card-overlay">
									<h5>{data.title}</h5>
								</div>
							</div>
						</div>
					))}	
				</Slider>
				<Slider
					asNavFor={this.state.nav1}
					ref={slider => (this.slider2 = slider)}
					slidesToShow={3}
					swipeToSlide={true}
					focusOnSelect={true}
					className="owl-carousel owl-theme gallery-slider"
					{...settings}
				>
					{imageBlog.map((item,ind)=>(
						<div className="item p-2" key={ind}><img src={item.image} alt="" /></div>
					))}					
				</Slider>
			</>
		);
	}
}
