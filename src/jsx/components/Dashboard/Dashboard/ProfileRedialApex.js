import React from "react";
import ReactApexChart from "react-apexcharts";

class ProfileRedialApex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [70],
			options: {
				chart: {
					type: 'radialBar',
					offsetY: 0,
					height:350,
					sparkline: {
						enabled: true
					}
				},
				plotOptions: {
					radialBar: {
						startAngle: -130,
						endAngle: 130,
						track: {
							background: "#F1EAFF",
							strokeWidth: '100%',
							margin: 5,
						},
					
						hollow: {
							margin: 30,
							size: '45%',
							background: '#F1EAFF',
							image: undefined,
							imageOffsetX: 0,
							imageOffsetY: 0,
							position: 'front',
						},
						dataLabels: {
							name: {
								show: false
							},
							value: {
								offsetY: 5,
								fontSize: '22px',
								color:'#886CC0',
								fontWeight:700,
							}
						}
					}	
				},	
				grid: {
					padding: {
						top: -10
					}
				},
				fill: {
					type: 'gradient',
					colors:'#FF63E6',
					gradient: {
						  shade: 'white',
						  shadeIntensity: 0.15,
						  inverseColors: false,
						  opacityFrom: 1,
						  opacityTo: 1,
						  stops: [0, 50, 65, 91]
					},
				},
				labels: ['Average Results'],
				responsive: [{
					breakpoint: 1600,
					options: {
						chart: {
							height:250
						},
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
				  type="radialBar"
				  height={350}
				/>
			</div>
		);
	}
}

export default ProfileRedialApex;