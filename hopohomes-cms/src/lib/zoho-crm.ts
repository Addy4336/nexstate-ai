// Zoho Creator Integration Service

import { supabaseAdmin } from "./db";

interface ZohoTokenResponse {
    access_token: string;
    expires_in: number;
    api_domain: string;
    token_type: string;
    refresh_token?: string;
}

interface StoredZohoTokens {
    id: string; // UUID
    admin_id: string; // UUID of the admin who owns these tokens
    access_token: string;
    refresh_token: string;
    api_domain: string;
    expires_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

// Environment variables
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
// Note: ZOHO_REGION is for initial auth URL only. Actual region is determined by Zoho's callback
const ZOHO_REGION = process.env.ZOHO_REGION || "com"; // Default to .com (US) as Zoho often uses this
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
const REDIRECT_URI = `${NEXT_PUBLIC_APP_URL}/api/auth/zoho/callback`;

// Get domains based on region
function getZohoDomains(region: string = ZOHO_REGION) {
    const domains: Record<string, { api: string; creator: string; accounts: string }> = {
        in: {
            api: "https://www.zohoapis.in",
            creator: "https://creator.zoho.in",
            accounts: "https://accounts.zoho.in"
        },
        eu: {
            api: "https://www.zohoapis.eu",
            creator: "https://creator.zoho.eu",
            accounts: "https://accounts.zoho.eu"
        },
        au: {
            api: "https://www.zohoapis.com.au",
            creator: "https://creator.zoho.com.au",
            accounts: "https://accounts.zoho.com.au"
        },
        com: {
            api: "https://www.zohoapis.com",
            creator: "https://creator.zoho.com",
            accounts: "https://accounts.zoho.com"
        },
    };
    // Map 'us' to 'com' for compatibility
    if (region === 'us') region = 'com';
    return domains[region] || domains.com;
}

/**
 * Get Zoho OAuth authorization URL
 */
export function getZohoAuthUrl(): string {
    if (!ZOHO_CLIENT_ID) {
        throw new Error("ZOHO_CLIENT_ID not configured");
    }

    const { accounts } = getZohoDomains();
    // Scopes for Zoho Creator
    const scopes = [
        "ZohoCreator.report.ALL",
        "ZohoCreator.form.ALL",
        "ZohoCreator.dashboard.READ",
        "ZohoCreator.meta.application.READ",
        "ZohoCreator.meta.form.READ",
    ].join(",");

    console.log("🔍 Zoho OAuth Debug:");
    console.log("  - NEXT_PUBLIC_APP_URL:", NEXT_PUBLIC_APP_URL);
    console.log("  - REDIRECT_URI:", REDIRECT_URI);
    console.log("  - Accounts Domain:", accounts);
    console.log("  - Scopes:", scopes);
    console.log("  ⚠️  Note: Zoho will determine actual region in callback");

    const params = new URLSearchParams({
        client_id: ZOHO_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        access_type: "offline", // Request offline access for refresh token
        scope: scopes,
        prompt: "consent", // Force consent screen to get refresh token
    });

    const authUrl = `${accounts}/oauth/v2/auth?${params.toString()}`;
    console.log("  - Full Auth URL:", authUrl);

    return authUrl;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string, accountsServerOverride?: string): Promise<ZohoTokenResponse> {
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        throw new Error("Zoho credentials not configured");
    }

    // Use the accounts server from Zoho's redirect, or fall back to configured region
    const accountsServer = accountsServerOverride || getZohoDomains().accounts;

    console.log("🔄 Exchanging code with Zoho...");
    console.log("  - Accounts domain:", accountsServer);
    console.log("  - Redirect URI:", REDIRECT_URI);
    console.log("  - Using override:", !!accountsServerOverride);
    console.log("  - Request URL:", `${accountsServer}/oauth/v2/token`);

    const requestBody = new URLSearchParams({
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
        grant_type: "authorization_code",
    });

    console.log("  - Request body:", requestBody.toString());

