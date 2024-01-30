let currentChart;

$(document).ready(function() {
	$('#artists').on('change', () => selectArtist());
	fetch('/artists')
		.then(res => res.json())
		.then(json => {
			$('#artists').append(`<option value="">Select artist</option>`);
			json.forEach(artist => {
				$('#artists').append(`<option value="${artist.id}">${artist.name}</option>`);
			})
		})
		.catch(err => console.error(err));
});

const selectArtist = () => {
	const artistId = $('#artists').val();
	getSongs(artistId);
}

const getSongs = artistId => {
	fetch(`/songsByArtist?artistId=${artistId}`)
	.then(res => {
		if (!res.ok) throw new Error(res.statusText);
		return res.json();
	})
	.then(json => {
		if (currentChart) currentChart.destroy();
		Chart.register(ChartDataLabels);
		const data = {
			labels: json.map(song => song.first_week.substring(0, 10)),
			datasets: [{
				label: 'Chart Position',
				data: json.map(song => song.peak_position),
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
				pointRadius: 10,
				pointBackgroundColor: 'rgb(75, 192, 192)'
			}],
		};

		const config = {
			type: 'line',
			data,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: json[0].artist_name,
						font: {
							size: 20,
							family: 'Rubik,sans-serif',
							weight: 'bold'
						}
					},
					datalabels: {
						color: 'black',
						font: {
							size: 14,
							family: 'Rubik,sans-serif',
							weight: 'bold'
						},
						align: ctx => json.length > 1 && ctx.dataIndex === json.length - 1 ? 'left' : 'right',
						offset: 15,
						formatter: (value, ctx) => json[ctx.dataIndex].song_title
					}
				},
				scales: {
					x: {
						ticks: {
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
							//color: ctx => ctx.tick?.value <= 40 ? 'rgb(0, 157, 0)' : 'black',
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

		currentChart = new Chart($('#chart'), config);
	})
	.catch(err => {
		console.error(err);
	});
};
