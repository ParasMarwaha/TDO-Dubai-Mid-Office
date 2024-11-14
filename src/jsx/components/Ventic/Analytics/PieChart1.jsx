import React from 'react';
import ReactApexChart from "react-apexcharts";

class PieChart1 extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
		series: [35, 55, 10],
		options: {
			chart: {
				type: 'donut',
				width:300,
			},
			dataLabels: {
			  enabled: false
			},
			stroke: {
			  width: 7,
			},
			colors:['#0E8A74', '#FB3E7A', '#C8C8C8'],
			legend: {
              position: 'bottom',
			  show:false
            },
			responsive: [{
			  breakpoint: 1600,
				options: {
					chart: {
						width: 200
					},
					legend: {
						position: 'bottom',
						show:false
					}
				}
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
				type="donut"
			/>
		</div> 
    );
  }
}
export default PieChart1;