
import { google } from "googleapis";
import { supabaseAdmin } from "./db";

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
// Determine base URL based on environment or default to localhost
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
const REDIRECT_URI = `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing Google Client ID or Secret in environment variables");
}

export const getOAuth2Client = () => {
    return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
};

export const saveTokens = async (tokens: any) => {
    // Check if tokens already exist
    const { data: existing } = await supabaseAdmin
        .from("google_tokens")
        .select("*")
        .eq("id", 1)
        .single();

    if (existing) {
        // Update - merge new tokens with existing
        const newAccessToken = tokens.access_token || existing.access_token;
        const newRefreshToken = tokens.refresh_token || existing.refresh_token;
        const newExpiry = tokens.expiry_date || existing.expiry_date;

        const { error } = await supabaseAdmin
            .from("google_tokens")
            .update({
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                scope: tokens.scope,
                token_type: tokens.token_type,
                expiry_date: newExpiry,
                updated_at: new Date().toISOString(),
            })
            .eq("id", 1);

        if (error) throw error;
    } else {
        // Insert
        const { error } = await supabaseAdmin
            .from("google_tokens")
            .insert({
                id: 1,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                scope: tokens.scope,
                token_type: tokens.token_type,
                expiry_date: tokens.expiry_date,
            });

        if (error) throw error;
    }
};

export const getStoredTokens = async () => {
    const { data, error } = await supabaseAdmin
        .from("google_tokens")
        .select("*")
        .eq("id", 1)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        console.error("Error fetching Google tokens:", error);
        return null;
    }

    return data;
};

export const getDriveClient = async () => {
    const tokens = await getStoredTokens();
    if (!tokens) {
        throw new Error("No Google Drive tokens found. Please connect your account.");
    }

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: parseInt(tokens.expiry_date),
    });

    // Handle token refresh events if needed, but googleapis handles it automatically if refresh_token is set
    // However, we should listen to 'tokens' event to save new tokens if they update
    oauth2Client.on('tokens', (newTokens) => {
        console.log('Tokens refreshed, saving to DB...');
        saveTokens(newTokens).catch(console.error);
    });

    return google.drive({ version: 'v3', auth: oauth2Client });
};
