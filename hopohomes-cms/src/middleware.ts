import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only run on API routes
    if (pathname.startsWith("/api")) {
        const origin = request.headers.get("origin");

        // Define allowed origins
        const allowedOrigins = [
            "https://hopohomes.slaab.ai",
            "http://localhost:3000",
            "http://localhost:3001",
            process.env.FRONTEND_URL,
            process.env.NEXT_PUBLIC_APP_URL,
        ].filter(Boolean) as string[];

        // Check if the origin is allowed
        const isAllowed = origin && allowedOrigins.includes(origin);

        // Handle Preflight OPTIONS request
        if (request.method === "OPTIONS") {
            // If valid origin, return 200 with CORS headers
            if (isAllowed) {
                return new NextResponse(null, {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": origin!,
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
                        "Access-Control-Allow-Credentials": "true",
                    },
                });
            }
            // If not allowed or no origin (but OPTIONS usually has origin), return 200 without headers (CORS error)
            return new NextResponse(null, { status: 200 });
        }

        // Handle standard requests
        const response = NextResponse.next();

        if (isAllowed && origin) {
            response.headers.set("Access-Control-Allow-Origin", origin);
            response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version");
            response.headers.set("Access-Control-Allow-Credentials", "true");
        }

        return response;
    }

    // Default behavior for non-API routes check for proxy.ts logic if needed, 
    // currently we only touch API routes logic to fix CORS
    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
