
import { pool } from "@/lib/db";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-constants";

export interface Enquiry {
    id: string;
    type: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    property_id?: string;
    property_title?: string;
    status: string;
    assigned_to?: string;
    assigned_user_name?: string;
    created_at: string;
    updated_at: string;
}

export interface StaffUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

// Re-export for backward compatibility
export { ENQUIRY_STATUSES };

export async function getEnquiries() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT 
                e.*,
                u.name as assigned_user_name
            FROM enquiry e
            LEFT JOIN "user" u ON e.assigned_to = u.id
            ORDER BY 
                CASE e.status 
                    WHEN 'new' THEN 1 
                    WHEN 'contacted' THEN 2 
                    WHEN 'in_progress' THEN 3
                    WHEN 'converted' THEN 4 
                    ELSE 5 
                END,
                e.created_at DESC
        `);
        return res.rows as Enquiry[];
    } finally {
        client.release();
    }
}

export async function getEnquiryById(id: string) {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT 
                e.*,
                u.name as assigned_user_name
            FROM enquiry e
            LEFT JOIN "user" u ON e.assigned_to = u.id
            WHERE e.id = $1
        `, [id]);
        return res.rows[0] as Enquiry | null;
    } finally {
        client.release();
    }
}

export async function getStaffUsers(): Promise<StaffUser[]> {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT id, name, email, role 
            FROM "user" 
            WHERE role IN ('admin', 'manager', 'editor')
            AND (banned IS NULL OR banned = false)
            ORDER BY name ASC
        `);
        return res.rows as StaffUser[];
    } finally {
        client.release();
    }
}

export async function getEnquiryStats() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'new') as new_count,
                COUNT(*) FILTER (WHERE status = 'contacted') as contacted_count,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
                COUNT(*) FILTER (WHERE status = 'converted') as converted_count,
                COUNT(*) FILTER (WHERE status = 'closed') as closed_count,
                COUNT(*) as total_count
            FROM enquiry
        `);
        return res.rows[0];
    } finally {
        client.release();
    }
}
