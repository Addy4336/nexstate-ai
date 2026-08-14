import { getZohoAuthUrl } from "@/lib/zoho-crm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const authUrl = getZohoAuthUrl();
        return NextResponse.redirect(authUrl);
    } catch (error: any) {
        console.error("Error generating Zoho auth URL:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
