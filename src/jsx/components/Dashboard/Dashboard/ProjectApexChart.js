import React from "react";
import ReactApexChart from "react-apexcharts";

class ProjectApexChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [
				{
					name: 'Running',
					data: [50, 18, 70, 40, 90, 70, 20],
					//radius: 12,	
				}, 
				{
				  name: 'Cycling',
				  data: [80, 40, 55, 20, 45, 30, 80]
				}, 
				
			],
			options: {
				chart: {
					height: 400,
					type: "bar",
					toolbar: {
						show: false,
					},
					
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '57%',
						endingShape: "rounded",
						borderRadius: 12,
					},			
				},
				//colors:['var(--primary)'],
				colors:['#FFA26D', '#FF5ED2'],

				dataLabels: {
					enabled: false,
				},
				markers: {
					shape: "circle",
				},
				
				legend: {
					show: false,
					fontSize: '12px',
					labels: {
						colors: '#000000',
						
						},
					markers: {
					width: 18,
					height: 18,
					strokeWidth: 10,
					strokeColor: '#fff',
					fillColors: undefined,
					radius: 12,	
					}
				},
				stroke: {
					show: true,
					width: 4,
					curve: 'smooth',
					lineCap: 'round',
					colors: ['transparent']
				},
				grid: {
					borderColor: '#eee',
				},
				xaxis: {
					position: 'bottom',
					categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					labels: {
					   style: {
						  colors: '#787878',
						  fontSize: '13px',
						  fontFamily: 'poppins',
						  fontWeight: 100,
						  cssClass: 'apexcharts-xaxis-label',
						},
					},
					crosshairs: {
						show: false,
					}
				},
				yaxis: {
					labels: {
						offsetX:-16,
						style: {
							colors: '#787878',
							fontSize: '13px',
							fontFamily: 'poppins',
							fontWeight: 100,
							cssClass: 'apexcharts-xaxis-label',
						},
					},
				},
				fill: {
					type: 'gradient',
					gradient: {
						shade: 'white',
						type: "vertical",
						shadeIntensity: 0.2,
						gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
						inverseColors: true,
						opacityFrom: 1,
						opacityTo: 1,
						stops: [0, 50, 50],
						colorStops: []
					}
				}, 
				tooltip: {
					y: {
						formatter: function (val) {
						  return "$ " + val + " thousands"
						}
					}
				},
			
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
				  height={400}
				/>
			</div>
		);
	}
}

export default ProjectApexChart;