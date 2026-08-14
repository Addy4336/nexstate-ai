import { exchangeCodeForTokens, saveZohoTokens } from "@/lib/zoho-crm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db";

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
        // Get the logged-in admin user
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user?.id) {
            console.error("❌ No session found - user must be logged in");
            return NextResponse.redirect(
                new URL("/admin/integrations?error=Unauthorized%20-%20Please%20log%20in", request.url)
            );
        }

        const adminId = session.user.id;
        console.log("👤 Admin connecting Zoho:", adminId);

        // Verify user is admin
        const { data: user, error: userError } = await supabaseAdmin
            .from("user")
            .select("role")
            .eq("id", adminId)
            .single();

        if (userError || user?.role !== "admin") {
            console.error("❌ Access denied - admin role required");
            return NextResponse.redirect(
                new URL("/admin/integrations?error=Access%20denied%20-%20Admin%20role%20required", request.url)
            );
        }

        console.log("🔄 Exchanging authorization code for tokens...");
        
        // IMPORTANT: Use the accounts server that Zoho returned in the callback
        // Zoho may return location=us even for India-based apps
        const tokens = await exchangeCodeForTokens(code, accountsServer || undefined);
        
        console.log("💾 Saving Zoho tokens to database for admin:", adminId);
        await saveZohoTokens(tokens, adminId);

        console.log("✅ Zoho Creator connected successfully for admin:", adminId);
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
