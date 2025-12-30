import { requireAuth } from "@/lib/auth-utils";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
    // Verify authentication
    const session = await requireAuth();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <SettingsForm user={session.user} />
        </div>
    );
}
