"use server";

import { getDriveClient } from "@/lib/google-drive";
import { Readable } from "stream";

// Helper to find or create a folder
export async function getOrCreateFolder(folderName: string, parentId: string = 'root') {
    try {
        const drive = await getDriveClient();

        // Search for existing folder
        const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentId}' in parents and trashed=false`;
        const search = await drive.files.list({
            q: query,
            fields: 'files(id, name)',
            spaces: 'drive',
        });

        if (search.data.files && search.data.files.length > 0) {
            return search.data.files[0].id;
        }

        // Create if not exists
        const fileMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId],
        };

        const file = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        return file.data.id;
    } catch (error: any) {
        console.error("Error getting/creating folder:", error);
        
        // Provide specific error messages
        if (error.message?.includes('invalid_grant')) {
            throw new Error('Google Drive connection expired. Please reconnect your Google Drive account in the Integrations page.');
        }
        if (error.code === 401) {
            throw new Error('Google Drive authentication failed. Please reconnect your account.');
        }
        if (error.code === 403) {
            throw new Error('Google Drive permission denied. Please check your Drive API permissions.');
        }
        
        throw error;
    }
}

export async function uploadImageToDriveAction(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const folderName = formData.get("folderName") as string || "Properties";

        if (!file) {
            throw new Error("No file uploaded");
        }

        // 1. Get or Create Root Folder "HOPO_Properties"
        const rootFolderId = await getOrCreateFolder("HOPO_Properties");

        // 2. Get or Create Property Specific Folder (if folderName is provided)
        let targetFolderId = rootFolderId;
        if (folderName && folderName !== "Properties") {
            if (rootFolderId) {
                targetFolderId = await getOrCreateFolder(folderName, rootFolderId) as string;
            }
        }

        if (!targetFolderId) throw new Error("Could not determine target folder");

        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

        const drive = await getDriveClient();

        const response = await drive.files.create({
            requestBody: {
                name: file.name,
                parents: [targetFolderId],
            },
            media: {
                mimeType: file.type,
                body: stream,
            },
            fields: 'id, webViewLink, webContentLink, thumbnailLink',
        });

        const fileId = response.data.id;

        if (!fileId) {
            throw new Error("Failed to upload file");
        }

        // Make the file public so it can be viewed
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // After making public, get the file again to get updated links
        const fileInfo = await drive.files.get({
            fileId: fileId,
            fields: 'id, webViewLink, webContentLink, thumbnailLink',
        });

        // Use drive.slaab.ai proxy with inline parameter for faster loading
        // Adding ?inline=true forces browser to display image instead of downloading
        const imageUrl = `https://drive.slaab.ai/api/drive/content/${fileId}?inline=true`;
        
        return {
            success: true,
            url: imageUrl, // drive.slaab.ai proxy URL with inline display
            fileId: fileId,
            parentId: targetFolderId,
            webViewLink: fileInfo.data.webViewLink,
            webContentLink: fileInfo.data.webContentLink,
            thumbnailLink: fileInfo.data.thumbnailLink,
        };

    } catch (error: any) {
        console.error("Error uploading to Drive:", error);
        return { success: false, error: error.message };
    }
}

export async function uploadVideoToDriveAction(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const folderName = formData.get("folderName") as string || "Properties";

        if (!file) {
            throw new Error("No file uploaded");
        }

        // Validate it's a video file
        if (!file.type.startsWith('video/')) {
            throw new Error("File must be a video");
        }

        // 1. Get or Create Root Folder "HOPO_Properties"
        const rootFolderId = await getOrCreateFolder("HOPO_Properties");

        // 2. Get or Create Property Specific Folder (if folderName is provided)
        let targetFolderId = rootFolderId;
        if (folderName && folderName !== "Properties") {
            if (rootFolderId) {
                targetFolderId = await getOrCreateFolder(folderName, rootFolderId) as string;
            }
        }

        if (!targetFolderId) throw new Error("Could not determine target folder");

        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

        const drive = await getDriveClient();

        const response = await drive.files.create({
            requestBody: {
                name: file.name,
                parents: [targetFolderId],
            },
            media: {
                mimeType: file.type,
                body: stream,
            },
            fields: 'id, webViewLink, webContentLink, parents',
        });

        const fileId = response.data.id;

        if (!fileId) {
            throw new Error("Failed to upload video");
        }

        // Make the video file public so it can be viewed
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
                allowFileDiscovery: false, // Public but not discoverable in search
            },
        });

        // For videos, use embed URL for iframe playback
        const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        const publicUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        return {
            success: true,
            url: embedUrl, // Use embed URL as primary for videos
            embedUrl: embedUrl,
            fileId: fileId,
            parentId: targetFolderId,
            webViewLink: response.data.webViewLink,
            downloadUrl: publicUrl // Direct download URL
        };

    } catch (error: any) {
        console.error("Error uploading video to Drive:", error);
        return { success: false, error: error.message };
    }
}
