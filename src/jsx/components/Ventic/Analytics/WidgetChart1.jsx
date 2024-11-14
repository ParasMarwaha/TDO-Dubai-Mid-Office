import React from 'react';
import ReactApexChart from "react-apexcharts";

class WidgetChart1 extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
		series: [
			 {
				name: "New Clients",
				data: [180, 150, 200, 100, 80, 70, 40]
			}
		],
		options: {
			chart: {
				type: "bar",
				height: 350,
				stacked: true,
				toolbar: {
					show: false
				},
				sparkline: {
					//enabled: true
				},
				offsetX:0,
			},
			plotOptions: {
				bar: {
					columnWidth: "25%",
					endingShape: "rounded",
					startingShape: "rounded",
					borderRadius: 5,
					colors: {
						backgroundBarColors: ['#F8F8F8', '#F8F8F8', '#F8F8F8', '#F8F8F8','#F8F8F8','#F8F8F8','#F8F8F8','#F8F8F8'],
						backgroundBarOpacity: 1,
						backgroundBarRadius: 5,
					},

				},
				distributed: true
			},
			colors:['#FB3E7A'],
			grid: {
				borderColor:'#F8F8F8'
			},
			legend: {
				show: false
			},
			fill: {
			  opacity: 1
			},
			dataLabels: {
				enabled: false,
				colors: ['#000'],
				dropShadow: {
				  enabled: true,
				  top: 1,
				  left: 1,
				  blur: 1,
				  opacity: 1
			  }
			},
			xaxis: {
				categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
				labels: {
					style: {
					  colors: '#759791',
					  
					  fontSize: '14px',
					  fontFamily: 'poppins',
					  fontWeight: 400,
					  cssClass: 'apexcharts-xaxis-label',
					},
				},
				crosshairs: {
					show: false,
				},
				axisBorder: {
					show: false,
				},
			},
			
			yaxis: {
				show: false
			},
			
			tooltip: {
				x: {
					show: true
				}
			},
			responsive: [{
				breakpoint: 1600,
				options: {
					chart: {
						height:300,
					},
					plotOptions: {
						bar: {
							columnWidth: "35%",
						}
					}
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
			type="bar"
			 height="350px"
		  />
		 </div> 
    );
  }
}
export default WidgetChart1;