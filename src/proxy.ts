import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

/**
 * Next.js 16 Proxy Function (replaces middleware.ts)
 * Protects admin routes and handles authentication
 * Runs on every request to /admin/* except login and setup pages
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login and setup pages without authentication
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/setup" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Only process admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check if user has a valid session
  const { data: session, error } = await betterFetch<{
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    } | null;
  }>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  }).catch(() => ({ data: null, error: true }));

  // If no session, redirect to login
  if (!session?.user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user has admin role
  if (session.user.role !== "admin") {
    // Non-admin users trying to access admin area
    const unauthorizedUrl = new URL("/", request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // User is authenticated and has admin role
  return NextResponse.next();
}

/**
 * Configure which routes this proxy should run on
 * Next.js 16 uses the same matcher config as middleware
 */
export const config = {
  matcher: [
    /*
     * Match all admin routes except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/admin/:path*",
  ],
};
