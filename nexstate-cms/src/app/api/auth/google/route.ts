import { getOAuth2Client } from "@/lib/google-drive";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, newOAuthState, setOAuthStateCookie } from "@/lib/oauth-guard";

export async function GET(request: NextRequest) {
    if (!(await getAdminSession(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oauth2Client = getOAuth2Client();
    const state = newOAuthState();

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline", // Required to get refresh_token
        scope: [
            "https://www.googleapis.com/auth/drive.file", // Only access files created by the app
        ],
        prompt: "consent", // Force consent screen to ensure refresh_token is returned
        state,
    });

    const response = NextResponse.redirect(authUrl);
    setOAuthStateCookie("google", state, response);
    return response;
}
