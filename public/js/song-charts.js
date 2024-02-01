let currentChart;
let otherSongs = {};

$(document).ready(function() {
	fetchArtists();
	fetchChartDates();
	$('#artists').on('change', () => {
		const artistId = $('#artists').val();
		location.href = `/artists/${artistId}/songs`;
	});
	$('#artist-other-songs').on('change', () => {
		getCharts($('#artist-other-songs').val());
		$('#artist-other-songs').val('');
	});
	if (songId) getCharts(songId);
});

const getCharts = songId => {
	if (!songId) return;
	fetch(`/fetch/songs/${songId}/charts`)
	.then(res => {
		if (!res.ok) throw new Error(res.statusText);
		return res.json();
	})
	.then(json => {
		fetch(`/fetch/artists/${json[0].artist_id}/songs`)
			.then(res => {
				if (!res.ok) throw new Error(res.statusText);
				return res.json();
			})
			.then(songs => {
				if ($('#artist-other-songs').children().length === 0) {
					$('#artist-other-songs').append(`<option value="">Other songs by ${json[0].artist_name}</option>`);
					otherSongs = {};
					songs.forEach(song => {
						otherSongs[song.song_id] = song.song_title;
						$('#artist-other-songs').append(`<option value="${song.song_id}">${song.song_title} (#${song.peak_position}, ${song.first_week.substring(0, 4)})</option>`);
					})
				}
				$('#songTitle').text(`"${otherSongs[songId]}"`);
				if (songs.length <= 1) {
					$('#artist-other-songs-container').hide();
				} else {
					$('#artist-other-songs-all').html(json[0].artist_name);
					$('#artist-other-songs-container').show();
				}
			})
			.catch(err => {
				console.error(err);
			});
		
		//$('#header').html(`"${json[0].song_title}" by ${json[0].artist_name}`);
		if (currentChart) currentChart.destroy();
		Chart.register(ChartDataLabels);
		const data = {
			labels: json.map(song => song.date.substring(0, 10)),
			datasets: [{
				label: 'Chart Position',
				data: json.map(song => song.position),
				borderColor: '#a8cff7',
				clip: false,
				tension: 0.1,
				pointRadius: 5,
				pointBackgroundColor: '#1880e7',
				pointBorderColor: '#1469be',
				pointHoverRadius: 10,
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
					if (points.length) location.href = `/charts/${json[points[0].index].date.substring(0, 10)}`;
				},
				plugins: {
					legend: {
						position: 'top',
						labels: {
							color: 'black',
							font: {
								family: 'Rubik,sans-serif',
								size: 13,
								weight: 500
							}
						}
					},
					datalabels: {
						color: 'black',
						font: {
							size: 16,
							family: 'Rubik,sans-serif',
							weight: 500
						},
						align: 'bottom',
						offset: 10,
						formatter: (value, ctx) => json[ctx.dataIndex].position,
						listeners: {
							click: (ctx, event) => location.href = `/charts/${json[ctx.dataIndex].date.substring(0, 10)}`
						}
					}
				},
				tooltip: {
					yAlign: 'bottom'
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
