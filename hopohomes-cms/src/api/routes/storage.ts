import { Elysia, t } from "elysia";
import { supabaseAdmin } from "@/lib/db";

const BUCKET_NAME = "property-images";

export const storageRoutes = new Elysia({ prefix: "/storage" })
    // Initialize storage bucket
    .post("/init", async () => {
        try {
            // Check if bucket exists
            const { data: buckets, error: listError } = await supabaseAdmin
                .storage
                .listBuckets();
            
            if (listError) {
                return { success: false, error: listError.message };
            }
            
            const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
            
            if (!bucketExists) {
                const { error: createError } = await supabaseAdmin
                    .storage
                    .createBucket(BUCKET_NAME, {
                        public: true,
                        fileSizeLimit: 10485760, // 10MB
                        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
                    });
                
                if (createError) {
                    return { success: false, error: createError.message };
                }
            }
            
            return { success: true, message: "Storage bucket ready" };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }, {
        detail: {
            tags: ["Storage"],
            summary: "Initialize storage bucket",
            description: "Creates the property-images bucket if it doesn't exist",
        },
    })
    
    // Upload single image
    .post("/upload", async ({ body }) => {
        try {
            const { file, folderName = "general" } = body;
            
            if (!file) {
                return { success: false, error: "No file provided" };
            }
            
            // Decode base64 file
            const base64Data = file.data.split(',')[1] || file.data;
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Sanitize folder name
            const cleanFolderName = folderName
                .toLowerCase()
                .replace(/[^a-z0-9-_]/g, '-')
                .replace(/-+/g, '-')
                .trim() || "general";
            
            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 8);
            const extension = file.name?.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${timestamp}-${randomString}.${extension}`;
            const filePath = `${cleanFolderName}/${fileName}`;
            
            // Upload to Supabase Storage
            const { data, error } = await supabaseAdmin
                .storage
                .from(BUCKET_NAME)
                .upload(filePath, buffer, {
                    contentType: file.type || 'image/jpeg',
                    cacheControl: '31536000',
                    upsert: false
                });
            
            if (error) {
                return { success: false, error: error.message };
            }
            
            // Get public URL
            const { data: urlData } = supabaseAdmin
                .storage
                .from(BUCKET_NAME)
                .getPublicUrl(filePath);
            
            return {
                success: true,
                data: {
                    url: urlData.publicUrl,
                    path: filePath,
                    fileName: fileName
                }
            };
            
        } catch (error: any) {
            console.error("Upload error:", error);
            return { success: false, error: error.message };
        }
    }, {
        body: t.Object({
            file: t.Object({
                data: t.String(),
                name: t.Optional(t.String()),
                type: t.Optional(t.String()),
            }),
            folderName: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Storage"],
            summary: "Upload image",
            description: "Upload a single image to Supabase Storage (base64 encoded)",
        },
    })
    
    // Delete image
    .delete("/delete", async ({ body }) => {
        try {
            const { path } = body;
            
            if (!path) {
                return { success: false, error: "No path provided" };
            }
            
            const { error } = await supabaseAdmin
                .storage
                .from(BUCKET_NAME)
                .remove([path]);
            
            if (error) {
                return { success: false, error: error.message };
            }
            
            return { success: true, message: "Image deleted" };
            
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }, {
        body: t.Object({
            path: t.String(),
        }),
        detail: {
            tags: ["Storage"],
            summary: "Delete image",
            description: "Delete an image from Supabase Storage",
        },
    })
    
    // Get signed URL (for private access if needed)
    .post("/signed-url", async ({ body }) => {
        try {
            const { path, expiresIn = 3600 } = body;
            
            const { data, error } = await supabaseAdmin
                .storage
                .from(BUCKET_NAME)
                .createSignedUrl(path, expiresIn);
            
            if (error) {
                return { success: false, error: error.message };
            }
            
            return { success: true, data: { url: data.signedUrl } };
            
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }, {
        body: t.Object({
            path: t.String(),
            expiresIn: t.Optional(t.Number()),
        }),
        detail: {
            tags: ["Storage"],
            summary: "Get signed URL",
            description: "Generate a signed URL for private image access",
        },
    })
    
    // List images in a folder
    .get("/list/:folder", async ({ params, query }) => {
        try {
            const limit = query.limit ? parseInt(query.limit) : 100;
            const offset = query.offset ? parseInt(query.offset) : 0;
            
            const { data, error } = await supabaseAdmin
                .storage
                .from(BUCKET_NAME)
                .list(params.folder, {
                    limit,
                    offset,
                    sortBy: { column: 'created_at', order: 'desc' }
                });
            
            if (error) {
                return { success: false, error: error.message, data: [] };
            }
            
            // Add public URLs to each file
            const filesWithUrls = data?.map(file => {
                const { data: urlData } = supabaseAdmin
                    .storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(`${params.folder}/${file.name}`);
                
                return {
                    ...file,
                    url: urlData.publicUrl
                };
            }) || [];
            
            return { success: true, data: filesWithUrls };
            
        } catch (error: any) {
            return { success: false, error: error.message, data: [] };
        }
    }, {
        params: t.Object({
            folder: t.String(),
        }),
        query: t.Object({
            limit: t.Optional(t.String()),
            offset: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Storage"],
            summary: "List images in folder",
            description: "Get all images in a specific folder",
        },
    });
