import { UserForm } from "@/components/admin/UserForm";
import { requireAdmin } from "@/lib/auth-utils";

export default async function NewUserPage() {
    // Verify admin access
    await requireAdmin();
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
                <p className="text-muted-foreground">
                    Create a new user account with role-based access.
                </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <UserForm />
            </div>
        </div>
    );
}
