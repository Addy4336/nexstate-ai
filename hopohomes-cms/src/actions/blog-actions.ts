"use server";

import { supabaseAdmin } from "@/lib/db";
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
    const published_at = status === "published" ? new Date().toISOString() : null;

    try {
        // Check if slug already exists
        const { data: existingSlug } = await supabaseAdmin
            .from("blog")
            .select("id")
            .eq("slug", slug)
            .single();

        if (existingSlug) {
            // Append timestamp to make slug unique
            slug = `${slug}-${Date.now()}`;
        }

        const { error } = await supabaseAdmin
            .from("blog")
            .insert({
                title,
                slug,
                content,
                excerpt,
                cover_image,
                images,
                category,
                status,
                published_at,
                drive_folder_id,
            });

        if (error) {
            console.error("Error creating blog post:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        console.error("Error creating blog post:", error);
        return { error: error.message };
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

    try {
        // Get current blog post to check for status change
        const { data: currentPost } = await supabaseAdmin
            .from("blog")
            .select("status, published_at")
            .eq("id", id)
            .single();

        let published_at = currentPost?.published_at;

        // Set published_at if changing to published for the first time
        if (status === "published" && currentPost?.status !== "published") {
            published_at = new Date().toISOString();
        }

        // Check if slug already exists (excluding current post)
        const { data: existingSlug } = await supabaseAdmin
            .from("blog")
            .select("id")
            .eq("slug", slug)
            .neq("id", id)
            .single();

        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }

        const updateData: any = {
            title,
            slug,
            content,
            excerpt,
            cover_image,
            images,
            category,
            status,
            published_at,
            updated_at: new Date().toISOString(),
        };

        // Only update drive_folder_id if provided
        if (drive_folder_id) {
            updateData.drive_folder_id = drive_folder_id;
        }

        const { error } = await supabaseAdmin
            .from("blog")
            .update(updateData)
            .eq("id", id);

        if (error) {
            console.error("Error updating blog post:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        console.error("Error updating blog post:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/blogs");
    revalidatePath(`/admin/blogs/${id}`);
    return { success: true };
}

export async function deleteBlogPost(id: string) {
    try {
        const { error } = await supabaseAdmin
            .from("blog")
            .delete()
            .eq("id", id);
        
        if (error) {
            console.error("Error deleting blog post:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        return { error: error.message };
    }
    revalidatePath("/admin/blogs");
    return { success: true };
}
