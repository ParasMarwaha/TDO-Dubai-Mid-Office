import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

class CanvasRevenue extends Component {
   render() {
		const data = {
			defaultFontFamily: 'Poppins',
			labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec","Jan"],
			datasets: [
				{
					label: "My First dataset",
					data: [15, 40, 55, 40, 25, 35, 40, 50, 85, 95, 54, 35,15],
					borderColor: '#13B497',
					borderWidth: "0",
					backgroundColor: ['#FB3E7A','#0E8A74','#FB3E7A','#0E8A74','#FB3E7A','#0E8A74','#FB3E7A','#0E8A74','#FB3E7A','#0E8A74','#FB3E7A','#0E8A74','#FB3E7A','#0E8A74','#FB3E7A','#0E8A74','#FB3E7A','#0E8A74','#FB3E7A','#0E8A74',], 
					hoverBackgroundColor: '#13B497',
					barThickness: 5
				}
			]
		};
		const options = {
			plugins:{
				legend: false
			},
			responsive: true, 
			maintainAspectRatio: false,  
			scales: {
				
				y: {
					min: 0, 
					max: 100, 
					display: false, 
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
				x:{
					display: false, 
					barPercentage: 0.4, 
					grid: {
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
			<div className="chart-w2">
				<Bar data={data} height={85} options={options} />
			</div>	
         </>
      );
   }
}

export default CanvasRevenue;