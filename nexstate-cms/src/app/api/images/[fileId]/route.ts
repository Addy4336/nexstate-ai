import { NextRequest, NextResponse } from "next/server";
import { getDriveClient } from "@/lib/google-drive";
import { isAllowedMediaType, SAFE_FILE_ID } from "@/lib/media-guard";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const fileId = (await params).fileId;

    if (!fileId || !SAFE_FILE_ID.test(fileId)) {
        return new NextResponse("File ID missing", { status: 400 });
    }

    try {
        const drive = await getDriveClient();

        // Get file metadata to set correct content type
        const metadata = await drive.files.get({
            fileId: fileId,
            fields: "mimeType, name, size",
        });

        const mimeType = metadata.data.mimeType;
        if (!isAllowedMediaType(mimeType)) {
            return new NextResponse("Unsupported media type", { status: 415 });
        }

        // Get the file content as a stream
        const response = await drive.files.get(
            {
                fileId: fileId,
                alt: "media",
            },
            { responseType: "stream" }
        );

        // Create a readable stream from the response
        const stream = response.data as any;

        return new NextResponse(stream, {
            headers: {
                "Content-Type": mimeType,
                "X-Content-Type-Options": "nosniff",
                "Content-Security-Policy": "default-src 'none'; sandbox",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error: any) {
        console.error("Error serving image:", error);
        return new NextResponse("Error fetching image", { status: 500 });
    }
}
