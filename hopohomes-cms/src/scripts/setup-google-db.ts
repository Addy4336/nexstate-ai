
import { pool } from "../lib/db";

async function main() {
    console.log("Connecting to database...");
    const client = await pool.connect();
    try {
        console.log("Creating google_tokens table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS google_tokens (
                id SERIAL PRIMARY KEY,
                access_token TEXT,
                refresh_token TEXT,
                scope TEXT,
                token_type TEXT,
                expiry_date BIGINT,
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("Table google_tokens created successfully.");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
