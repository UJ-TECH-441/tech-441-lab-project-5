$(document).ready(function() {
	fetchArtists();
	fetchChartDates();
	$('#artists').on('change', () => {
		const artistId = $('#artists').val();
		location.href = `/artists/${artistId}/songs`;
	});
});
