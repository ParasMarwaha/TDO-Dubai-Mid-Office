import React from 'react';
import ReactApexChart from "react-apexcharts";

class CircleApexChart extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
		series: [80, 50, 75,30],
		
		options: {
			labels: ['Ticket A', 'Ticket B', 'Ticket C','Ticket D'],
			chart: {
				type: 'radialBar',
				height: 400,
				offsetY: 0,
				offsetX: 0,
				sparkline: {
					enabled: true,
				},
			},
			plotOptions: {
				radialBar: {
					size: undefined,
					inverseOrder: false,
					hollow: {
						margin: 0,
						size: '15%',
						background: 'transparent',
					},
			  
					track: {
						show: true,
						background: '#e1e5ff',
						strokeWidth: '10%',
						opacity: 1,
						margin: 15, // margin is in pixels
					},
				},
			},
			fill: {
				opacity: 1
			},
			stroke: {
				lineCap:'round',
			},
			colors:['#0E8A74', '#FB3E7A', '#FF7B31','#C8C8C8'],
			legend: {
				fontSize: '14px',  
				show: true,
				fontWeight:600,
				position: 'bottom',
				markers:{
					radius:0,
				}
			},
			responsive: [{
				breakpoint: 575,
				options: {
					chart: {
						height:350,
					},
					plotOptions:{
						radialBar:{
							track:{
								margin: 15,
							}
						},
					},
				},
			}]
		},
    };
}

  render() {
    return (
		<div id="chart">
		  <ReactApexChart
			options={this.state.options}
			series={this.state.series}
			type="radialBar"
			height="400px"
		  />
		 </div> 
    );
  }
}
export default CircleApexChart;