import React from "react";
import ReactApexChart from "react-apexcharts";

class CompletionApexChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [
				{
					name: 'Net Profit',
					data: [20, 40, 20, 30, 50, 40, 60,],
					//radius: 12,	
				}, 
			],
			options: {
				chart: {
					height: 300,
					type: "line",
					toolbar: {
						show: false,
					},
					
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '70%',
						endingShape: 'rounded'
					},			
				},
				//colors:['var(--primary)'],
				colors:['#886CC0'],

				dataLabels: {
					enabled: false,
				},
				markers: {
					shape: "circle",
				},
				
				legend: {
					show: false,
				},
				stroke: {
					show: true,
					width: 10,
					curve:'smooth',
					colors:['var(--primary)'],
				},
				grid: {
					borderColor: '#eee',
					show: true,
					 xaxis: {
						lines: {
							show: true,
						}
					},  
					 yaxis: {
						lines: {
							show: false,
						}
					},  
				},
				xaxis: {
				
					categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
					labels: {
						style: {
							colors: '#7E7F80',
							fontSize: '13px',
							fontFamily: 'Poppins',
							fontWeight: 100,
							cssClass: 'apexcharts-xaxis-label',
						},
					},
					crosshairs: {
						show: false,
					 }
				},
				yaxis: {
					show:true,	
					labels: {
						offsetX: -15,
						style: {
							colors: '#7E7F80',
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 100,
						},
						formatter: function (y) {
						  return y.toFixed(0) + "k";
						}
					},
				},
				fill: {
					opacity: 1,
					colors:'#FAC7B6'
				},
				tooltip: {
					y: {
						formatter: function (val) {
						  return "$ " + val + " hundred"
						}
					}
				}			
			},
		};
	}

	render() {
		return (
			<div id="chart" >
				<ReactApexChart
				  options={this.state.options}
				  series={this.state.series}
				  type="line"
				  height={300}
				/>
			</div>
		);
	}
}

export default CompletionApexChart;