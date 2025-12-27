
import { google } from "googleapis";
import { pool } from "./db";

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
    const client = await pool.connect();
    try {
        // We only support one system account for now, so we use ID 1
        const existing = await client.query("SELECT * FROM google_tokens WHERE id = 1");

        if (existing.rows.length > 0) {
            // Update
            // Merge new tokens with existing (in case refresh_token is not returned in refresh flow)
            const current = existing.rows[0];
            const newAccessToken = tokens.access_token || current.access_token;
            const newRefreshToken = tokens.refresh_token || current.refresh_token; // Important: refresh token might not be returned on refresh
            const newExpiry = tokens.expiry_date || current.expiry_date;

            await client.query(
                `UPDATE google_tokens 
                 SET access_token = $1, refresh_token = $2, scope = $3, token_type = $4, expiry_date = $5, updated_at = NOW() 
                 WHERE id = 1`,
                [newAccessToken, newRefreshToken, tokens.scope, tokens.token_type, newExpiry]
            );
        } else {
            // Insert
            await client.query(
                `INSERT INTO google_tokens (id, access_token, refresh_token, scope, token_type, expiry_date) 
                 VALUES (1, $1, $2, $3, $4, $5)`,
                [tokens.access_token, tokens.refresh_token, tokens.scope, tokens.token_type, tokens.expiry_date]
            );
        }
    } finally {
        client.release();
    }
};

export const getStoredTokens = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM google_tokens WHERE id = 1");
        if (result.rows.length === 0) return null;
        return result.rows[0];
    } finally {
        client.release();
    }
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
