import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { requireAdmin } from "@/lib/auth-utils";

/**
 * Admin Dashboard Layout
 * Requires authentication and admin role to access
 */
export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Verify admin access - redirects if not authenticated or not admin
    await requireAdmin();

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />
            <div className="lg:pl-[260px] min-h-screen flex flex-col">
                <AdminTopNav />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
