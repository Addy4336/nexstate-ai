import { supabaseAdmin } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE endpoint to clear stored Zoho tokens
 * This allows users to reset the connection and try again
 */
export async function DELETE(request: NextRequest) {
    try {
        const { error } = await supabaseAdmin
            .from("zoho_tokens")
            .delete()
            .eq("id", 1);

        if (error) throw error;

        console.log("✅ Zoho tokens cleared from database");

        return NextResponse.json({
            success: true,
            message: "Zoho tokens cleared. You can now reconnect.",
        });
    } catch (error: any) {
        console.error("❌ Error clearing Zoho tokens:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
