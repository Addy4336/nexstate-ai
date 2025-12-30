"use server";

import { getZohoCreatorService } from "@/lib/zoho-crm";
import { pool } from "@/lib/db";

interface ZohoConfigData {
    owner_name: string;
    app_name: string;
    form_name: string;
    report_name: string;
    field_mapping: Record<string, string>;
    auto_sync: boolean;
}

/**
 * Get all Zoho Creator applications
 */
export async function getZohoApplications() {
    try {
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const result = await zoho.getApplications();
        return result;
    } catch (error: any) {
        console.error("Error fetching Zoho applications:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get forms for a specific Zoho Creator application
 */
export async function getZohoForms(ownerName: string, appLinkName: string) {
    try {
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const result = await zoho.getForms(ownerName, appLinkName);
        return result;
    } catch (error: any) {
        console.error("Error fetching Zoho forms:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get fields for a specific Zoho Creator form
 */
export async function getZohoFormFields(ownerName: string, appLinkName: string, formLinkName: string) {
    try {
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const result = await zoho.getFormFields(ownerName, appLinkName, formLinkName);
        return result;
    } catch (error: any) {
        console.error("Error fetching Zoho form fields:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get reports for a specific Zoho Creator application
 */
export async function getZohoReports(ownerName: string, appLinkName: string) {
    try {
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const result = await zoho.getReports(ownerName, appLinkName);
        return result;
    } catch (error: any) {
        console.error("Error fetching Zoho reports:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get Zoho Creator configuration from database
 */
export async function getZohoConfig() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM zoho_config WHERE id = 1");
        if (result.rows.length === 0) {
            return { success: true, data: null };
        }
        return { success: true, data: result.rows[0] };
    } catch (error: any) {
        console.error("Error fetching Zoho config:", error);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
}

/**
 * Save Zoho Creator configuration to database
 */
export async function saveZohoConfig(config: ZohoConfigData) {
    const client = await pool.connect();
    try {
        const existing = await client.query("SELECT * FROM zoho_config WHERE id = 1");

        if (existing.rows.length > 0) {
            await client.query(
                `UPDATE zoho_config 
                 SET owner_name = $1, app_name = $2, form_name = $3, report_name = $4, 
                     field_mapping = $5, auto_sync = $6, updated_at = NOW() 
                 WHERE id = 1`,
                [
                    config.owner_name,
                    config.app_name,
                    config.form_name,
                    config.report_name,
                    JSON.stringify(config.field_mapping),
                    config.auto_sync,
                ]
            );
        } else {
            await client.query(
                `INSERT INTO zoho_config (id, owner_name, app_name, form_name, report_name, field_mapping, auto_sync) 
                 VALUES (1, $1, $2, $3, $4, $5, $6)`,
                [
                    config.owner_name,
                    config.app_name,
                    config.form_name,
                    config.report_name,
                    JSON.stringify(config.field_mapping),
                    config.auto_sync,
                ]
            );
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error saving Zoho config:", error);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
}

/**
 * Sync properties from CMS to Zoho Creator
 */
export async function syncPropertiesToZoho() {
    try {
        // Get Zoho service and config
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const configResult = await getZohoConfig();
        if (!configResult.success || !configResult.data) {
            return { success: false, error: "Zoho configuration not found" };
        }

        const config = configResult.data;
        if (!config.owner_name || !config.app_name || !config.form_name) {
            return { success: false, error: "Incomplete Zoho configuration" };
        }

        // Get properties from database
        const client = await pool.connect();
        let properties;
        try {
            const result = await client.query("SELECT * FROM properties WHERE is_active = true");
            properties = result.rows;
        } finally {
            client.release();
        }

        if (!properties || properties.length === 0) {
            return { success: true, count: 0, message: "No properties to sync" };
        }

        // Map and sync each property
        const fieldMapping = config.field_mapping || {};
        let syncedCount = 0;

        for (const property of properties) {
            const zohoData: Record<string, any> = {};

            // Map CMS fields to Zoho fields
            for (const [cmsField, zohoField] of Object.entries(fieldMapping) as [string, string][]) {
                if (zohoField && property[cmsField] !== undefined) {
                    zohoData[zohoField as string] = property[cmsField];
                }
            }

            if (Object.keys(zohoData).length > 0) {
                const result = await zoho.addRecord(
                    config.owner_name,
                    config.app_name,
                    config.form_name,
                    zohoData
                );

                if (result.success) {
                    syncedCount++;
                }
            }
        }

        // Update last synced timestamp
        const updateClient = await pool.connect();
        try {
            await updateClient.query(
                "UPDATE zoho_config SET last_synced_at = NOW() WHERE id = 1"
            );
        } finally {
            updateClient.release();
        }

        return { success: true, count: syncedCount };
    } catch (error: any) {
        console.error("Error syncing properties to Zoho:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get records from a Zoho Creator report
 */
export async function getZohoCreatorRecords(
    ownerName: string,
    appName: string,
    reportName: string,
    options?: {
        criteria?: string;
        limit?: number;
        startIndex?: number;
    }
) {
    try {
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const result = await zoho.getRecords(ownerName, appName, reportName, options);
        return result;
    } catch (error: any) {
        console.error("Error fetching Zoho Creator records:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Add a new record to a Zoho Creator form
 */
export async function addZohoCreatorRecord(
    ownerName: string,
    appName: string,
    formName: string,
    data: Record<string, any>
) {
    try {
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const result = await zoho.addRecord(ownerName, appName, formName, data);
        return result;
    } catch (error: any) {
        console.error("Error adding Zoho Creator record:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update an existing record in Zoho Creator
 */
export async function updateZohoCreatorRecord(
    ownerName: string,
    appName: string,
    reportName: string,
    recordId: string,
    data: Record<string, any>
) {
    try {
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const result = await zoho.updateRecord(ownerName, appName, reportName, recordId, data);
        return result;
    } catch (error: any) {
        console.error("Error updating Zoho Creator record:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a record from Zoho Creator
 */
export async function deleteZohoCreatorRecord(
    ownerName: string,
    appName: string,
    reportName: string,
    recordId: string
) {
    try {
        const zoho = await getZohoCreatorService();
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const result = await zoho.deleteRecord(ownerName, appName, reportName, recordId);
        return result;
    } catch (error: any) {
        console.error("Error deleting Zoho Creator record:", error);
        return { success: false, error: error.message };
    }
}
