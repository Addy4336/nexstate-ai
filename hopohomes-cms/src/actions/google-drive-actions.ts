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
    } catch (error) {
        console.error("Error getting/creating folder:", error);
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
            fields: 'id, webViewLink, webContentLink, parents',
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

        const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

        return {
            success: true,
            url: publicUrl,
            fileId: fileId,
            parentId: targetFolderId, // Return the folder ID
            webViewLink: response.data.webViewLink
        };

    } catch (error: any) {
        console.error("Error uploading to Drive:", error);
        return { success: false, error: error.message };
    }
}
