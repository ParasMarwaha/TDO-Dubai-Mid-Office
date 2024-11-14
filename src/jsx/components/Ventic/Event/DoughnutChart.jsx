import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class DoughnutChart extends Component {
   render() {
		const data = {
			weight: 5,	
			defaultFontFamily: 'Poppins',
			datasets: [{
				data: [35, 25, 25],
				borderWidth: 3, 
				borderColor: "rgba(255,255,255,1)",
				backgroundColor: [
					"rgba(251, 62, 122, 1)",
					"rgba(14, 138, 116, 1)",
					"rgba(255, 123, 49, 1)"
				],
				hoverBackgroundColor: [
					"rgba(251, 62, 122, 0.5)",
					"rgba(14, 138, 116, 0.5)",
					"rgba(255, 123, 49, 0.5)"
				]

			}],
		};
		const options = {
			weight: 1,	
			cutout: "60%",
			//cutoutPercentage: 60,
			responsive: true,
			maintainAspectRatio: false
		};

      return (
         <>
            <Doughnut data={data} height={100} options={options} />
         </>
      );
   }
}

export default DoughnutChart;