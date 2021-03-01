var randomScalingFactor = function () {
	return Math.round(Math.random() * 5);
};

let bgSet = {
	label: false,
	backgroundColor: 'rgba(93,164,248, .16)',
	borderColor: 'rgba(93,164,248, 0)',
	pointBackgroundColor: 'transparent',
	lineTension: .4,
	tooltips: false,
}

var color = Chart.helpers.color;
var config = {
	type: 'radar',
	data: {
		labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
		datasets: [
			{
				...bgSet,
				data: [
					5,
					5,
					5,
					5,
					5,
					5,
					5,
					5,
					5,
					5,
					5,
					5,
				]
			},
			{
				...bgSet,
				data: [
					4,
					4,
					4,
					4,
					4,
					4,
					4,
					4,
					4,
					4,
					4,
					4,
				]
			},
			{
				...bgSet,
				data: [
					3,
					3,
					3,
					3,
					3,
					3,
					3,
					3,
					3,
					3,
					3,
					3,
				]
			},
			{
				...bgSet,
				data: [
					2,
					2,
					2,
					2,
					2,
					2,
					2,
					2,
					2,
					2,
					2,
					2,
				]
			},
			{
				...bgSet,
				data: [
					1,
					1,
					1,
					1,
					1,
					1,
					1,
					1,
					1,
					1,
					1,
					1,
				]
			},
			{
				label: false,
				backgroundColor: 'rgba(93,164,248, .8)',
				borderColor: 'rgba(93,164,248, 0)',
				pointBackgroundColor: 'transparent',
				lineTension: .4,
				tooltips: false,
				data: [
					2,
					2,
					1,
					2,
					2,
					2,
					1,
					0,
					2,
					2,
					1,
					2,

				]
			},
			{
				tooltips: false,
				lineTension: .1,
				label: false,
				backgroundColor: 'transparent',
				borderColor: '#4C9464',
				pointBackgroundColor: 'transparent',
				data: [
					1,
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
				]
			},
		]
	},
	options: {
		maintainAspectRatio: false,
		elements: {
			point: {
				display: false,
				radius: 0
			}
		},
		legend: {
			display: false,
			// position: 'top',
		},
		title: {
			display: false,
		},
		scale: {
			spanGaps: true,
			angleLines: {
				// display: false
				color: '#4396f7'
			},
			ticks: {
				color: '#4396f7',
				max: 5,
				min: 0,
				stepSize: 1
				// display: false
				// beginAtZero: true
			}
		}
	}
};

window.onload = function () {
	window.myRadar = new Chart(document.getElementById('canvas'), config);

	$('.tooltip').tooltipster();
};
