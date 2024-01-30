const database = require('../data/database');
const models = require('../data/models');
const util = require('../util');

module.exports = app => {
	app.get('/songsByArtist', async (req, res, next) => {
//		const r = await database.selectAll(models.Song,
//			{ include: { model: models.Artist, as: 'artist'  } });
		if (!util.isValidUuid(req.query.artistId)) return res.sendStatus(400);
		const data = await database.select(
			`select * from music.artist_song_view where artist_id = '${req.query.artistId}'`);
		res.json(data[0]);
	});

	app.get('/artists', async (req, res, next) => {
		//		const r = await database.selectAll(models.Song,
		//			{ include: { model: models.Artist, as: 'artist'  } });
		const data = await database.select(`select * from music.artist order by name`);
		res.json(data[0]);
	});
};
