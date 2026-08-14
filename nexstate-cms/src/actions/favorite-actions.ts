"use server";

import { supabaseAdmin } from "@/lib/db";
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
    
    try {
        // Check if already favorited
        const { data: existing } = await supabaseAdmin
            .from("favorite")
            .select("id")
            .eq("user_id", effectiveUserId)
            .eq("property_id", propertyId)
            .single();

        if (existing) {
            // Remove favorite
            await supabaseAdmin
                .from("favorite")
                .delete()
                .eq("user_id", effectiveUserId)
                .eq("property_id", propertyId);
            
            revalidatePath("/properties");
            revalidatePath(`/properties/${propertyId}`);
            return { success: true, isFavorited: false };
        } else {
            // Add favorite
            await supabaseAdmin
                .from("favorite")
                .insert({ user_id: effectiveUserId, property_id: propertyId });
            
            revalidatePath("/properties");
            revalidatePath(`/properties/${propertyId}`);
            return { success: true, isFavorited: true };
        }
    } catch (error: any) {
        console.error("Error toggling favorite:", error);
        return { success: false, error: "Failed to update favorite" };
    }
}

export async function getFavorites(userId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from("favorite")
            .select(`
                *,
                property(*)
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        
        if (error) {
            console.error("Error getting favorites:", error);
            return [];
        }
        
        return data || [];
    } catch (error: any) {
        console.error("Error getting favorites:", error);
        return [];
    }
}

export async function getFavoritePropertyIds(userId: string): Promise<string[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from("favorite")
            .select("property_id")
            .eq("user_id", userId);
        
        if (error) {
            console.error("Error getting favorite IDs:", error);
            return [];
        }
        
        return (data || []).map(row => row.property_id);
    } catch (error: any) {
        console.error("Error getting favorite IDs:", error);
        return [];
    }
}

export async function isFavorited(propertyId: string, userId: string): Promise<boolean> {
    try {
        const { data } = await supabaseAdmin
            .from("favorite")
            .select("id")
            .eq("user_id", userId)
            .eq("property_id", propertyId)
            .single();
        
        return !!data;
    } catch (error: any) {
        console.error("Error checking favorite:", error);
        return false;
    }
}

export async function getFavoriteCount(propertyId: string): Promise<number> {
    try {
        const { count, error } = await supabaseAdmin
            .from("favorite")
            .select("*", { count: "exact", head: true })
            .eq("property_id", propertyId);
        
        if (error) {
            console.error("Error getting favorite count:", error);
            return 0;
        }
        
        return count || 0;
    } catch (error: any) {
        console.error("Error getting favorite count:", error);
        return 0;
    }
}
