import React from 'react';
import ReactApexChart from "react-apexcharts";

class SalesApexChart1 extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
			series: [
			{
				name: 'Net Profit',
				data: [100,200, 100, 300, 200, 400, 200, 300,100],
				//radius: 12,	
			}, 				
		],
		options: {
			chart: {
				type: 'line',
				height: 380,
				toolbar: {
					show: false,
				},
			},
			colors:['#0E8A74'],
			dataLabels: {
			  enabled: false,
			},
			legend: {
			  show: false,
			},
			stroke: {
			  show: true,
			  width: 6,
			  curve:'smooth',
			  colors:['#0E8A74'],
			},
			grid: {
				show:true,
				borderColor: '#C8C8C8',
				strokeDashArray: 4,
				padding: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0

				}
			},
			
			xaxis: {
				categories: ['Jan', 'feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct'],
				axisBorder: {
					show: true,
				},
				axisTicks: {
					show: true
				},
				labels: {
					show: true,
					style: {
						fontSize: '14px',
						colors: '#a4a7ab',
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
				show: true,
				labels:{
					offsetX:-10,
					formatter: function (value) {
					  return value + "k";
					},
					style: {
						fontSize: '14px',
						colors: '#a4a7ab',
					}
				}
			},
			fill: {
			  opacity: 1,
			  colors:'#FB3E7A'
			},
			tooltip: {
				style: {
					fontSize: '12px',
				},
				y: {
					formatter: function(val) {
						return "k" + val + " thousands"
					}
				}
			},
						
			responsive: [{
				breakpoint: 575,
				options: {
					chart: {
						height:250,
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
			type="line"
			 height="380px"
		  />
		 </div> 
    );
  }
}
export default SalesApexChart1;