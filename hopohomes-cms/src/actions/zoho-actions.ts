"use server";

import { getZohoCreatorService } from "@/lib/zoho-crm";
import { supabaseAdmin } from "@/lib/db";

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
export async function getZohoApplications(adminId: string) {
    try {
        const zoho = await getZohoCreatorService(adminId);
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected for this admin" };
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
export async function getZohoForms(ownerName: string, appLinkName: string, adminId: string) {
    try {
        const zoho = await getZohoCreatorService(adminId);
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
export async function getZohoFormFields(ownerName: string, appLinkName: string, formLinkName: string, adminId: string) {
    try {
        const zoho = await getZohoCreatorService(adminId);
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
export async function getZohoReports(ownerName: string, appLinkName: string, adminId: string) {
    try {
        const zoho = await getZohoCreatorService(adminId);
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
 * Get Zoho Creator configuration from database for a specific admin
 */
export async function getZohoConfig(adminId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from("zoho_config")
            .select("*")
            .eq("admin_id", adminId)
            .single();
        
        if (error && error.code !== "PGRST116") {
            // PGRST116 is "no rows returned", which is expected if config doesn't exist
            console.error("Error fetching Zoho config:", error);
            return { success: false, error: error.message };
        }
        
        return { success: true, data: data || null };
    } catch (error: any) {
        console.error("Error fetching Zoho config:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Save Zoho Creator configuration to database for a specific admin
 */
export async function saveZohoConfig(config: ZohoConfigData, adminId: string) {
    try {
        const { data: existing } = await supabaseAdmin
            .from("zoho_config")
            .select("*")
            .eq("admin_id", adminId)
            .single();

        if (existing) {
            const { error } = await supabaseAdmin
                .from("zoho_config")
                .update({
                    owner_name: config.owner_name,
                    app_name: config.app_name,
                    form_name: config.form_name,
                    report_name: config.report_name,
                    field_mapping: config.field_mapping,
                    auto_sync: config.auto_sync,
                    updated_at: new Date().toISOString(),
                })
                .eq("admin_id", adminId);
            
            if (error) {
                console.error("Error updating Zoho config:", error);
                return { success: false, error: error.message };
            }
        } else {
            const { error } = await supabaseAdmin
                .from("zoho_config")
                .insert({
                    admin_id: adminId,
                    owner_name: config.owner_name,
                    app_name: config.app_name,
                    form_name: config.form_name,
                    report_name: config.report_name,
                    field_mapping: config.field_mapping,
                    auto_sync: config.auto_sync,
                });
            
            if (error) {
                console.error("Error inserting Zoho config:", error);
                return { success: false, error: error.message };
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error saving Zoho config:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Sync properties from CMS to Zoho Creator
 */
export async function syncPropertiesToZoho(adminId: string) {
    try {
        // Get Zoho service and config
        const zoho = await getZohoCreatorService(adminId);
        if (!zoho) {
            return { success: false, error: "Zoho Creator not connected" };
        }

        const configResult = await getZohoConfig(adminId);
        if (!configResult.success || !configResult.data) {
            return { success: false, error: "Zoho configuration not found" };
        }

        const config = configResult.data;
        if (!config.owner_name || !config.app_name || !config.form_name) {
            return { success: false, error: "Incomplete Zoho configuration" };
        }

        // Get properties from database
        const { data: properties, error: propertiesError } = await supabaseAdmin
            .from("property")
            .select("*")
            .eq("status", "available");

        if (propertiesError) {
            console.error("Error fetching properties:", propertiesError);
            return { success: false, error: propertiesError.message };
        }

        if (!properties || properties.length === 0) {
            return { success: true, count: 0, message: "No properties to sync" };
        }

        // Map and sync each property
        const fieldMapping = config.field_mapping || {};
        console.log("🗺️ Field mapping from config:", JSON.stringify(fieldMapping, null, 2));
        
        let syncedCount = 0;

        for (const property of properties) {
            const zohoData: Record<string, any> = {};

            // Map CMS fields to Zoho fields
            for (const [cmsField, zohoField] of Object.entries(fieldMapping) as [string, string][]) {
                if (zohoField && zohoField !== "" && property[cmsField] !== undefined && property[cmsField] !== null) {
                    const fieldValue = property[cmsField];
                    
                    // Special handling for Full_Address - Zoho Address fields need structured data
                    if (zohoField === 'Full_Address') {
                        zohoData[zohoField] = {
                            address_line_1: String(fieldValue)
                        };
                    } 
                    // Handle array fields (images, amenities, etc.)
                    else if (Array.isArray(fieldValue)) {
                        if (cmsField === 'cover_image' || cmsField === 'images') {
                            // For image fields, use the first URL if available
                            zohoData[zohoField] = fieldValue.length > 0 ? fieldValue[0] : "";
                        } else if (cmsField === 'amenities') {
                            // For amenities, join with commas
                            zohoData[zohoField] = fieldValue.join(", ");
                        } else {
                            // For other arrays, convert to JSON string or comma-separated
                            zohoData[zohoField] = fieldValue.join(", ");
                        }
                    }
                    // Handle boolean fields
                    else if (typeof fieldValue === 'boolean') {
                        zohoData[zohoField] = fieldValue ? "Yes" : "No";
                    }
                    // Handle numeric fields
                    else if (typeof fieldValue === 'number') {
                        // Convert numbers to strings for Zoho (handles currency, decimal, number fields)
                        zohoData[zohoField] = String(fieldValue);
                    } 
                    // Handle regular string fields
                    else {
                        zohoData[zohoField] = fieldValue;
                    }
                }
            }

            console.log("📤 Mapped property data for Zoho:", JSON.stringify(zohoData, null, 2));

            if (Object.keys(zohoData).length > 0) {
                const result = await zoho.addRecord(
                    config.owner_name,
                    config.app_name,
                    config.form_name,
                    zohoData
                );

                if (result.success) {
                    syncedCount++;
                } else {
                    console.error(`❌ Failed to sync property ${property.id}:`, result.error);
                }
            }
        }

        // Update last synced timestamp
        await supabaseAdmin
            .from("zoho_config")
            .update({ last_synced_at: new Date().toISOString() })
            .eq("admin_id", adminId);

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
    adminId: string,
    options?: {
        criteria?: string;
        limit?: number;
        startIndex?: number;
    }
) {
    try {
        const zoho = await getZohoCreatorService(adminId);
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
    data: Record<string, any>,
    adminId: string
) {
    try {
        const zoho = await getZohoCreatorService(adminId);
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
    data: Record<string, any>,
    adminId: string
) {
    try {
        const zoho = await getZohoCreatorService(adminId);
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
    recordId: string,
    adminId: string
) {
    try {
        const zoho = await getZohoCreatorService(adminId);
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
