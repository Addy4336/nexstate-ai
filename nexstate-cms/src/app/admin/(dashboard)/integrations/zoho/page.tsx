import { getStoredZohoTokens } from "@/lib/zoho-crm";
import { getZohoConfig } from "@/actions/zoho-actions";
import { ZohoSetupForm } from "@/components/admin/zoho-setup-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ZohoSetupPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const adminId = session.user.id;

    const tokens = await getStoredZohoTokens(adminId);
    const isConnected = !!tokens;

    let config = null;
    if (isConnected) {
        const result = await getZohoConfig();
        if (result.success) {
            config = result.data;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/integrations">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Zoho Creator Setup</h1>
                    <p className="text-muted-foreground">
                        Configure your Zoho Creator integration
                        {isConnected && session.user.email && (
                            <span className="block text-sm mt-1">
                                Connected as: <span className="font-medium">{session.user.email}</span>
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <ZohoSetupForm initialConfig={config} isConnected={isConnected} />
        </div>
    );
}
