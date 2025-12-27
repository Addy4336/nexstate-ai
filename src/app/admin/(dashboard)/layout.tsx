import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { requireStaff } from "@/lib/auth-utils";

/**
 * Admin Dashboard Layout
 * Requires authentication and staff role (admin, manager, or editor) to access
 */
export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Verify staff access - redirects if not authenticated or not a staff member
    await requireStaff();

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

