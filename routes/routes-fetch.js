const moment = require('moment');
const database = require('../data/database');
const util = require('../util');

module.exports = app => {
	app.get('/fetch/artists', async (req, res, next) => {
		const data = await database.select(`select * from music.artist order by name`);
		res.json(data[0]);
	});

	app.get('/fetch/artists/:id/songs/charts', async (req, res, next) => {
		const artistId = req.params.id;
		if (!artistId || !util.isValidUuid(artistId)) return res.sendStatus(400);
		const data = await database.select(`select * from chart_view where artist_id = '${artistId}' order by song_id, date`);
		const songs = {};
		let minDate, maxDate;
		data[0].forEach(chartWeek => {
			if (!minDate || chartWeek.date < minDate) minDate = chartWeek.date;
			if (!maxDate || chartWeek.date > maxDate) maxDate = chartWeek.date;
			if (!songs[chartWeek.song_id]) songs[chartWeek.song_id] = [];
			songs[chartWeek.song_id].push(chartWeek);
		});
		
		const min = moment(minDate);
		const max = moment(maxDate);
		const dates = [ min.toDate() ];

		do {
			min.add(1, 'week');
			if (min <= max) dates.push(min.toDate());
		} while (min <= max);

		res.json({ dates, charts: Object.values(songs)} );
	});

	app.get('/fetch/artists/:id/songs', async (req, res, next) => {
		const artistId = req.params.id;
		if (!artistId || !util.isValidUuid(artistId)) return res.sendStatus(400);
		const data = await database.select(
			`select * from music.artist_song_view where artist_id = '${req.params.id}' order by song_title`);
		res.json(data[0]);
	});

	app.get('/fetch/songs/:id/charts', async (req, res, next) => {
		const songId = req.params.id;
		if (!songId || !util.isValidUuid(songId)) return res.sendStatus(400);
		const data = await database.select(`select * from chart_view where song_id = '${songId}' order by date`);
		res.json(data[0]);
	});
};