import React from "react";
import ReactApexChart from "react-apexcharts";

class EmailChartApex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [27, 11, 22,15,25],
			options: {
				chart: {
					type: 'donut',
					height: 300,					
				},
				dataLabels:{
					enabled: false
				},
				stroke: {
					width: 0,
				},
				colors:['var(--primary)', '#26E023', '#61CFF1','#FFDA7C','#FF86B1'],
				legend: {
					position: 'bottom',
					show:false
				},
				responsive: [{
					breakpoint: 1800,
					options: {
						chart: {
							height:200
						},
					}
				},
				{
					breakpoint: 1800,
					options: {
						chart: {
							height:200
						},
					}
				}]	
			},
		};
	}

	render() {
		return (
			<div id="chart" >
				<ReactApexChart
					options={this.state.options}
					series={this.state.series}
					type="donut"
					height={300}
				/>
			</div>
		);
	}
}

export default EmailChartApex;