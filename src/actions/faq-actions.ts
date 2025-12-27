"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const FAQ_CATEGORIES = [
    "general",
    "properties",
    "investment",
    "buying",
    "selling",
    "renting",
    "legal",
    "finance",
];

export async function getFaqs() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM faq 
            ORDER BY sort_order ASC, created_at DESC
        `);
        return result.rows as FAQ[];
    } finally {
        client.release();
    }
}

export async function getFaqById(id: string) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT * FROM faq WHERE id = $1`,
            [id]
        );
        return result.rows[0] as FAQ | null;
    } finally {
        client.release();
    }
}

export async function createFaq(formData: FormData) {
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const category = formData.get("category") as string || "general";
    const sortOrder = parseInt(formData.get("sort_order") as string || "0", 10);
    const isActive = formData.get("is_active") === "true";

    if (!question || !answer) {
        return { error: "Question and answer are required" };
    }

    const client = await pool.connect();
    try {
        await client.query(
            `INSERT INTO faq (question, answer, category, sort_order, is_active)
             VALUES ($1, $2, $3, $4, $5)`,
            [question, answer, category, sortOrder, isActive]
        );

        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating FAQ:", error);
        return { error: error.message || "Failed to create FAQ" };
    } finally {
        client.release();
    }
}

export async function updateFaq(id: string, formData: FormData) {
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const category = formData.get("category") as string || "general";
    const sortOrder = parseInt(formData.get("sort_order") as string || "0", 10);
    const isActive = formData.get("is_active") === "true";

    if (!question || !answer) {
        return { error: "Question and answer are required" };
    }

    const client = await pool.connect();
    try {
        await client.query(
            `UPDATE faq 
             SET question = $1, answer = $2, category = $3, sort_order = $4, is_active = $5, updated_at = now()
             WHERE id = $6`,
            [question, answer, category, sortOrder, isActive, id]
        );

        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating FAQ:", error);
        return { error: error.message || "Failed to update FAQ" };
    } finally {
        client.release();
    }
}

export async function deleteFaq(id: string) {
    const client = await pool.connect();
    try {
        await client.query(`DELETE FROM faq WHERE id = $1`, [id]);
        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting FAQ:", error);
        return { error: error.message || "Failed to delete FAQ" };
    } finally {
        client.release();
    }
}

export async function toggleFaqActive(id: string, isActive: boolean) {
    const client = await pool.connect();
    try {
        await client.query(
            `UPDATE faq SET is_active = $1, updated_at = now() WHERE id = $2`,
            [isActive, id]
        );
        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error toggling FAQ:", error);
        return { error: error.message || "Failed to toggle FAQ" };
    } finally {
        client.release();
    }
}

export async function reorderFaqs(faqIds: string[]) {
    const client = await pool.connect();
    try {
        // Update sort_order for each FAQ based on its position in the array
        for (let i = 0; i < faqIds.length; i++) {
            await client.query(
                `UPDATE faq SET sort_order = $1, updated_at = now() WHERE id = $2`,
                [i, faqIds[i]]
            );
        }
        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error reordering FAQs:", error);
        return { error: error.message || "Failed to reorder FAQs" };
    } finally {
        client.release();
    }
}
