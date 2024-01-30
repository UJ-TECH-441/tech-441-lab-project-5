const mysql = require('mysql2/promise');
// create a new MySQL connection
const connect = async () => await mysql.createConnection({
	host: 'localhost',
	user: process.env.DATABASE_ID,
	password: process.env.DATABASE_PASSWORD,
	database: 'music'
});

const disconnect = async conn => await conn.end();

const select = async query => {
	let conn;
	try {
		conn = await connect();
		if (!conn) throw new Error('Cannot connect to database');
		return await conn.execute(query);
	} catch (err) {
		throw err;
	} finally {
		if (conn) await disconnect(conn);
	}
};

module.exports = { select };
