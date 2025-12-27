import { pool } from "@/lib/db";
import { Property } from "@/types/property";

/**
 * Fetches all properties from the database
 */
export async function getAllProperties(): Promise<Property[]> {
    const client = await pool.connect();
    try {
        const res = await client.query(`
      SELECT * FROM property ORDER BY created_at DESC
    `);
        return res.rows as Property[];
    } finally {
        client.release();
    }
}

/**
 * Fetches featured properties that are available
 * Used for the homepage featured section
 */
export async function getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `
      SELECT * FROM property 
      WHERE status = 'available' AND featured = true
      ORDER BY created_at DESC
      LIMIT $1
    `,
            [limit]
        );
        return res.rows as Property[];
    } finally {
        client.release();
    }
}

/**
 * Fetches available properties (for public listing)
 */
export async function getAvailableProperties(limit?: number): Promise<Property[]> {
    const client = await pool.connect();
    try {
        let query = `
      SELECT * FROM property 
      WHERE status = 'available'
      ORDER BY featured DESC, created_at DESC
    `;

        if (limit) {
            query += ` LIMIT $1`;
            const res = await client.query(query, [limit]);
            return res.rows as Property[];
        }

        const res = await client.query(query);
        return res.rows as Property[];
    } finally {
        client.release();
    }
}

/**
 * Fetches a single property by ID
 */
export async function getPropertyById(id: string): Promise<Property | null> {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT * FROM property WHERE id = $1`,
            [id]
        );
        return res.rows[0] as Property | null;
    } finally {
        client.release();
    }
}
