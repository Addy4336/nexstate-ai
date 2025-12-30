import { UserForm } from "@/components/admin/UserForm";
import { requireAdmin } from "@/lib/auth-utils";

export default async function NewUserPage() {
    // Verify admin access
    await requireAdmin();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Invite Team Member</h1>
                <p className="text-muted-foreground">
                    Send an invitation with login credentials to a new team member.
                </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <UserForm />
            </div>
        </div>
    );
}
