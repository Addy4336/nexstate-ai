import { exchangeCodeForTokens, saveZohoTokens } from "@/lib/zoho-crm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const location = searchParams.get("location");
    const accountsServer = searchParams.get("accounts-server");

    console.log("📥 Zoho callback received:");
    console.log("  - Has code:", !!code);
    console.log("  - Location:", location);
    console.log("  - Accounts server:", accountsServer);

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
        console.log("🔄 Exchanging authorization code for tokens...");
        
        // IMPORTANT: Use the accounts server that Zoho returned in the callback
        // Zoho may return location=us even for India-based apps
        const tokens = await exchangeCodeForTokens(code, accountsServer || undefined);
        
        console.log("💾 Saving Zoho tokens to database...");
        await saveZohoTokens(tokens);

        console.log("✅ Zoho CRM connected successfully");
        return NextResponse.redirect(new URL("/admin/integrations?success=zoho", request.url));
    } catch (error: any) {
        console.error("❌ Error exchanging Zoho code for tokens:", error);
        console.error("   Full error details:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.redirect(
            new URL(`/admin/integrations?error=${encodeURIComponent(error.message)}`, request.url)
        );
    }
}
