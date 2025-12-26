import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * Server-side utility to get the current session
 * Cached to avoid multiple calls within the same request
 */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

/**
 * Get the current user from session
 * Returns null if no session exists
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in server components that require any authenticated user
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return session;
}

/**
 * Require admin role - redirects if not admin
 * Use this in server components that require admin privileges
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}

/**
 * Check if current user has admin role
 * Returns boolean without redirecting
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if user is authenticated
 * Returns boolean without redirecting
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Type guard for user role
 */
export function hasRole(user: { role: string } | null, role: string): boolean {
  return user?.role === role;
}
