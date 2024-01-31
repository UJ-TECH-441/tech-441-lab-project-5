const fetchChartDates = chartId => {
	fetch('/fetch/charts/dates')
		.then(res => res.json())
		.then(json => {
			$('#chart-date').append(`<option value="">Select chart date</option>`);
			json.forEach(row => {
				$('#chart-date').append(`<option value="${row.id}">${row.date}</option>`);
			})
			if (chartId) $('#chart-date').val(chartId);
		})
		.catch(err => console.error(err));
	$('#chart-date').on('change', event => {
		$('#chart-date > option').each((index, option) => {
			if (option.value === event.target.value) {
				location.href = `/charts/${option.text}`;
			}
		});
	});
}

const fetchArtists = artistId => {
	fetch('/fetch/artists')
		.then(res => res.json())
		.then(json => {
			$('#artists').append(`<option value="">Select artist</option>`);
			json.forEach(artist => {
				$('#artists').append(`<option value="${artist.id}">${artist.name}</option>`);
			})
			if (artistId) $('#artists').val(artistId);
		})
		.catch(err => console.error(err));
}
