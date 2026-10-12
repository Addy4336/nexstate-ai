
import { getOAuth2Client, saveTokens } from "@/lib/google-drive";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, verifyOAuthState } from "@/lib/oauth-guard";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (!(await getAdminSession(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!verifyOAuthState("google", request)) {
        return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
    }

    if (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    try {
        const oauth2Client = getOAuth2Client();
        const { tokens } = await oauth2Client.getToken(code);

        await saveTokens(tokens);

        // Redirect back to admin dashboard integration page
        return NextResponse.redirect(new URL("/admin/integrations", request.url));
    } catch (error: any) {
        console.error("Error exchanging code for tokens:", error);
        return NextResponse.json({ error: "Failed to complete Google authorization" }, { status: 500 });
    }
}
