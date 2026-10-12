import { NextRequest, NextResponse } from 'next/server';
import { getDriveClient } from '@/lib/google-drive';
import { isAllowedMediaType, SAFE_FILE_ID } from '@/lib/media-guard';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        const { fileId } = await params;

        console.log('Drive image proxy request:', { fileId });

        if (!fileId || !SAFE_FILE_ID.test(fileId)) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        const drive = await getDriveClient();

        // Get file metadata to check if it exists and get mime type
        const file = await drive.files.get({
            fileId: fileId,
            fields: 'id, name, mimeType, size',
        });


        if (!file.data) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        if (!isAllowedMediaType(file.data.mimeType)) {
            return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
        }

        // Download file content
        const response = await drive.files.get(
            {
                fileId: fileId,
                alt: 'media',
            },
            { responseType: 'arraybuffer' }
        );

        // response.data is already a buffer when using arraybuffer
        const buffer = Buffer.from(response.data as ArrayBuffer);

        // Return image with proper headers
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': file.data.mimeType,
                'X-Content-Type-Options': 'nosniff',
                'Content-Security-Policy': "default-src 'none'; sandbox",
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Length': buffer.length.toString(),
            },
        });

    } catch (error: any) {
        console.error('Error fetching file from Drive:', {
            fileId: await params.then(p => p.fileId),
            error: error.message,
            code: error.code,
            details: error
        });
        return NextResponse.json(
            { 
                error: 'Failed to fetch file from Google Drive'
            },
            { status: 500 }
        );
    }
}
