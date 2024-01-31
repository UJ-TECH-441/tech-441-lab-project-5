const database = require('../data/database');
const util = require('../util');

module.exports = app => {
	app.get('/charts/:date', async (req, res, next) => {
		if (!req.params.date.match(/^198\d-[01]\d-[0-3]\d$/)) return res.sendStatus(400);
		const data = await database.select(`select * from chart_view where date = '${req.params.date}' order by position`);
		res.render('chart-view', {
			id: data[0][0].chart_id,
			date: req.params.date,
			title: `Chart: ${req.params.date}`,
			data: data[0]
		});
	});
	app.get('/fetch/charts/dates', async (req, res, next) => {
		const data = await database.select(`select id, substr(date, 1, 10) as date from music.chart order by date`);
		res.json(data[0]);
	});
};
