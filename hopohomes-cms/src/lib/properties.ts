import { supabaseAdmin } from "@/lib/db";
import { Property } from "@/types/property";
import { filterAvailableProperties } from "@/lib/rental-utils";

/**
 * Fetches all properties from the database
 */
export async function getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabaseAdmin
        .from("property")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all properties:", error);
        return [];
    }

    return (data as Property[]) || [];
}

/**
 * Fetches featured properties that are available
 * Used for the homepage featured section
 */
export async function getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    const { data, error } = await supabaseAdmin
        .from("property")
        .select("*")
        .in("status", ["available", "rented"])
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(limit * 2); // Fetch extra to account for filtering

    if (error) {
        console.error("Error fetching featured properties:", error);
        return [];
    }

    // Filter out currently rented properties
    const availableProperties = filterAvailableProperties(data as Property[] || []);
    return availableProperties.slice(0, limit);
}

/**
 * Fetches available properties (for public listing)
 */
export async function getAvailableProperties(limit?: number): Promise<Property[]> {
    let query = supabaseAdmin
        .from("property")
        .select("*")
        .in("status", ["available", "rented"])
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

    if (limit) {
        query = query.limit(limit * 2); // Fetch extra to account for filtering
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching available properties:", error);
        return [];
    }

    // Filter out currently rented properties
    const availableProperties = filterAvailableProperties(data as Property[] || []);
    
    if (limit) {
        return availableProperties.slice(0, limit);
    }
    
    return availableProperties;
}

/**
 * Fetches a single property by ID
 */
export async function getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabaseAdmin
        .from("property")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching property by ID:", error);
        return null;
    }

    return data as Property;
}

/**
 * Fetches filtered properties based on search criteria
 */
export async function getFilteredProperties(searchParams: {
    query?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
}): Promise<Property[]> {
    let queryBuilder = supabaseAdmin
        .from("property")
        .select("*")
        .in("status", ["available", "rented"]);

    if (searchParams.query) {
        queryBuilder = queryBuilder.or(
            `title.ilike.%${searchParams.query}%,description.ilike.%${searchParams.query}%,location.ilike.%${searchParams.query}%`
        );
    }

    if (searchParams.location) {
        queryBuilder = queryBuilder.ilike("location", `%${searchParams.location}%`);
    }

    if (searchParams.minPrice) {
        queryBuilder = queryBuilder.gte("price", searchParams.minPrice);
    }

    if (searchParams.maxPrice) {
        queryBuilder = queryBuilder.lte("price", searchParams.maxPrice);
    }

    if (searchParams.bedrooms) {
        queryBuilder = queryBuilder.gte("bedrooms", searchParams.bedrooms);
    }

    queryBuilder = queryBuilder
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) {
        console.error("Error fetching filtered properties:", error);
        return [];
    }

    // Filter out currently rented properties
    return filterAvailableProperties(data as Property[] || []);
}
