import { requireStaff } from "@/lib/auth-utils";
import { getDashboardStats, getRecentProperties } from "@/lib/dashboard";
import { DashboardStatsDisplay } from "@/components/admin/DashboardStatsDisplay";
import { RecentPropertiesList } from "@/components/admin/RecentPropertiesList";
import { QuickActions } from "@/components/admin/QuickActions";

export default async function DashboardPage() {
    // 1. Verify access
    await requireStaff();

    // 2. Fetch Data (Parallel for performance)
    const [stats, recentProperties] = await Promise.all([
        getDashboardStats(),
        getRecentProperties(5)
    ]);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <DashboardStatsDisplay stats={stats} />

            {/* Quick Actions & Recent Properties */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Actions */}
                <QuickActions />

                {/* Recent Properties */}
                <RecentPropertiesList properties={recentProperties} />
            </div>
        </div>
    );
}
