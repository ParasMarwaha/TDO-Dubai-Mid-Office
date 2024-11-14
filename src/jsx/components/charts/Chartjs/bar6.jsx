import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

class BarChart6 extends Component {
  render() {
    const data = {
      defaultFontFamily: "Poppins",
      labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Orange",
          backgroundColor: "rgba(255, 53, 121, 1)",
          hoverBackgroundColor: "rgba(255, 53, 121, 1)",
          data: ["12", "12", "12", "12", "12", "12", "12"],
          barPercentage: 0.5
        },
        {
          label: "Glacier",
          backgroundColor: "rgba(14, 138, 116, 1)",
          hoverBackgroundColor: "rgba(14, 138, 116, 1)",
          data: ["12", "12", "12", "12", "12", "12", "12"],
          barPercentage: 0.5
        },
        {
          label: "Red",
          backgroundColor: "rgba(235, 100, 29, 1)",
          hoverBackgroundColor: "rgba(235, 100, 29, 1)",
          data: ["12", "12", "12", "12", "12", "12", "12"],
          barPercentage: 0.5
        },
      ],
    };
    const options = {
      plugins:{
		  legend: {
			display: false,
		  },
		  title: {
			display: false,
		  },
		  tooltips: {
			mode: "index",
			intersect: false,
		  },
		  responsive: true,
	  },
      scales: {
        x:
          {
            stacked: true,
          },
        y:
          {
            stacked: true,
          },
      },
    };

    return (
      <>
        <Bar data={data} height={150} options={options} />
      </>
    );
  }
}

export default BarChart6;
