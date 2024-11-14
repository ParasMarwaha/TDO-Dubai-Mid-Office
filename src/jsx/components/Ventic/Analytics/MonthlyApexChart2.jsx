import React from 'react';
import ReactApexChart from "react-apexcharts";

class MonthlyApexChart2 extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
		series: [
			{
				name: 'Net Profit',
				data: [500, 600, 500, 600, 500, 600, 500, 600,500, 600,500,300],
				//radius: 12,	
			}, 				
		],
		options: {
			chart: {
				type: "area",
				height: 75,
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
			colors:['#0E8A74'],
			dataLabels: {
			  enabled: false,
			},
			markers: {
				shape: "circle",
				colors:['#FB3E7A'],
				hover: {
				  size: 10,
				}
			},
			legend: {
				show: false,
			},
			stroke: {
			  show: true,
			  width: 3,
			  curve:'smooth',
			  colors:['#0E8A74'],
			},
			grid: {
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
                }
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
				type:"solid",
				opacity: 1,
				colors:'#0E8A74'
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
			}
		},
    };
}

  render() {
    return (
		<div id="chart">
		  <ReactApexChart
			options={this.state.options}
			series={this.state.series}
			type="area"
			height="75px"
		  />
		 </div> 
    );
  }
}
export default MonthlyApexChart2;