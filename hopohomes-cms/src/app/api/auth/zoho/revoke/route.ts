import { supabaseAdmin } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * DELETE endpoint to clear stored Zoho tokens for the current admin
 * This allows users to reset their connection and try again
 */
export async function DELETE(request: NextRequest) {
    try {
        // Get the logged-in admin user
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized - Please log in" },
                { status: 401 }
            );
        }

        const adminId = session.user.id;
        console.log("🗑️ Revoking Zoho tokens for admin:", adminId);

        // Delete this admin's tokens only
        const { error } = await supabaseAdmin
            .from("zoho_tokens")
            .delete()
            .eq("admin_id", adminId);

        if (error) throw error;

        // Also delete this admin's config
        await supabaseAdmin
            .from("zoho_config")
            .delete()
            .eq("admin_id", adminId);

        console.log("✅ Zoho tokens and config cleared for admin:", adminId);

        return NextResponse.json({
            success: true,
            message: "Your Zoho connection has been removed. You can now reconnect.",
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
