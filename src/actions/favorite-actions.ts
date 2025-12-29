"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Get or create a guest user ID from cookies
async function getGuestUserId(): Promise<string> {
    const cookieStore = await cookies();
    let guestId = cookieStore.get("guest_user_id")?.value;
    
    if (!guestId) {
        guestId = `guest_${crypto.randomUUID()}`;
        // Note: In server actions, we can't directly set cookies
        // The client component will need to handle this
    }
    
    return guestId;
}

export async function toggleFavorite(propertyId: string, userId?: string) {
    // Use provided userId or generate guest ID
    const effectiveUserId = userId || await getGuestUserId();
    
    const client = await pool.connect();
    try {
        // Check if already favorited
        const existing = await client.query(
            `SELECT id FROM favorite WHERE user_id = $1 AND property_id = $2`,
            [effectiveUserId, propertyId]
        );

        if (existing.rows.length > 0) {
            // Remove favorite
            await client.query(
                `DELETE FROM favorite WHERE user_id = $1 AND property_id = $2`,
                [effectiveUserId, propertyId]
            );
            revalidatePath("/properties");
            revalidatePath(`/properties/${propertyId}`);
            return { success: true, isFavorited: false };
        } else {
            // Add favorite
            await client.query(
                `INSERT INTO favorite (user_id, property_id) VALUES ($1, $2)`,
                [effectiveUserId, propertyId]
            );
            revalidatePath("/properties");
            revalidatePath(`/properties/${propertyId}`);
            return { success: true, isFavorited: true };
        }
    } catch (error: any) {
        console.error("Error toggling favorite:", error);
        return { success: false, error: "Failed to update favorite" };
    } finally {
        client.release();
    }
}

export async function getFavorites(userId: string) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT f.*, p.* 
             FROM favorite f
             JOIN property p ON f.property_id = p.id
             WHERE f.user_id = $1
             ORDER BY f.created_at DESC`,
            [userId]
        );
        return result.rows;
    } catch (error: any) {
        console.error("Error getting favorites:", error);
        return [];
    } finally {
        client.release();
    }
}

export async function getFavoritePropertyIds(userId: string): Promise<string[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT property_id FROM favorite WHERE user_id = $1`,
            [userId]
        );
        return result.rows.map(row => row.property_id);
    } catch (error: any) {
        console.error("Error getting favorite IDs:", error);
        return [];
    } finally {
        client.release();
    }
}

export async function isFavorited(propertyId: string, userId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT id FROM favorite WHERE user_id = $1 AND property_id = $2`,
            [userId, propertyId]
        );
        return result.rows.length > 0;
    } catch (error: any) {
        console.error("Error checking favorite:", error);
        return false;
    } finally {
        client.release();
    }
}

export async function getFavoriteCount(propertyId: string): Promise<number> {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT COUNT(*) as count FROM favorite WHERE property_id = $1`,
            [propertyId]
        );
        return parseInt(result.rows[0].count) || 0;
    } catch (error: any) {
        console.error("Error getting favorite count:", error);
        return 0;
    } finally {
        client.release();
    }
}
