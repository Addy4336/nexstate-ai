
import { getOAuth2Client } from "@/lib/google-drive";
import { NextResponse } from "next/server";

export async function GET() {
    const oauth2Client = getOAuth2Client();

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Required to get refresh_token
        scope: [
            'https://www.googleapis.com/auth/drive.file', // Only access files created by the app
            // 'https://www.googleapis.com/auth/drive', // specific scope if needed
        ],
        prompt: 'consent', // Force consent screen to ensure refresh_token is returned
    });

    return NextResponse.redirect(authUrl);
}
