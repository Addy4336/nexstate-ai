import { supabaseAdmin } from "./db";
import { uploadFileToDrive } from "./google-drive";

export interface UploadOptions {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    folderId?: string;
    bucketName?: string;
}

export interface UploadResult {
    url: string;
    provider: "supabase" | "google-drive" | "local";
    fileId?: string;
}

/**
 * Universal Storage Adapter:
 * Uses Supabase Storage (Free Tier) by default.
 * Falls back to Google Drive API if configured.
 */
export async function uploadMediaAsset(options: UploadOptions): Promise<UploadResult> {
    const { fileBuffer, fileName, mimeType, folderId, bucketName = "nexstate-media" } = options;

    // 1. Try Supabase Storage (Free Tier)
    try {
        const filePath = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { data, error } = await supabaseAdmin.storage
            .from(bucketName)
            .upload(filePath, fileBuffer, {
                contentType: mimeType,
                upsert: true,
            });

        if (!error && data) {
            const { data: publicUrlData } = supabaseAdmin.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            return {
                url: publicUrlData.publicUrl,
                provider: "supabase",
                fileId: data.path,
            };
        }
    } catch (err) {
        console.warn("[StorageAdapter] Supabase Storage upload skipped/failed:", err);
    }

    // 2. Try Google Drive API fallback if folder ID or Google credentials are provided
    if (folderId && process.env.GOOGLE_DRIVE_CLIENT_ID) {
        try {
            const driveFileId = await uploadFileToDrive(fileBuffer, fileName, mimeType, folderId);
            return {
                url: `https://drive.google.com/uc?id=${driveFileId}`,
                provider: "google-drive",
                fileId: driveFileId,
            };
        } catch (err) {
            console.error("[StorageAdapter] Google Drive upload failed:", err);
        }
    }

    // 3. Fallback placeholder URL for offline testing
    const encodedName = encodeURIComponent(fileName);
    return {
        url: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80&name=${encodedName}`,
        provider: "local",
    };
}
