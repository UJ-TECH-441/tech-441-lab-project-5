const database = require('../data/database');
const util = require('../util');

module.exports = app => {
	app.get('/songs/:id/charts', async (req, res, next) => {
		const data = await database.select(`select artist_id from song where id='${req.params.id}'`);
		if (data[0].length === 0) return res.sendStatus(404);
		res.render('song-charts', {
			songId: req.params.id,
			artistId: data[0][0].artist_id
		});
	});

	app.get('/fetch/songs/:id/charts', async (req, res, next) => {
		const songId = req.params.id;
		if (!songId || !util.isValidUuid(songId)) return res.sendStatus(400);
		const data = await database.select(`select * from chart_view where song_id = '${songId}' order by date`);
		if (data[0].length === 0) return res.sendStatus(404);
		res.json(data[0]);
	});
};