    const response = await fetch(`${accountsServer}/oauth/v2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
    });

    console.log("  - Response status:", response.status, response.statusText);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Token exchange failed:");
        console.error("   Status:", response.status);
        console.error("   Response:", errorText);
        throw new Error(`Token exchange failed (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    console.log("  - Raw response:", responseText);

    const tokenData: ZohoTokenResponse = JSON.parse(responseText);
    
    console.log("📦 Token exchange response:");
    console.log("  - Has access_token:", !!tokenData.access_token);
    console.log("  - Has refresh_token:", !!tokenData.refresh_token);
    console.log("  - Token type:", tokenData.token_type);
    console.log("  - Expires in:", tokenData.expires_in, "seconds");
    console.log("  - API domain:", tokenData.api_domain);
    
    // Log the FULL response for debugging (without exposing sensitive data)
    console.log("  - All response keys:", Object.keys(tokenData));

    return tokenData;
}

/**
 * Save Zoho tokens to database
 */
export async function saveZohoTokens(tokens: ZohoTokenResponse, adminId: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in - 300); // 5 min buffer

    console.log("🔍 Token Response Debug:");
    console.log("  - Admin ID:", adminId);
    console.log("  - Has refresh_token:", !!tokens.refresh_token);
    console.log("  - Has access_token:", !!tokens.access_token);
    console.log("  - Expires in:", tokens.expires_in, "seconds");

    // Check if tokens already exist for this admin
    const { data: existing, error: fetchError } = await supabaseAdmin
        .from("zoho_tokens")
        .select("*")
        .eq("admin_id", adminId)
        .single();

    if (existing) {
        // Update - preserve refresh_token if not returned
        const newRefreshToken = tokens.refresh_token || existing.refresh_token;

        if (!newRefreshToken) {
            throw new Error(
                "No refresh token available. Please revoke access in Zoho and reconnect. " +
                "Zoho only returns refresh tokens on first authorization or when access_type=offline is used."
            );
        }

        const { error } = await supabaseAdmin
            .from("zoho_tokens")
            .update({
                access_token: tokens.access_token,
                refresh_token: newRefreshToken,
                api_domain: tokens.api_domain || getZohoDomains().api,
                expires_at: expiresAt.toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq("admin_id", adminId);

        if (error) throw error;
        console.log("✅ Zoho tokens updated in database (refresh token preserved) for admin:", adminId);
    } else {
        // Insert - This is the first connection
        if (!tokens.refresh_token) {
            throw new Error(
                "No refresh token received from Zoho on first authorization. " +
                "This might indicate an issue with the OAuth flow. " +
                "Please ensure the authorization URL includes access_type=offline and prompt=consent. " +
                "You may also need to revoke access in your Zoho account settings and try again."
            );
        }

        const { error } = await supabaseAdmin
            .from("zoho_tokens")
            .insert({
                admin_id: adminId,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                api_domain: tokens.api_domain || getZohoDomains().api,
                expires_at: expiresAt.toISOString(),
            });

        if (error) throw error;
        console.log("✅ Zoho tokens saved to database (first connection) for admin:", adminId);
    }
}

/**
 * Get stored Zoho tokens from database for a specific admin
 */
export async function getStoredZohoTokens(adminId: string): Promise<StoredZohoTokens | null> {
    try {
        const { data, error } = await supabaseAdmin
            .from("zoho_tokens")
            .select("*")
            .eq("admin_id", adminId)
            .single();

        if (error) {
            // Table might not exist yet or no data
            if (error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.warn("⚠️ Could not query zoho_tokens table:", error);
            }
            return null;
        }

        return data;
    } catch (error) {
        console.warn("⚠️ Could not query zoho_tokens table:", error);
        return null;
    }
}

/**
 * Zoho Creator Service class for API operations
 */
export class ZohoCreatorService {
    private clientId: string;
    private clientSecret: string;
    private refreshToken: string;
    private adminId: string;
    private accessToken: string | null = null;
    private tokenExpiresAt: Date | null = null;
    private creatorDomain: string;
    private accountsDomain: string;

    constructor(
        clientId: string,
        clientSecret: string,
        refreshToken: string,
        adminId: string,
        options?: {
            accessToken?: string;
            expiresAt?: Date;
        }
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        this.adminId = adminId;

        const { creator, accounts } = getZohoDomains();
        this.creatorDomain = creator;
        this.accountsDomain = accounts;

        if (options?.accessToken) {
            this.accessToken = options.accessToken;
            this.tokenExpiresAt = options.expiresAt || null;
        }
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(): Promise<string> {
        try {
            const response = await fetch(`${this.accountsDomain}/oauth/v2/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: this.refreshToken,
                    grant_type: "refresh_token",
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Token refresh failed: ${errorText}`);
            }

            const tokens: ZohoTokenResponse = await response.json();

            this.accessToken = tokens.access_token;

            // Set expiration time (with 5 minute buffer)
            this.tokenExpiresAt = new Date();
            this.tokenExpiresAt.setSeconds(this.tokenExpiresAt.getSeconds() + tokens.expires_in - 300);

            // Save updated tokens to database
            await saveZohoTokens(tokens, this.adminId);

            console.log("✅ Zoho Creator access token refreshed for admin:", this.adminId);
            return this.accessToken;
        } catch (error: any) {
            console.error("❌ Failed to refresh Zoho token:", error.message);
            throw new Error("Failed to refresh Zoho access token");
        }
    }

    /**
     * Get valid access token (refresh if needed)
     */
    async getValidAccessToken(): Promise<string> {
        if (!this.accessToken || !this.tokenExpiresAt || new Date() >= this.tokenExpiresAt) {
            await this.refreshAccessToken();
        }
        return this.accessToken!;
    }

    /**
     * Get all applications for the authenticated user
     */
    async getApplications(): Promise<{ success: boolean; applications?: any[]; error?: string }> {
        try {
            const accessToken = await this.getValidAccessToken();

            const url = `${this.creatorDomain}/api/v2/applications`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("❌ Zoho Creator API error:", result);
                return {
                    success: false,
                    error: result.message || result.description || "Failed to fetch applications",
                };
            }

            console.log("✅ Applications fetched from Zoho Creator");
            if (result.applications && result.applications.length > 0) {
                console.log("🔍 First application structure:", JSON.stringify(result.applications[0], null, 2));
            }
            return { success: true, applications: result.applications || [] };
        } catch (error: any) {
            console.error("❌ Failed to fetch applications:", error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get forms for a specific application
     */
    async getForms(ownerName: string, appLinkName: string): Promise<{ success: boolean; forms?: any[]; error?: string }> {
        try {
            const accessToken = await this.getValidAccessToken();

            const url = `${this.creatorDomain}/api/v2/${ownerName}/${appLinkName}/forms`;
            console.log(`🔍 Fetching forms from: ${url}`);

            const response = await fetch(url, {
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("❌ Zoho Creator API error:", result);
                return {
                    success: false,
                    error: result.message || result.description || "Failed to fetch forms",
                };
            }

            console.log("✅ Forms fetched from Zoho Creator");
            return { success: true, forms: result.forms || [] };
        } catch (error: any) {
            console.error("❌ Failed to fetch forms:", error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get fields for a specific form
     */
    async getFormFields(ownerName: string, appLinkName: string, formLinkName: string): Promise<{ success: boolean; fields?: any[]; error?: string }> {
        try {
            const accessToken = await this.getValidAccessToken();

            const url = `${this.creatorDomain}/api/v2/${ownerName}/${appLinkName}/form/${formLinkName}/fields`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("❌ Zoho Creator API error:", result);
                return {
                    success: false,
                    error: result.message || result.description || "Failed to fetch form fields",
                };
            }

            console.log("✅ Form fields fetched from Zoho Creator");
            console.log("📋 Available fields:", result.fields?.map((f: any) => ({
                display_name: f.display_name,
                link_name: f.link_name,
                type: f.type
            })));
            return { success: true, fields: result.fields || [] };
        } catch (error: any) {
            console.error("❌ Failed to fetch form fields:", error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get reports for a specific application
     */
    async getReports(ownerName: string, appLinkName: string): Promise<{ success: boolean; reports?: any[]; error?: string }> {
        try {
            const accessToken = await this.getValidAccessToken();

            const url = `${this.creatorDomain}/api/v2/${ownerName}/${appLinkName}/reports`; console.log("🔍 Fetching forms from:", url);
            const response = await fetch(url, {
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("❌ Zoho Creator API error:", result);
                return {
                    success: false,
                    error: result.message || result.description || "Failed to fetch reports",
                };
            }

            console.log("✅ Reports fetched from Zoho Creator");
            return { success: true, reports: result.reports || [] };
        } catch (error: any) {
            console.error("❌ Failed to fetch reports:", error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get records from a Zoho Creator report
     * @param ownerName - The owner/account name of the Creator application
     * @param appName - The application link name
     * @param reportName - The report link name
     * @param criteria - Optional criteria for filtering records
     */
    async getRecords(
        ownerName: string,
        appName: string,
        reportName: string,
        options?: {
            criteria?: string;
            limit?: number;
            startIndex?: number;
        }
    ): Promise<{ success: boolean; data?: any[]; error?: string }> {
        try {
            const accessToken = await this.getValidAccessToken();

            let url = `${this.creatorDomain}/api/v2/${ownerName}/${appName}/report/${reportName}`;
            const params = new URLSearchParams();

            if (options?.criteria) {
                params.append("criteria", options.criteria);
            }
            if (options?.limit) {
                params.append("limit", options.limit.toString());
            }
            if (options?.startIndex) {
                params.append("from", options.startIndex.toString());
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("❌ Zoho Creator API error:", result);
                return {
                    success: false,
                    error: result.message || "Failed to fetch records",
                };
            }

            console.log("✅ Records fetched from Zoho Creator");
            return { success: true, data: result.data || [] };
        } catch (error: any) {
            console.error("❌ Failed to fetch records:", error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Add a new record to a Zoho Creator form
     * @param ownerName - The owner/account name of the Creator application
     * @param appName - The application link name
     * @param formName - The form link name
     * @param data - The record data to add
     */
    async addRecord(
        ownerName: string,
        appName: string,
        formName: string,
        data: Record<string, any>
    ): Promise<{ success: boolean; recordId?: string; error?: string }> {
        try {
            const accessToken = await this.getValidAccessToken();

            const url = `${this.creatorDomain}/api/v2/${ownerName}/${appName}/form/${formName}`;

            // Debug: log the data being sent
            console.log("🔍 Sending data to Zoho:", JSON.stringify({ data }, null, 2));

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data }),
            });

            const result = await response.json();

            // Debug: log the full response to understand its structure
            console.log("🔍 Zoho addRecord response:", JSON.stringify(result, null, 2));

            // Check for errors - Zoho may return 200 OK but with error in body
            if (!response.ok || result.code || result.error) {
                console.error("❌ Zoho Creator API error:", result);
                const errorMessage = result.error
                    ? (Array.isArray(result.error) ? result.error.join(", ") : result.error)
                    : result.message || `Error code: ${result.code}`;
                return {
                    success: false,
                    error: errorMessage,
                };
            }

            // Try different ways to get the record ID based on Zoho's response format
            const recordId = result.data?.ID || result.data?.id || result.ID || result.id || result.data?.[0]?.ID;
            console.log("✅ Record added to Zoho Creator:", recordId);
            return { success: true, recordId };
        } catch (error: any) {
            console.error("❌ Failed to add record:", error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update an existing record in Zoho Creator
     * @param ownerName - The owner/account name of the Creator application
     * @param appName - The application link name
     * @param reportName - The report link name
     * @param recordId - The ID of the record to update
     * @param data - The updated record data
     */
    async updateRecord(
        ownerName: string,
        appName: string,
        reportName: string,
        recordId: string,
        data: Record<string, any>
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const accessToken = await this.getValidAccessToken();

            const url = `${this.creatorDomain}/api/v2/${ownerName}/${appName}/report/${reportName}/${recordId}`;

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data }),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("❌ Zoho Creator API error:", result);
                return {
                    success: false,
                    error: result.message || "Failed to update record",
                };
            }

            console.log("✅ Record updated in Zoho Creator:", recordId);
            return { success: true };
        } catch (error: any) {
            console.error("❌ Failed to update record:", error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete a record from Zoho Creator
     * @param ownerName - The owner/account name of the Creator application
     * @param appName - The application link name
     * @param reportName - The report link name
     * @param recordId - The ID of the record to delete
     */
    async deleteRecord(
        ownerName: string,
        appName: string,
        reportName: string,
        recordId: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const accessToken = await this.getValidAccessToken();

            const url = `${this.creatorDomain}/api/v2/${ownerName}/${appName}/report/${reportName}/${recordId}`;

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("❌ Zoho Creator API error:", result);
                return {
                    success: false,
                    error: result.message || "Failed to delete record",
                };
            }

            console.log("✅ Record deleted from Zoho Creator:", recordId);
            return { success: true };
        } catch (error: any) {
            console.error("❌ Failed to delete record:", error.message);
            return { success: false, error: error.message };
        }
    }
}

/**
 * Get Zoho Creator service instance from stored tokens for a specific admin
 */
export async function getZohoCreatorService(adminId: string): Promise<ZohoCreatorService | null> {
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        console.warn("⚠️ Zoho Creator credentials not configured");
        return null;
    }

    const tokens = await getStoredZohoTokens(adminId);
    if (!tokens) {
        console.warn("⚠️ No Zoho tokens found for admin:", adminId);
        return null;
    }

    return new ZohoCreatorService(ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, tokens.refresh_token, adminId, {
        accessToken: tokens.access_token,
        expiresAt: tokens.expires_at || undefined,
    });
}
