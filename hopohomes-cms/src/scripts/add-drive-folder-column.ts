// Script to add drive_folder_id column to property table
// NOTE: This script is deprecated. Use Supabase dashboard SQL editor for schema changes.

console.log("⚠️ This script is deprecated.");
console.log("   To add drive_folder_id column, use the Supabase dashboard SQL editor:");
console.log("   ALTER TABLE property ADD COLUMN IF NOT EXISTS drive_folder_id TEXT;");
console.log("");
console.log("   Or use Supabase migrations for schema changes.");
