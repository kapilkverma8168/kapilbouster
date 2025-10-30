import React from "react";
import ReactApexChart from "react-apexcharts";

class ClientsColumnChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [
				{
				name: 'Aplication Sent',
				data: [40, 55, 15,55]
				}, 
				{
					name: 'Appllication Answered',
					data: [40, 55, 35,55]
				},
				{
					name: 'Hired',
					data: [40, 17, 55, 55]
				} 
			],
			options: {
				chart: {
					height: 150,
					type: "bar",
					stacked: true,
					toolbar: {
						show: false,
					},
					
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '20%',
						
						endingShape: "rounded",
						startingShape: "rounded",
						backgroundRadius: 20,
						colors: {
							backgroundBarColors: ['#ECECEC', '#ECECEC', '#ECECEC', '#ECECEC'],
							backgroundBarOpacity: 1,
							backgroundBarRadius: 10,
						},
					},			
				},
				//colors:['var(--primary)'],
				colors:['#ECECEC', '#886CC0', '#886CC0'],
				
				xaxis: {
					show: false,
					axisBorder: {
						show: false,
					},
					axisTicks:{
						show: false,
					},
					labels: {
						show: false,
						style: {
							colors: '#828282',
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 'light',
							cssClass: 'apexcharts-xaxis-label',
						},
					},
					
					crosshairs: {
						show: false,
					},
					
					categories: ['Sun', 'Mon', 'Tue'],
				},
				
				yaxis: {
					show: false
				},
				grid: {
					show: false,
				},
				toolbar: {
					enabled: false,
				},
				dataLabels: {
				  enabled: false
				},
				legend: {
					show:false
				},
				fill: {
					opacity: 1
				},
				responsive: [{
					breakpoint: 480,
					options: {
						legend: {
							position: 'bottom',
							offsetX: -10,
							offsetY: 0
						}
					}
				}],
				
			
			},
		};
	}

	render() {
		return (
			<div id="chart" >
				<ReactApexChart
				  options={this.state.options}
				  series={this.state.series}
				  type="bar"
				  height={150}
				/>
			</div>
		);
	}
}

export default ClientsColumnChart;