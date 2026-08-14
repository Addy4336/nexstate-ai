// Script to check existing Zoho tokens in database
// NOTE: This script is deprecated and uses legacy direct SQL queries.
// Use the Supabase dashboard to inspect the zoho_tokens table instead.

import { supabaseAdmin } from "../lib/db";

async function checkZohoTokens() {
    console.log("Checking Zoho tokens via Supabase...");
    try {
        const { data, error } = await supabaseAdmin
            .from('zoho_tokens')
            .select('id, created_at, updated_at, expires_at')
            .eq('id', 1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log("❌ No Zoho tokens found in database");
                console.log("   This is the FIRST connection - Zoho MUST return a refresh token");
            } else {
                console.error("❌ Error checking tokens:", error.message);
            }
            return;
        }

        if (data) {
            console.log("✅ Zoho tokens exist in database:");
            console.log("   Created:", data.created_at);
            console.log("   Updated:", data.updated_at);
            console.log("   Expires:", data.expires_at);
            console.log("\n   This is a RECONNECTION - Zoho may not return a refresh token");
            console.log("   Solution: Use the revoke endpoint or manually revoke in Zoho settings");
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("❌ Error checking tokens:", errorMessage);
    }
}

checkZohoTokens();
