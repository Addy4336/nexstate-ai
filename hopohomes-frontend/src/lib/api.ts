import { treaty } from "@elysiajs/eden";

// API base URL - points to hopohomes-cms API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Type definitions for API responses
export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    status: "available" | "rented" | "maintenance" | "archived";
    featured: boolean;
    images: string[];
    cover_image: string[];
    amenities: string[];
    drive_folder_id?: string;
    created_at: string;
    updated_at: string;
}

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    author?: string;
    published: boolean;
    created_at: string;
    updated_at: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category?: string;
    order: number;
    created_at: string;
}

export interface Favorite {
    id: string;
    user_id: string;
    property_id: string;
    property?: Property;
    created_at: string;
}

export interface EnquiryType {
    value: string;
    label: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    error?: string;
    data: T;
}

export interface ApiMessageResponse {
    success: boolean;
    error?: string;
    message?: string;
}

export interface FavoriteToggleResponse {
    success: boolean;
    error?: string;
    isFavorited?: boolean;
}

// Simple fetch-based API client (works in both client and server components)
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async fetch<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    // Properties
    properties = {
        getAll: (params?: { limit?: number; featured?: boolean }) => {
            const searchParams = new URLSearchParams();
            if (params?.limit) searchParams.set("limit", params.limit.toString());
            if (params?.featured) searchParams.set("featured", "true");
            const query = searchParams.toString();
            return this.fetch<ApiResponse<Property[]>>(`/properties${query ? `?${query}` : ""}`);
        },

        getFeatured: (limit?: number) => {
            const query = limit ? `?limit=${limit}` : "";
            return this.fetch<ApiResponse<Property[]>>(`/properties/featured${query}`);
        },

        search: (params: {
            q?: string;
            location?: string;
            minPrice?: number;
            maxPrice?: number;
            bedrooms?: number;
        }) => {
            const searchParams = new URLSearchParams();
            if (params.q) searchParams.set("q", params.q);
            if (params.location) searchParams.set("location", params.location);
            if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
            if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
            if (params.bedrooms) searchParams.set("bedrooms", params.bedrooms.toString());
            const query = searchParams.toString();
            return this.fetch<ApiResponse<Property[]>>(`/properties/search${query ? `?${query}` : ""}`);
        },

        getById: (id: string) => {
            return this.fetch<ApiResponse<Property | null>>(`/properties/${id}`);
        },

        getLocations: () => {
            return this.fetch<ApiResponse<string[]>>(`/properties/meta/locations`);
        },
    };

    // Enquiries
    enquiries = {
        submit: (data: {
            type?: string;
            name: string;
            email: string;
            phone?: string;
            message: string;
            propertyId?: string;
            propertyTitle?: string;
        }) => {
            return this.fetch<ApiMessageResponse>("/enquiries", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },

        getTypes: () => {
            return this.fetch<ApiResponse<EnquiryType[]>>("/enquiries/types");
        },
    };

    // Favorites
    favorites = {
        toggle: (propertyId: string, userId: string) => {
            return this.fetch<FavoriteToggleResponse>("/favorites/toggle", {
                method: "POST",
                body: JSON.stringify({ propertyId, userId }),
            });
        },

        getByUser: (userId: string) => {
            return this.fetch<ApiResponse<Favorite[]>>(`/favorites/user/${userId}`);
        },

        getIdsByUser: (userId: string) => {
            return this.fetch<ApiResponse<string[]>>(`/favorites/user/${userId}/ids`);
        },

        check: (propertyId: string, userId: string) => {
            return this.fetch<{ success: boolean; isFavorited: boolean }>(
                `/favorites/check/${propertyId}/${userId}`
            );
        },
    };

    // Blogs
    blogs = {
        getAll: (limit?: number) => {
            const query = limit ? `?limit=${limit}` : "";
            return this.fetch<ApiResponse<Blog[]>>(`/blogs${query}`);
        },

        getBySlug: (slug: string) => {
            return this.fetch<ApiResponse<Blog | null>>(`/blogs/slug/${slug}`);
        },

        getById: (id: string) => {
            return this.fetch<ApiResponse<Blog | null>>(`/blogs/${id}`);
        },
    };

    // FAQs
    faqs = {
        getAll: (category?: string) => {
            const query = category ? `?category=${encodeURIComponent(category)}` : "";
            return this.fetch<ApiResponse<FAQ[]>>(`/faqs${query}`);
        },

        getCategories: () => {
            return this.fetch<ApiResponse<string[]>>(`/faqs/categories`);
        },
    };

    // Health check
    health = () => {
        return this.fetch<{ status: string; timestamp: string; service: string }>("/health");
    };
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export the class for testing or custom instances
export { ApiClient };
