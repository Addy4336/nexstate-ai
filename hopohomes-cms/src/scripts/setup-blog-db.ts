import { pool } from "../lib/db";

async function main() {
    console.log("Connecting to database...");
    const client = await pool.connect();
    try {
        console.log("Creating blog table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS blog (
                id text primary key default gen_random_uuid()::text,
                title text not null,
                slug text not null unique,
                content text,
                excerpt text,
                cover_image text,
                images text[],
                category text default 'general',
                status text default 'draft',
                author_id text,
                published_at timestamp,
                drive_folder_id text,
                created_at timestamp not null default now(),
                updated_at timestamp not null default now()
            );
        `);
        console.log("Table blog created successfully.");

        console.log("Creating indexes...");
        await client.query(`CREATE INDEX IF NOT EXISTS blog_slug_idx ON blog(slug);`);
        await client.query(`CREATE INDEX IF NOT EXISTS blog_status_idx ON blog(status);`);
        await client.query(`CREATE INDEX IF NOT EXISTS blog_category_idx ON blog(category);`);
        console.log("Indexes created successfully.");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
