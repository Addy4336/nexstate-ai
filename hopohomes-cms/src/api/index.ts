import { Elysia } from "elysia";
// import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { propertiesRoutes } from "./routes/properties";
import { enquiriesRoutes } from "./routes/enquiries";
import { favoritesRoutes } from "./routes/favorites";
import { blogsRoutes } from "./routes/blogs";
import { faqsRoutes } from "./routes/faqs";
import { storageRoutes } from "./routes/storage";
import { initializeCronJobs } from "../lib/cron-jobs";

// Initialize cron jobs when the API starts
initializeCronJobs();

// Create the main Elysia application
// Prefix with /api to match Next.js catch-all route at /api/[[...slugs]]
export const api = new Elysia({ prefix: "/api" })
    // Add CORS for cross-origin requests from frontend
    // .use(cors({
    //     origin: [
    //         "http://localhost:3000",  // hopohomes-frontend dev
    //         "http://localhost:3001",
    //         "https://hopohomes.slaab.ai",
    //         process.env.FRONTEND_URL || "",
    //         process.env.NEXT_PUBLIC_APP_URL || "",
    //     ].filter(Boolean),
    //     credentials: true,
    //     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    //     allowedHeaders: ["Content-Type", "Authorization"],
    // }))
    
    // Add Swagger documentation
    .use(swagger({
        path: "/docs",
        documentation: {
            info: {
                title: "HOPO Homes API",
                version: "1.0.0",
                description: "API for HOPO Homes property management platform",
            },
            tags: [
                { name: "Properties", description: "Property listing endpoints" },
                { name: "Enquiries", description: "Contact and enquiry endpoints" },
                { name: "Favorites", description: "Saved properties endpoints" },
                { name: "Blogs", description: "Blog content endpoints" },
                { name: "FAQs", description: "FAQ content endpoints" },
                { name: "Storage", description: "Image storage endpoints" },
            ],
        },
    }))

    // Health check endpoint at /api/health
    .get("/health", () => ({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "hopohomes-api",
    }), {
        detail: {
            tags: ["System"],
            summary: "Health check",
            description: "Check if the API is running",
        },
    })

    // Register all route modules
    .use(propertiesRoutes)
    .use(enquiriesRoutes)
    .use(favoritesRoutes)
    .use(blogsRoutes)
    .use(faqsRoutes)
    .use(storageRoutes);

// Export the type for Eden Treaty client
export type Api = typeof api;
