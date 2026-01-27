// Script to setup google_tokens table
// NOTE: This script is deprecated. Use Supabase dashboard SQL editor for schema changes.

console.log("⚠️ This script is deprecated.");
console.log("   To create the google_tokens table, use the Supabase dashboard SQL editor with:");
console.log(`
CREATE TABLE IF NOT EXISTS google_tokens (
    id SERIAL PRIMARY KEY,
    access_token TEXT,
    refresh_token TEXT,
    scope TEXT,
    token_type TEXT,
    expiry_date BIGINT,
    updated_at TIMESTAMP DEFAULT NOW()
);
`);
console.log("");
console.log("   Or use Supabase migrations for schema changes.");
