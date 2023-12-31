import { Pool } from "pg";

async function main() {
	const connection = {
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: Number(process.env.PGPORT),
	};
	const pool = new Pool(connection);

	try {
		const db = await pool.connect();
		await db.query("DROP EXTENSION timescaledb");
		await db.query("ALTER SYSTEM SET wal_level = logical");
		await db.query("ALTER SYSTEM SET max_replication_slots = 20");
		await db.query("ALTER SYSTEM SET wal_keep_size = 2048");
		await db.query("SELECT pg_reload_conf()");

		console.log("All done please restart the database");
	} catch (err) {
		console.log(err);
	}
}

main();
