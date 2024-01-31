$(document).ready(function() {
	fetchChartDates(chartId);
	fetchArtists();
	$('#artists').on('change', () => {
		const artistId = $('#artists').val()
		location.href = `/artists/${artistId}/songs`;
	});
	$('header').css('visibility', 'visible');
	$('footer').css('visibility', 'visible');
});