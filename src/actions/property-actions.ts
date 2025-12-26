"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProperty(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const location = formData.get("location") as string;
    const bedrooms = parseInt(formData.get("bedrooms") as string) || 0;
    const bathrooms = parseInt(formData.get("bathrooms") as string) || 0;
    const area_sqft = parseInt(formData.get("area_sqft") as string) || 0;
    const status = formData.get("status") as string || "available";
    const featured = formData.get("featured") === "on";

    // Images are passed as comma-separated string from client component
    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").filter(Boolean) : [];

    const client = await pool.connect();
    try {
        await client.query(
            `INSERT INTO property (
        title, description, price, location, 
        bedrooms, bathrooms, area_sqft, status, 
        images, featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                title, description, price, location,
                bedrooms, bathrooms, area_sqft, status,
                images, featured
            ]
        );
    } catch (error: any) {
        console.error("Error creating property:", error);
        return { error: error.message };
    } finally {
        client.release();
    }

    revalidatePath("/admin/properties");
    redirect("/admin/properties");
}

export async function deleteProperty(id: string) {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM property WHERE id = $1', [id]);
    } catch (error: any) {
        return { error: error.message };
    } finally {
        client.release();
    }
    revalidatePath("/admin/properties");
}
