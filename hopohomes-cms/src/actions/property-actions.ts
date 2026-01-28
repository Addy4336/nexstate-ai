"use server";

import { supabaseAdmin } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getZohoConfig } from "./zoho-actions";
import { getZohoCreatorService } from "@/lib/zoho-crm";

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
    const drive_folder_id = formData.get("folderId") as string;

    // Images are passed as comma-separated string from client component
    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").filter(Boolean) : [];

    // Amenities are passed as comma-separated string
    const amenitiesString = formData.get("amenities") as string;
    const amenities = amenitiesString ? amenitiesString.split(",").filter(Boolean) : [];

    // Extract cover image (first image in the list)
    // IMPORTANT: The schema says cover_image is text[] (ARRAY), so we wrap it in an array
    const cover_image = images.length > 0 ? [images[0]] : [];

    try {
        const { error } = await supabaseAdmin
            .from("property")
            .insert({
                title,
                description,
                price,
                location,
                bedrooms,
                bathrooms,
                area_sqft,
                status,
                images,
                featured,
                cover_image,
                drive_folder_id,
                amenities,
                // Initialize rental tracking columns with defaults
                rental_periods: [],
                buffer_days: 2,
                current_rental_start: null,
                current_rental_end: null,
            });

        if (error) {
            console.error("Error creating property:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        console.error("Error creating property:", error);
        return { error: error.message };
    }

    // Sync to Zoho Creator if enabled
    try {
        const configResult = await getZohoConfig();
        if (configResult.success && configResult.data && configResult.data.auto_sync) {
            const config = configResult.data;
            const zoho = await getZohoCreatorService();
            
            if (zoho) {
                const zohoData: Record<string, any> = {};
                const mapping = config.field_mapping || {};
                
                const propertyData = {
                    title, description, price, location, 
                    bedrooms, bathrooms, area_sqft, status, 
                    featured, amenities: amenities.join(", ")
                };
                
                for (const [localField, zohoField] of Object.entries(mapping)) {
                    if (zohoField && propertyData[localField as keyof typeof propertyData] !== undefined) {
                        zohoData[zohoField as string] = propertyData[localField as keyof typeof propertyData];
                    }
                }
                
                if (Object.keys(zohoData).length > 0) {
                    await zoho.addRecord(config.owner_name, config.app_name, config.form_name, zohoData);
                }
            }
        }
    } catch (error) {
        console.error("Failed to sync with Zoho:", error);
        // Don't fail the request if sync fails
    }

    revalidatePath("/admin/properties");
    revalidatePath("/"); // Revalidate homepage to show updated properties
    return { success: true };
}

export async function updateProperty(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const location = formData.get("location") as string;
    const bedrooms = parseInt(formData.get("bedrooms") as string) || 0;
    const bathrooms = parseInt(formData.get("bathrooms") as string) || 0;
    const area_sqft = parseInt(formData.get("area_sqft") as string) || 0;
    const status = formData.get("status") as string || "available";
    const featured = formData.get("featured") === "on";
    const drive_folder_id = formData.get("folderId") as string;

    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").filter(Boolean) : [];
    const cover_image = images.length > 0 ? [images[0]] : [];

    const amenitiesString = formData.get("amenities") as string;
    const amenities = amenitiesString ? amenitiesString.split(",").filter(Boolean) : [];

    try {
        const updateData: any = {
            title,
            description,
            price,
            location,
            bedrooms,
            bathrooms,
            area_sqft,
            status,
            images,
            featured,
            cover_image,
            amenities,
            updated_at: new Date().toISOString(),
        };

        // Only update drive_folder_id if provided
        if (drive_folder_id) {
            updateData.drive_folder_id = drive_folder_id;
        }

        const { error } = await supabaseAdmin
            .from("property")
            .update(updateData)
            .eq("id", id);

        if (error) {
            console.error("Error updating property:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        console.error("Error updating property:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${id}`);
    revalidatePath("/"); // Revalidate homepage
    return { success: true };
}

export async function deleteProperty(id: string) {
    try {
        const { error } = await supabaseAdmin
            .from("property")
            .delete()
            .eq("id", id);
        
        if (error) {
            console.error("Error deleting property:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        return { error: error.message };
    }
    revalidatePath("/admin/properties");
    revalidatePath("/"); // Revalidate homepage
    return { success: true };
}

export async function archiveProperty(id: string) {
    try {
        const { error } = await supabaseAdmin
            .from("property")
            .update({
                status: "archived",
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);
        
        if (error) {
            console.error("Error archiving property:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        return { error: error.message };
    }
    revalidatePath("/admin/properties");
    revalidatePath("/");
    return { success: true };
}
