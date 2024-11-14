import React from "react";
import { Bar } from "react-chartjs-2";

class SalesCanvas extends React.Component {
	render() {
      const data = {
			defaultFontFamily: "Poppins",
			labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
			datasets: [
				{
					label: "My First dataset",
					data: [15, 40, 55, 40, 25, 35, 40, 50, 85, 95],
					borderColor: '#FE634E',
					borderWidth: "0",
					backgroundColor: '#FE634E', 
					hoverBackgroundColor: '#FE634E',
					barThickness:10
				}
			]
		};
		const options = {
			plugins:{
				legend: false,
			},
			responsive: true, 
			barRoundness: 1,
			maintainAspectRatio: false,   
			scales: {
				y: {
					display: false, 
					max: 100, 
					min: 0, 
					beginAtZero: true, 
					ticks: {
						display: false, 
						stepSize: 10
					}, 
					grid: {
						display: false, 
						drawBorder: false
					}
				},
				x: {
					display: false, 
					barPercentage: 0.4, 
					gridLines: {
						display: false, 
						drawBorder: false
					}, 
					ticks: {
						display: false
					}
				}
			}
		};

      return (
         <>
            <Bar data={data} height={60} options={options} />
         </>
      );
   }
}

export default SalesCanvas;