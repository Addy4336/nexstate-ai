"use server";

import { pool } from "@/lib/db";
import type { PropertyFilters } from "@/components/properties/AdvancedFilters";

export interface SearchResult {
    properties: any[];
    total: number;
    page: number;
    pageSize: number;
}

export async function searchProperties(
    filters: Partial<PropertyFilters>,
    page: number = 1,
    pageSize: number = 12
): Promise<SearchResult> {
    const client = await pool.connect();

    try {
        const conditions: string[] = ["1=1"];
        const values: any[] = [];
        let paramIndex = 1;

        // Location filter
        if (filters.location) {
            conditions.push(`location ILIKE $${paramIndex}`);
            values.push(`%${filters.location}%`);
            paramIndex++;
        }

        // Property type
        if (filters.propertyType && filters.propertyType !== "all") {
            conditions.push(`property_type = $${paramIndex}`);
            values.push(filters.propertyType);
            paramIndex++;
        }

        // Budget range
        if (filters.budgetMin && filters.budgetMin > 0) {
            conditions.push(`price >= $${paramIndex}`);
            values.push(filters.budgetMin);
            paramIndex++;
        }

        if (filters.budgetMax && filters.budgetMax < 50000) {
            conditions.push(`price <= $${paramIndex}`);
            values.push(filters.budgetMax);
            paramIndex++;
        }

        // Sharing type
        if (filters.sharingType && filters.sharingType !== "all") {
            conditions.push(`sharing_type = $${paramIndex}`);
            values.push(filters.sharingType);
            paramIndex++;
        }

        // Furnishing
        if (filters.furnishing && filters.furnishing !== "all") {
            conditions.push(`furnishing = $${paramIndex}`);
            values.push(filters.furnishing);
            paramIndex++;
        }

        // Gender preference
        if (filters.genderPreference && filters.genderPreference !== "all") {
            conditions.push(`gender_preference = $${paramIndex}`);
            values.push(filters.genderPreference);
            paramIndex++;
        }

        // Bedrooms
        if (filters.bedrooms && filters.bedrooms.length > 0) {
            conditions.push(`bedrooms = ANY($${paramIndex})`);
            values.push(filters.bedrooms);
            paramIndex++;
        }

        // Bathrooms
        if (filters.bathrooms && filters.bathrooms.length > 0) {
            conditions.push(`bathrooms = ANY($${paramIndex})`);
            values.push(filters.bathrooms);
            paramIndex++;
        }

        // Amenities (array contains)
        if (filters.amenities && filters.amenities.length > 0) {
            conditions.push(`amenities @> $${paramIndex}`);
            values.push(filters.amenities);
            paramIndex++;
        }

        // Available from
        if (filters.availableFrom) {
            conditions.push(`available_from <= $${paramIndex}`);
            values.push(filters.availableFrom);
            paramIndex++;
        }

        // Build query
        const whereClause = conditions.join(" AND ");
        const offset = (page - 1) * pageSize;

        // Get total count
        const countQuery = `SELECT COUNT(*) FROM property WHERE ${whereClause}`;
        const countResult = await client.query(countQuery, values);
        const total = parseInt(countResult.rows[0].count, 10);

        // Get properties
        const query = `
            SELECT * FROM property 
            WHERE ${whereClause}
            ORDER BY featured DESC, created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        values.push(pageSize, offset);
        const result = await client.query(query, values);

        return {
            properties: result.rows,
            total,
            page,
            pageSize,
        };
    } finally {
        client.release();
    }
}

// Get similar properties based on location and price
export async function getSimilarProperties(
    propertyId: string,
    location: string,
    price: number,
    limit: number = 4
): Promise<any[]> {
    const client = await pool.connect();

    try {
        const minPrice = price * 0.8;
        const maxPrice = price * 1.2;

        const result = await client.query(
            `SELECT * FROM property 
             WHERE id != $1 
               AND location ILIKE $2
               AND price BETWEEN $3 AND $4
               AND status = 'available'
             ORDER BY ABS(price - $5) ASC
             LIMIT $6`,
            [propertyId, `%${location}%`, minPrice, maxPrice, price, limit]
        );

        return result.rows;
    } finally {
        client.release();
    }
}

// Get upgrade options (higher price, better properties)
export async function getUpgradeProperties(
    propertyId: string,
    price: number,
    location: string,
    limit: number = 4
): Promise<any[]> {
    const client = await pool.connect();

    try {
        const minPrice = price * 1.1;
        const maxPrice = price * 1.4;

        const result = await client.query(
            `SELECT * FROM property 
             WHERE id != $1 
               AND price BETWEEN $2 AND $3
               AND status = 'available'
             ORDER BY 
               CASE WHEN location ILIKE $4 THEN 0 ELSE 1 END,
               price ASC
             LIMIT $5`,
            [propertyId, minPrice, maxPrice, `%${location}%`, limit]
        );

        return result.rows;
    } finally {
        client.release();
    }
}

// Get budget alternatives (lower price)
export async function getBudgetProperties(
    propertyId: string,
    price: number,
    location: string,
    limit: number = 4
): Promise<any[]> {
    const client = await pool.connect();

    try {
        const minPrice = price * 0.6;
        const maxPrice = price * 0.9;

        const result = await client.query(
            `SELECT * FROM property 
             WHERE id != $1 
               AND price BETWEEN $2 AND $3
               AND status = 'available'
             ORDER BY 
               CASE WHEN location ILIKE $4 THEN 0 ELSE 1 END,
               price DESC
             LIMIT $5`,
            [propertyId, minPrice, maxPrice, `%${location}%`, limit]
        );

        return result.rows;
    } finally {
        client.release();
    }
}

// Get popular properties in area
export async function getPopularInArea(
    location: string,
    excludeId?: string,
    limit: number = 4
): Promise<any[]> {
    const client = await pool.connect();

    try {
        const query = excludeId
            ? `SELECT * FROM property 
               WHERE id != $1 
                 AND location ILIKE $2
                 AND status = 'available'
               ORDER BY featured DESC, created_at DESC
               LIMIT $3`
            : `SELECT * FROM property 
               WHERE location ILIKE $1
                 AND status = 'available'
               ORDER BY featured DESC, created_at DESC
               LIMIT $2`;

        const values = excludeId
            ? [excludeId, `%${location}%`, limit]
            : [`%${location}%`, limit];

        const result = await client.query(query, values);
        return result.rows;
    } finally {
        client.release();
    }
}
