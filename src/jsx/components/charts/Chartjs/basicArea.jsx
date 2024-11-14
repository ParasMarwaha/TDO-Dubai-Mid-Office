import React, { Component } from "react";
import { Line } from "react-chartjs-2";

const data = {
	defaultFontFamily: "Poppins",
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
	datasets: [
		{
		  label: "My First dataset",
		  data: [25, 20, 60, 41, 66, 45, 80],
		  borderColor: "rgba(14, 138, 116,1)",
		  borderWidth: "1",
		  backgroundColor: "rgba(14, 138, 116, .5)",
		  pointBackgroundColor: "rgba(14, 138, 116, .3)",
		  tension:0.4,
		  fill:true
		  
		},
	],
};

const options = {
  plugins:{
	  legend: false,
  },
  scales: {
    y: 
      {
         min: 0,	
		max: 100,
        ticks: {
          beginAtZero: true,
          
          stepSize: 20,
          padding: 10,
        },
      },
    x: 
      {
        ticks: {
          padding: 5,
        },
      },
    
  },
};
class BasicArea extends Component {
  render() {
    return <Line data={data} options={options} height={150} />;
  }
}

export default BasicArea;
