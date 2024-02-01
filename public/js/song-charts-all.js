let currentChart;

$(document).ready(function() {
	fetchArtists();
	fetchChartDates();
	$('#artists').on('change', () => {
		const artistId = $('#artists').val();
		location.href = `/artists/${artistId}/songs`;
	});
	if (artistId) getCharts(artistId);
});

const getCharts = artistId => {
	if (!artistId) return;
	fetch(`/fetch/artists/${artistId}/songs/charts`)
	.then(res => {
		if (!res.ok) throw new Error(res.statusText);
		return res.json();
	})
	.then(json => {
		$('.title').html(`All songs by ${json.charts[0][0].artist_name}`);
		if (currentChart) currentChart.destroy();
		Chart.register(ChartDataLabels);
		const data = {
			labels: json.dates.map(date => date.substring(0, 10)),
			datasets: json.charts.map(song => {
				const data = {};
				console.log(song);
				song.forEach(song  => data[song.date.substring(0, 10)] = song.position);
				return {
					label: song[0].song_title,
					data,
					clip: false,
					tension: 0.1,
					pointRadius: 5
				};
			})
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
				plugins: {
					legend: {
						position: 'top',
						maxWidth: 300,
						onClick: (event, legendItem, legend) => {
							const songId = json.charts[legendItem.datasetIndex][0].song_id;
							location.href = `/songs/${songId}/charts`;
						}
					},
					datalabels: {
						color: 'black',
						font: {
							size: 14,
							family: 'Rubik,sans-serif',
							weight: 'bold'
						},
						align: 'bottom',
						offset: 10
					}
				},
				scales: {
					x: {
						ticks: {
							color: 'black',
							stepSize: 1,
							font: {
								family: 'Rubik,sans-serif',
								size: 12,
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
