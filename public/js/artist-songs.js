let currentChart;

$(document).ready(function() {
	fetchArtists(artistId);
	fetchChartDates();
	$('#artists').on('change', () => selectArtist());
	if (artistId) getSongs(artistId);
});

const selectArtist = () => {
	const artistId = $('#artists').val();
	getSongs(artistId);
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
				borderColor: '#1880e7',
				clip: false,
				tension: 0.1,
				pointRadius: 10,
				pointBackgroundColor: '#1880e7'
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
				plugins: {
					legend: {
						position: 'top',
					},
					title: {
						display: false,
						text: json[0].artist_name,
						color: '#1880e7',
						font: {
							size: 24,
							family: 'Rubik,sans-serif',
							weight: 500
						}
					},
					datalabels: {
						color: 'black',
						font: {
							size: 12,
							family: 'Rubik,sans-serif',
							weight: 'bold'
						},
						align: ctx => (json.length > 1 && ctx.dataIndex === json.length - 1) ? 'left' : 'right',
						offset: 15,
						formatter: (value, ctx) => json[ctx.dataIndex].song_title,
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
