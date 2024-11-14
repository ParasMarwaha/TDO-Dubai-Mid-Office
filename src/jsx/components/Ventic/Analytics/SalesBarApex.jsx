import React,{Component} from "react";
import ReactApexChart from "react-apexcharts";

class SalesBarApex extends Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [{
			  name: 'Income',
			  data: [420, 550, 650, 220, 650, 470, 310, 700, 290, 470]
			}, {
			  name: 'Expenses',
			  data: [270, 650, 201, 90, 250, 750, 470, 550, 650, 270]
			}],
			options: {
				chart: {
					height: 250,
					type: "bar",
					toolbar: {
						show: false,
					},
					
				},
				plotOptions: {
					  bar: {
						horizontal: false,
						columnWidth: '55%',
						endingShape: 'rounded',
						borderRadius: 6,
					  },
				},
				colors:['#FFFFFF','#FB3E7A'],
				dataLabels: {
					enabled: false
				},
					
				legend: {
					show: false,
					fontSize: '12px',
					fontWeight: 300,
					
					labels: {
						colors: 'black',
					},
					position: 'bottom',
					horizontalAlign: 'center', 	
					markers: {
						width: 19,
						height: 19,
						strokeWidth: 0,
						radius: 19,
						strokeColor: '#fff',
						fillColors:['#FFFFFF','#22DBBA'],
						offsetX: 0,
						offsetY: 0
					}
				},
				 stroke: {
					show: true,
					width: 5,
					colors: ['transparent']
				},
				
				grid:{
					borderColor:'transparent'
				},
				
				xaxis: {
				  categories: ['06', '07', '08', '09', '10','11','12','13','14','15'],
				  labels: {
				   style: {
					  colors: '#fff',
					  fontSize: '14px',
					  fontFamily: 'Poppins',
					  fontWeight: 100,
					  
					},
				  },
				  axisTicks:{
					  show:false,
				  },
				   axisBorder:{
					   show:false,
				   },
				},
				yaxis: {
					show: false
				},
				fill: {
				  colors:['#FFFFFF','#FB3E7A'],
				  opacity: 1
				},
				tooltip: {
				  y: {
					formatter: function (val) {
					  return "$ " + val + " thousands"
					}
				  }
				},
				responsive: [{
					breakpoint: 575,
					options: {
						chart: {
							height:200,
						},
						stroke: {
						  width: 3
						},
						plotOptions: {
						  bar: {
							columnWidth: '75%'
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
				  height={250}
				/>
			</div>
		);
	}
}

export default SalesBarApex;