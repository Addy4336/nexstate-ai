import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

// Staff roles that can access the admin dashboard
const STAFF_ROLES = ["admin", "manager", "editor"];

/**
 * Next.js 16 Proxy Function (replaces middleware.ts)
 * Protects admin routes and handles authentication
 * Runs on every request to /admin/* except login and setup pages
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login, setup pages, and API routes without authentication/redirection
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/setup" ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Redirect root and non-admin paths to /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
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

  // Check if user has a staff role (admin, manager, or editor)
  if (!STAFF_ROLES.includes(session.user.role)) {
    // Non-staff users trying to access admin area
    const unauthorizedUrl = new URL("/admin/login", request.url); // Redirect to login instead of root
    return NextResponse.redirect(unauthorizedUrl);
  }

  // Additional check: Users page should be admin-only
  if (pathname.startsWith("/admin/users") && session.user.role !== "admin") {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    dashboardUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(dashboardUrl);
  }

  // User is authenticated and has staff role
  return NextResponse.next();
}

/**
 * Configure which routes this proxy should run on
 * Next.js 16 uses the same matcher config as middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

