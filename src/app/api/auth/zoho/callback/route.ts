import { exchangeCodeForTokens, saveZohoTokens } from "@/lib/zoho-crm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        console.error("Zoho OAuth error:", error);
        return NextResponse.redirect(
            new URL(`/admin/integrations?error=${encodeURIComponent(error)}`, request.url)
        );
    }

    if (!code) {
        return NextResponse.redirect(
            new URL("/admin/integrations?error=Missing%20authorization%20code", request.url)
        );
    }

    try {
        const tokens = await exchangeCodeForTokens(code);
        await saveZohoTokens(tokens);

        console.log("✅ Zoho CRM connected successfully");
        return NextResponse.redirect(new URL("/admin/integrations?success=zoho", request.url));
    } catch (error: any) {
        console.error("Error exchanging Zoho code for tokens:", error);
        return NextResponse.redirect(
            new URL(`/admin/integrations?error=${encodeURIComponent(error.message)}`, request.url)
        );
    }
}
