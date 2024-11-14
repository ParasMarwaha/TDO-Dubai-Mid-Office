import React from "react";
import ReactApexChart from "react-apexcharts";

class RevenueLineApex extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [
				{
					name: 'Net Profit',
					data: [100,200, 100, 300, 200, 400, 200, 300,100, 300,200,300],
					//radius: 12,	
				}, 				
			],
			options: {
				chart: {
					height: 70,
					type: "line",
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false
					},
					sparkline: {
						enabled: true
					}
				},
				colors:['#FB3E7A'],
				dataLabels: {
					enabled: false
				},
					
				legend:{
					show:false
				},
				stroke: {
					show: true,
					width: 6,
					curve:'smooth',
					colors:['#FB3E7A'],
				},
				grid:{
					show:false,
					borderColor: '#eee',
					padding: {
						top: 0,
						right: 0,
						bottom: 0,
						left: 0

					}
				},
				states: {
					normal: {
						filter: {
							type: 'none',
							value: 0
						}
					},
					hover: {
						filter: {
							type: 'none',
							value: 0
						}
					},
					active: {
						allowMultipleDataPointsSelection: false,
						filter: {
							type: 'none',
							value: 0
						}
					},
				},	
				xaxis: {
					categories: ['Jan', 'feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',],
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false
					},
					labels: {
						show: false,
						style: {
							fontSize: '12px',
						}
					},
					crosshairs: {
						show: false,
						position: 'front',
						stroke: {
							width: 1,
							dashArray: 3
						}
					},
					tooltip: {
						enabled: true,
						formatter: undefined,
						offsetY: 0,
						style: {
							fontSize: '12px',
						}
					}
				},
				yaxis: {
					show: false,
				},
				fill: {
					opacity: 1,
					colors:'#FAC7B6'
				},
				
				tooltip: {
					style: {
						fontSize: '12px',
					},
					y: {
						formatter: function(val) {
							return "$" + val + " thousands"
						}
					}
				},
			
			},
		};
	}

	render() {
		return (
			<div id="chart">
				<ReactApexChart
				  options={this.state.options}
				  series={this.state.series}
				  type="line"
				  height={70}
				/>
			</div>
		);
	}
}

export default RevenueLineApex;