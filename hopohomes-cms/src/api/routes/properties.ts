import { Elysia, t } from "elysia";
import { supabaseAdmin } from "@/lib/db";

export const propertiesRoutes = new Elysia({ prefix: "/properties" })
    // Get all available properties (public)
    .get("/", async ({ query }) => {
        const { limit, featured } = query;
        
        let queryBuilder = supabaseAdmin
            .from("property")
            .select("*")
            .eq("status", "available");
        
        if (featured === "true") {
            queryBuilder = queryBuilder.eq("featured", true);
        }
        
        queryBuilder = queryBuilder
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false });
        
        if (limit) {
            queryBuilder = queryBuilder.limit(parseInt(limit));
        }
        
        const { data, error } = await queryBuilder;
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        return { success: true, data: data || [] };
    }, {
        query: t.Object({
            limit: t.Optional(t.String()),
            featured: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get available properties",
            description: "Fetches all available properties with optional filtering",
        },
    })
    
    // Get featured properties
    .get("/featured", async ({ query }) => {
        const limit = query.limit ? parseInt(query.limit) : 6;
        
        const { data, error } = await supabaseAdmin
            .from("property")
            .select("*")
            .eq("status", "available")
            .eq("featured", true)
            .order("created_at", { ascending: false })
            .limit(limit);
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        // If no featured, return available properties
        if (!data || data.length === 0) {
            const { data: availableData } = await supabaseAdmin
                .from("property")
                .select("*")
                .eq("status", "available")
                .order("created_at", { ascending: false })
                .limit(limit);
            
            return { success: true, data: availableData || [] };
        }
        
        return { success: true, data };
    }, {
        query: t.Object({
            limit: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get featured properties",
            description: "Fetches featured properties for homepage display",
        },
    })
    
    // Search/filter properties
    .get("/search", async ({ query }) => {
        const { q, location, minPrice, maxPrice, bedrooms } = query;
        
        let queryBuilder = supabaseAdmin
            .from("property")
            .select("*")
            .eq("status", "available");
        
        if (q) {
            queryBuilder = queryBuilder.or(
                `title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`
            );
        }
        
        if (location) {
            queryBuilder = queryBuilder.ilike("location", `%${location}%`);
        }
        
        if (minPrice) {
            queryBuilder = queryBuilder.gte("price", parseInt(minPrice));
        }
        
        if (maxPrice) {
            queryBuilder = queryBuilder.lte("price", parseInt(maxPrice));
        }
        
        if (bedrooms) {
            queryBuilder = queryBuilder.gte("bedrooms", parseInt(bedrooms));
        }
        
        queryBuilder = queryBuilder
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false });
        
        const { data, error } = await queryBuilder;
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        return { success: true, data: data || [] };
    }, {
        query: t.Object({
            q: t.Optional(t.String()),
            location: t.Optional(t.String()),
            minPrice: t.Optional(t.String()),
            maxPrice: t.Optional(t.String()),
            bedrooms: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Search properties",
            description: "Search and filter properties by various criteria",
        },
    })
    
    // Get single property by ID
    .get("/:id", async ({ params }) => {
        const { data, error } = await supabaseAdmin
            .from("property")
            .select("*")
            .eq("id", params.id)
            .single();
        
        if (error) {
            return { success: false, error: "Property not found", data: null };
        }
        
        return { success: true, data };
    }, {
        params: t.Object({
            id: t.String(),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get property by ID",
            description: "Fetches a single property by its ID",
        },
    })
    
    // Get property locations (for location filter)
    .get("/meta/locations", async () => {
        const { data, error } = await supabaseAdmin
            .from("property")
            .select("location")
            .eq("status", "available");
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        // Get unique locations
        const locations = [...new Set(data?.map(p => p.location).filter(Boolean))];
        
        return { success: true, data: locations };
    }, {
        detail: {
            tags: ["Properties"],
            summary: "Get property locations",
            description: "Get list of unique property locations for filtering",
        },
    });
