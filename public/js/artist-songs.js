let currentChart;

$(document).ready(function() {
	fetchArtists(artistId);
	fetchChartDates();
	$('#artists').on('change', () => selectArtist());
	if (artistId) getSongs(artistId);
});

const selectArtist = () => {
	const artistId = $('#artists').val();
	location.href = `/artists/${artistId}/songs`;
}

const getSongs = artistId => {
	if (!artistId) return;
	fetch(`/fetch/artists/${artistId}/songs`)
	.then(res => {
		if (!res.ok) throw new Error(res.statusText);
		return res.json();
	})
	.then(json => {
		$('.title').html(`${json[0].artist_name}: Chart Performance`);
		if (currentChart) currentChart.destroy();
		Chart.register(ChartDataLabels);
		const labels = json.map(song => song.peak_week.substring(0, 10));
		const data = {
			labels: json.map(song => song.peak_week.substring(0, 10)),
			datasets: [{
				label: 'Chart Position',
				data: json.map(song => song.peak_position),
				borderColor: '#a8cff7',
				clip: false,
				pointRadius: 7,
				pointBackgroundColor: '#1880e7',
				pointBorderColor: '#1469be',
				pointHoverRadius: 12,
				pointHoverBackgroundColor: '#ffcc00',
				pointHoverBorderColor: '#eabb00'
			}],
		};

		const config = {
			type: 'line',
			data,
			options: {
				responsive: true,
				animation: {
					onComplete: () => {
						$('header').css('visibility', 'visible');
						$('footer').css('visibility', 'visible');
					}
				},
				onClick: event => {
					const points = currentChart.getElementsAtEventForMode(event, 'nearest', {intersect: true}, true);
					if (points.length) location.href = `/songs/${json[points[0].index].song_id}/charts`;
				},
				plugins: {
					legend: {
						position: 'top',
						labels: {
							color: 'black',
							font: {
								family: 'Rubik,sans-serif',
								size: 13,
								weight: 600
							}
						}
					},
					title: {
						display: false,
						text: json[0].artist_name,
						color: '#1880e7',
						font: {
							size: 24,
							family: 'Rubik,sans-serif',
							weight: 600
						}
					},
					datalabels: {
						color: 'black',
						font: {
							size: 16,
							family: 'Rubik,sans-serif',
							weight: 600
						},
						rotation: 0,
						align: ctx => ctx.dataIndex === 0 ? 'right' :
							(json.length > 1 && ctx.dataIndex === json.length - 1) ? 'left' : 'bottom',
						offset: 10,
						formatter: (value, ctx) => {
							let title = json[ctx.dataIndex].song_title;
							if (title.length >= 8) title = title.replace(/^(.{8}\w*)\s/, '$1\n');
							return `#${json[ctx.dataIndex].peak_position} ${title}`;
						},
						listeners: {
							click: (ctx, event) =>
								location.href = `/songs/${json[ctx.dataIndex].song_id}/charts`
						}
					}
				},
				scales: {
					x: {
						ticks: {
							color: 'black',
							font: {
								family: 'Rubik,sans-serif',
								size: 16,
								weight: 'bold'
							}
						}
					},
					y: {
						min: 1,
						max: 100,
						reverse: true,
						ticks: {
							stepSize: 5,
							color: 'black',
							font: {
								family: 'Rubik,sans-serif',
								size: 16,
								weight: 'bold'
							}
						}
					}
				}
			},
		};

		currentChart = new Chart($('#chartjs-canvas'), config);
	})
	.catch(err => {
		console.error(err);
	});
};
