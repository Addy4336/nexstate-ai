import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password", "/admin/setup", "/admin/login"];

// Routes that require authentication
const protectedRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is a protected admin route
    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname.startsWith(route) && !publicRoutes.some((pub) => pathname.startsWith(pub))
    );

    // Check for auth cookie (Better Auth uses better-auth.session_token)
    // Note: This matches the cookie name set by Better Auth
    const sessionToken = request.cookies.get("better-auth.session_token");

    // If accessing protected route without auth, redirect to login
    if (isProtectedRoute && !sessionToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // If accessing login page WITH auth, redirect to dashboard
    if (pathname === "/admin/login" && sessionToken) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*$).*)",
    ],
};
