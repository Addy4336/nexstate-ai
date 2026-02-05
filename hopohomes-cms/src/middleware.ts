import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxy } from "./proxy";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle API routes specifically for CORS
    if (pathname.startsWith("/api")) {
        const origin = request.headers.get("origin") || "";

        // Define allowed origins
        const allowedOrigins = [
            "https://hopohomes.slaab.ai",
            "http://localhost:3000",
            "http://localhost:3001",
            process.env.FRONTEND_URL,
            process.env.NEXT_PUBLIC_APP_URL,
            "https://hopohomes-cms-hopohomes-cms.vercel.app"
        ].filter(Boolean).map(url => url?.toLowerCase().replace(/\/$/, ""));

        const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");
        const isAllowed = allowedOrigins.includes(normalizedOrigin);

        // Handle Preflight OPTIONS request
        if (request.method === "OPTIONS") {
            // For OPTIONS, if allowed return headers, otherwise just return valid OPTIONS response (some browsers expect 200/204 always)
            const response = new NextResponse(null, { status: 204 });

            if (isAllowed) {
                response.headers.set("Access-Control-Allow-Origin", origin);
                response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
                response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version");
                response.headers.set("Access-Control-Allow-Credentials", "true");
                response.headers.set("Access-Control-Max-Age", "86400");
                response.headers.set("Vary", "Origin");
            }
            return response;
        }

        // Handle standard API requests
        const response = NextResponse.next();

        if (isAllowed && origin) {
            response.headers.set("Access-Control-Allow-Origin", origin);
            response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version");
            response.headers.set("Access-Control-Allow-Credentials", "true");
            response.headers.set("Vary", "Origin");
        }

        return response;
    }

    // For non-API routes, delegate to the proxy (admin logic)
    return proxy(request);
}

export const config = {
    // Combine matchers: API routes AND everything else handled by proxy
    // Actually, middleware usually catches everything and decices.
    // We want to run on everything except static assets
    matcher: [
        "/api/:path*",
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ],
};
