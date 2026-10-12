import { auth } from "@/lib/auth";

const STAFF_ROLES = ["admin", "manager", "editor"];

type Ctx = { request: Request; set: { status?: number | string } };

export async function getApiSession(request: Request) {
    try {
        return await auth.api.getSession({ headers: request.headers });
    } catch {
        return null;
    }
}

/** beforeHandle guard: any signed-in user. Returns an error body to short-circuit. */
export async function requireSessionGuard({ request, set }: Ctx) {
    const session = await getApiSession(request);
    if (!session?.user) {
        set.status = 401;
        return { success: false, error: "Unauthorized" };
    }
}

/** beforeHandle guard: staff (admin, manager, editor). */
export async function requireStaffGuard({ request, set }: Ctx) {
    const session = await getApiSession(request);
    if (!session?.user) {
        set.status = 401;
        return { success: false, error: "Unauthorized" };
    }
    if (!STAFF_ROLES.includes(session.user.role as string)) {
        set.status = 403;
        return { success: false, error: "Forbidden" };
    }
}

/** Recursively drop keys that must never reach public clients. */
export function stripKeys<T>(value: T, keys: string[]): T {
    if (Array.isArray(value)) return value.map((v) => stripKeys(v, keys)) as unknown as T;
    if (value && typeof value === "object" && !(value instanceof Date)) {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            if (keys.includes(k)) continue;
            out[k] = stripKeys(v, keys);
        }
        return out as T;
    }
    return value;
}

/** Public view of a property payload: no booking history, tenant limited to the checkout date. */
export function redactTenantData<T>(value: T): T {
    if (Array.isArray(value)) return value.map(redactTenantData) as unknown as T;
    if (value && typeof value === "object" && !(value instanceof Date)) {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            if (k === "rental_periods") continue;
            if (k === "current_tenant") {
                const t = v as { check_out_date?: string } | null;
                out[k] = t ? { check_out_date: t.check_out_date } : null;
                continue;
            }
            out[k] = redactTenantData(v);
        }
        return out as T;
    }
    return value;
}
