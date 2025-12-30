// Zoho Creator Integration Service

import { pool } from "./db";

interface ZohoTokenResponse {
    access_token: string;
    expires_in: number;
    api_domain: string;
    token_type: string;
    refresh_token?: string;
}

interface StoredZohoTokens {
    id: number;
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
const ZOHO_REGION = process.env.ZOHO_REGION || "in";
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
        us: {
            api: "https://www.zohoapis.com",
            creator: "https://creator.zoho.com",
            accounts: "https://accounts.zoho.com"
        },
    };
    return domains[region] || domains.us;
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

    const params = new URLSearchParams({
        client_id: ZOHO_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        access_type: "offline",
        scope: scopes,
        prompt: "consent",
    });

    return `${accounts}/oauth/v2/auth?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<ZohoTokenResponse> {
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        throw new Error("Zoho credentials not configured");
    }

    const { accounts } = getZohoDomains();

    const response = await fetch(`${accounts}/oauth/v2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: ZOHO_CLIENT_ID,
            client_secret: ZOHO_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code,
            grant_type: "authorization_code",
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${errorText}`);
    }

    return response.json();
}

/**
 * Save Zoho tokens to database
 */
export async function saveZohoTokens(tokens: ZohoTokenResponse): Promise<void> {
    const client = await pool.connect();
    try {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in - 300); // 5 min buffer

        const existing = await client.query("SELECT * FROM zoho_tokens WHERE id = 1");

        if (existing.rows.length > 0) {
            // Update - preserve refresh_token if not returned
            const current = existing.rows[0];
            const newRefreshToken = tokens.refresh_token || current.refresh_token;

            await client.query(
                `UPDATE zoho_tokens 
                 SET access_token = $1, refresh_token = $2, api_domain = $3, expires_at = $4, updated_at = NOW() 
                 WHERE id = 1`,
                [tokens.access_token, newRefreshToken, tokens.api_domain || getZohoDomains().api, expiresAt]
            );
        } else {
            // Insert
            if (!tokens.refresh_token) {
                throw new Error("No refresh token received from Zoho");
            }
            await client.query(
                `INSERT INTO zoho_tokens (id, access_token, refresh_token, api_domain, expires_at) 
                 VALUES (1, $1, $2, $3, $4)`,
                [tokens.access_token, tokens.refresh_token, tokens.api_domain || getZohoDomains().api, expiresAt]
            );
        }
        console.log("✅ Zoho tokens saved to database");
    } finally {
        client.release();
    }
}

/**
 * Get stored Zoho tokens from database
 */
export async function getStoredZohoTokens(): Promise<StoredZohoTokens | null> {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM zoho_tokens WHERE id = 1");
        if (result.rows.length === 0) return null;
        return result.rows[0];
    } catch (error) {
        // Table might not exist yet
        console.warn("⚠️ Could not query zoho_tokens table:", error);
        return null;
    } finally {
        client.release();
    }
}

/**
 * Zoho Creator Service class for API operations
 */
export class ZohoCreatorService {
    private clientId: string;
    private clientSecret: string;
    private refreshToken: string;
    private accessToken: string | null = null;
    private tokenExpiresAt: Date | null = null;
    private creatorDomain: string;
    private accountsDomain: string;

    constructor(
        clientId: string,
        clientSecret: string,
        refreshToken: string,
        options?: {
            accessToken?: string;
            expiresAt?: Date;
        }
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;

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
            await saveZohoTokens(tokens);

            console.log("✅ Zoho Creator access token refreshed");
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
            
            const url = `${this.creatorDomain}/api/v2/${ownerName}/${appLinkName}/reports`;            console.log("🔍 Fetching forms from:", url);
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

            const response = await fetch(url, {
                method: "POST",
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
                    error: result.message || "Failed to add record",
                };
            }

            const recordId = result.data?.ID;
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
 * Get Zoho Creator service instance from stored tokens
 */
export async function getZohoCreatorService(): Promise<ZohoCreatorService | null> {
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        console.warn("⚠️ Zoho Creator credentials not configured");
        return null;
    }

    const tokens = await getStoredZohoTokens();
    if (!tokens) {
        console.warn("⚠️ No Zoho tokens found. Please connect your account.");
        return null;
    }

    return new ZohoCreatorService(ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, tokens.refresh_token, {
        accessToken: tokens.access_token,
        expiresAt: tokens.expires_at || undefined,
    });
}
