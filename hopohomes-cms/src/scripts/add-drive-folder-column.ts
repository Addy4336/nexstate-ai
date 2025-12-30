
import { pool } from "../lib/db";

async function main() {
    console.log("Connecting to database...");
    const client = await pool.connect();
    try {
        console.log("Adding drive_folder_id column...");
        await client.query(`
            ALTER TABLE property 
            ADD COLUMN IF NOT EXISTS drive_folder_id TEXT;
        `);
        console.log("Column added successfully.");
    } catch (err) {
        console.error("Error altering table:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
