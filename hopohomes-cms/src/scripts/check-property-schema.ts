
import { pool } from "../lib/db";

async function main() {
    console.log("Connecting to database...");
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'property';
        `);
        console.log("Property table columns:", res.rows);
    } catch (err) {
        console.error("Error querying table:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
