import { createClient } from "@supabase/supabase-js";

// Create Supabase client with service role key for server-side admin operations
// This bypasses RLS and should only be used in server-side code
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

// Create Supabase client with anon key for public operations
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Legacy pool export for backward compatibility (will be removed)
// @deprecated Use supabaseAdmin or supabase instead
export const pool = {
    async connect() {
        console.warn("⚠️ pool.connect() is deprecated. Use Supabase client instead.");
        return {
            query: async (text: string, params?: any[]) => {
                throw new Error("Direct SQL queries not supported. Use Supabase client methods.");
            },
            release: () => {},
        };
    },
    async query(text: string, params?: any[]) {
        throw new Error("Direct SQL queries not supported. Use Supabase client methods.");
    },
    async end() {
        // No-op for Supabase
    },
};
