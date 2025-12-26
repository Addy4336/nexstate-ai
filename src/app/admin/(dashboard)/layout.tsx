import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
