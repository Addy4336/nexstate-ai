import { supabaseAdmin } from "./db";
import { syncEnquiryToZoho } from "./zoho-crm";

export interface EnquiryPayload {
    name: string;
    email: string;
    phone: string;
    message?: string;
    property_id?: string;
    move_in_date?: string;
    budget?: number;
    preferred_location?: string;
}

export interface EnquiryResult {
    id: string;
    status: "created" | "synced_zoho" | "failed";
    message: string;
}

/**
 * Universal CRM & Enquiry Adapter:
 * Stores lead natively in Supabase PostgreSQL (Free Tier).
 * Optionally dispatches background sync to Zoho CRM or Webhook adapters if configured.
 */
export async function processLeadEnquiry(payload: EnquiryPayload): Promise<EnquiryResult> {
    try {
        // 1. Primary Operation: Insert lead into Supabase PostgreSQL
        const { data: enquiry, error } = await supabaseAdmin
            .from("enquiry")
            .insert([
                {
                    name: payload.name,
                    email: payload.email,
                    phone: payload.phone,
                    message: payload.message || "",
                    property_id: payload.property_id || null,
                    move_in_date: payload.move_in_date || null,
                    status: "new",
                    created_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("[CRMAdapter] Supabase DB insertion failed:", error);
            throw new Error(error.message);
        }

        const enquiryId = enquiry.id;

        // 2. Secondary Operation: Optional Zoho CRM sync if credentials exist
        if (process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET) {
            // Asynchronous background dispatch
            syncEnquiryToZoho(enquiryId).catch((zohoErr) => {
                console.warn("[CRMAdapter] Optional Zoho CRM sync failed:", zohoErr);
            });

            return {
                id: enquiryId,
                status: "synced_zoho",
                message: "Lead successfully recorded in database and dispatched to Zoho CRM.",
            };
        }

        return {
            id: enquiryId,
            status: "created",
            message: "Lead successfully recorded in NexState AI database.",
        };
    } catch (err: any) {
        console.error("[CRMAdapter] Process enquiry exception:", err);
        return {
            id: `err_${Date.now()}`,
            status: "failed",
            message: err.message || "Failed to process lead enquiry.",
        };
    }
}
