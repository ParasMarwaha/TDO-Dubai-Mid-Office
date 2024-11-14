import React from "react";
import ReactApexChart from "react-apexcharts";

class DountApexChart1 extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
		series: [45, 25, 30],
		options: {
			chart: {
			  type: "donut",
			},
		
			legend: {
			  show: false,
			},
			plotOptions: {
				pie: {
					donut: {
					  size: "30%",
					},
				},				
			},
			stroke: {
			  width: "10",
			},
			dataLabels: {
			  formatter(val, opts) {
				
				return [val.toFixed() + "%"];
			  },
			  dropShadow: {
				enabled: false,
			  },
			  style: {
				fontSize: "15px",
				colors: ["#fff"],
			  },
			},
			colors:['#0E8A74','#FB3E7A','#C8C8C8'],
			responsive: [{
				breakpoint: 1600,
				options: {
				  chart: {
					height: 200
				  },
				}
			}] 
		},
    };
}

  render() {
    return (
		<div id="donutChart2" className="donutChart2 d-inline-block">
		  <ReactApexChart
			options={this.state.options}
			series={this.state.series}
			type="donut"
			height="225px"
		  />
		 </div> 
    );
  }
}

export default DountApexChart1;