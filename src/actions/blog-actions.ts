"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
}

export async function createBlogPost(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string || "general";
    const status = formData.get("status") as string || "draft";
    const drive_folder_id = formData.get("folderId") as string;

    // Generate slug from title
    let slug = formData.get("slug") as string;
    if (!slug) {
        slug = generateSlug(title);
    }

    // Images are passed as comma-separated string from client component
    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").filter(Boolean) : [];

    // Cover image is the first image
    const cover_image = images.length > 0 ? images[0] : null;

    // Set published_at if status is published
    const published_at = status === "published" ? new Date() : null;

    const client = await pool.connect();
    try {
        // Check if slug already exists
        const existingSlug = await client.query(
            `SELECT id FROM blog WHERE slug = $1`,
            [slug]
        );

        if (existingSlug.rows.length > 0) {
            // Append timestamp to make slug unique
            slug = `${slug}-${Date.now()}`;
        }

        await client.query(
            `INSERT INTO blog (
                title, slug, content, excerpt, cover_image, 
                images, category, status, published_at, drive_folder_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                title, slug, content, excerpt, cover_image,
                images, category, status, published_at, drive_folder_id
            ]
        );
    } catch (error: any) {
        console.error("Error creating blog post:", error);
        return { error: error.message };
    } finally {
        client.release();
    }

    revalidatePath("/admin/blogs");
    return { success: true };
}

export async function updateBlogPost(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string || "general";
    const status = formData.get("status") as string || "draft";
    const drive_folder_id = formData.get("folderId") as string;

    // Generate slug from title if not provided
    let slug = formData.get("slug") as string;
    if (!slug) {
        slug = generateSlug(title);
    }

    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").filter(Boolean) : [];
    const cover_image = images.length > 0 ? images[0] : null;

    const client = await pool.connect();
    try {
        // Get current blog post to check for status change
        const currentPost = await client.query(
            `SELECT status, published_at FROM blog WHERE id = $1`,
            [id]
        );

        let published_at = currentPost.rows[0]?.published_at;

        // Set published_at if changing to published for the first time
        if (status === "published" && currentPost.rows[0]?.status !== "published") {
            published_at = new Date();
        }

        // Check if slug already exists (excluding current post)
        const existingSlug = await client.query(
            `SELECT id FROM blog WHERE slug = $1 AND id != $2`,
            [slug, id]
        );

        if (existingSlug.rows.length > 0) {
            slug = `${slug}-${Date.now()}`;
        }

        await client.query(
            `UPDATE blog SET
                title = $1, 
                slug = $2, 
                content = $3, 
                excerpt = $4, 
                cover_image = $5, 
                images = $6, 
                category = $7, 
                status = $8, 
                published_at = $9,
                drive_folder_id = COALESCE(NULLIF($10, ''), drive_folder_id),
                updated_at = now()
             WHERE id = $11`,
            [
                title, slug, content, excerpt, cover_image,
                images, category, status, published_at, drive_folder_id, id
            ]
        );
    } catch (error: any) {
        console.error("Error updating blog post:", error);
        return { error: error.message };
    } finally {
        client.release();
    }

    revalidatePath("/admin/blogs");
    revalidatePath(`/admin/blogs/${id}`);
    return { success: true };
}

export async function deleteBlogPost(id: string) {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM blog WHERE id = $1', [id]);
    } catch (error: any) {
        return { error: error.message };
    } finally {
        client.release();
    }
    revalidatePath("/admin/blogs");
    return { success: true };
}
