import { pool } from "../lib/db";

async function setupFaqTable() {
    const client = await pool.connect();

    try {
        console.log("Creating FAQ table...");

        await client.query(`
            CREATE TABLE IF NOT EXISTS faq (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category VARCHAR(50) DEFAULT 'general',
                sort_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
        `);

        console.log("Creating indexes...");

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_faq_sort_order ON faq(sort_order);
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_faq_is_active ON faq(is_active);
        `);

        console.log("FAQ table and indexes created successfully!");
    } catch (error) {
        console.error("Error setting up FAQ table:", error);
        throw error;
    } finally {
        client.release();
    }

    process.exit(0);
}

setupFaqTable();
