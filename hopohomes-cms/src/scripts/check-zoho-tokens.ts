// Script to check existing Zoho tokens in database
import { pool } from "../lib/db";

async function checkZohoTokens() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT id, created_at, updated_at, expires_at FROM zoho_tokens WHERE id = 1");
        
        if (result.rows.length === 0) {
            console.log("❌ No Zoho tokens found in database");
            console.log("   This is the FIRST connection - Zoho MUST return a refresh token");
        } else {
            console.log("✅ Zoho tokens exist in database:");
            console.log("   Created:", result.rows[0].created_at);
            console.log("   Updated:", result.rows[0].updated_at);
            console.log("   Expires:", result.rows[0].expires_at);
            console.log("\n   This is a RECONNECTION - Zoho may not return a refresh token");
            console.log("   Solution: Use the revoke endpoint or manually revoke in Zoho settings");
        }
    } catch (error: any) {
        console.error("❌ Error checking tokens:", error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

checkZohoTokens();
