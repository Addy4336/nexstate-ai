import { pool } from "@/lib/db";

export interface DashboardStats {
    totalProperties: number;
    activeTenants: number;
    monthlyRevenue: number;
    occupancyRate: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const client = await pool.connect();
    try {
        // Run queries in parallel for performance
        const [totalPropsRes, rentedPropsRes, revenueRes] = await Promise.all([
            client.query("SELECT COUNT(*) FROM property"),
            client.query("SELECT COUNT(*) FROM property WHERE status = 'rented'"),
            client.query("SELECT SUM(price) FROM property WHERE status = 'rented'"),
        ]);

        const totalProperties = parseInt(totalPropsRes.rows[0].count, 10) || 0;
        const activeTenants = parseInt(rentedPropsRes.rows[0].count, 10) || 0; // Assuming 1 tenant per rented property
        const monthlyRevenue = parseFloat(revenueRes.rows[0].sum) || 0;
        const occupancyRate = totalProperties > 0 ? (activeTenants / totalProperties) * 100 : 0;

        return {
            totalProperties,
            activeTenants,
            monthlyRevenue,
            occupancyRate: Math.round(occupancyRate),
        };
    } finally {
        client.release();
    }
}

import { Property } from "@/types/property";

// ... (previous imports and interfaces)

export async function getRecentProperties(limit: number = 5): Promise<Property[]> {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `
      SELECT * FROM property 
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
