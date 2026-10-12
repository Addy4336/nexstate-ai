import { getZohoAuthUrl } from "@/lib/zoho-crm";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, newOAuthState, setOAuthStateCookie } from "@/lib/oauth-guard";

export async function GET(request: NextRequest) {
    if (!(await getAdminSession(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const state = newOAuthState();
        const url = new URL(getZohoAuthUrl());
        url.searchParams.set("state", state);
        const response = NextResponse.redirect(url);
        setOAuthStateCookie("zoho", state, response);
        return response;
    } catch (error: any) {
        console.error("Error generating Zoho auth URL:", error);
        return NextResponse.json({ error: "Failed to start Zoho authorization" }, { status: 500 });
    }
}
