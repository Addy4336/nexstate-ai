"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitEnquiry(formData: FormData) {
    const client = await pool.connect();

    const type = formData.get("type") as string || "general_contact";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const propertyId = formData.get("propertyId") as string;
    const propertyTitle = formData.get("propertyTitle") as string;

    // Basic validation
    if (!name || !email || !message) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        await client.query(
            `INSERT INTO enquiry (
        type, name, email, phone, message, 
        property_id, property_title, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')`,
            [type, name, email, phone, message, propertyId || null, propertyTitle || null]
        );

        // In a real app, we would send an email notification here
        revalidatePath("/admin/leads");

        return { success: true };
    } catch (error: any) {
        console.error("Error submitting enquiry:", error);
        return { success: false, error: "Failed to submit enquiry. Please try again." };
    } finally {
        client.release();
    }
}

export async function updateEnquiryStatus(id: string, status: string) {
    const validStatuses = ['new', 'contacted', 'in_progress', 'converted', 'closed'];
    if (!validStatuses.includes(status)) {
        return { success: false, error: "Invalid status" };
    }

    const client = await pool.connect();
    try {
        await client.query(
            `UPDATE enquiry SET status = $1, updated_at = now() WHERE id = $2`,
            [status, id]
        );
        revalidatePath("/admin/leads");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating enquiry status:", error);
        return { success: false, error: "Failed to update status" };
    } finally {
        client.release();
    }
}

export async function assignEnquiry(id: string, userId: string | null) {
    const client = await pool.connect();
    try {
        await client.query(
            `UPDATE enquiry SET assigned_to = $1, updated_at = now() WHERE id = $2`,
            [userId || null, id]
        );
        revalidatePath("/admin/leads");
        return { success: true };
    } catch (error: any) {
        console.error("Error assigning enquiry:", error);
        return { success: false, error: "Failed to assign enquiry" };
    } finally {
        client.release();
    }
}

export async function deleteEnquiry(id: string) {
    const client = await pool.connect();
    try {
        await client.query(`DELETE FROM enquiry WHERE id = $1`, [id]);
        revalidatePath("/admin/leads");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting enquiry:", error);
        return { success: false, error: "Failed to delete enquiry" };
    } finally {
        client.release();
    }
}
