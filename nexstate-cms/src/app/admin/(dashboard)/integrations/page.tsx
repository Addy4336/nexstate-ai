
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredTokens } from "@/lib/google-drive";
import { getStoredZohoTokens } from "@/lib/zoho-crm";
import { CheckCircle2, AlertCircle, HardDrive, Database, Settings2, RefreshCw, Plus } from "lucide-react";
import Link from "next/link";
import { ZohoResetButton } from "@/components/admin/ZohoResetButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function IntegrationsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const adminId = session.user.id;

    const tokens = await getStoredTokens();
    const isConnected = !!tokens;

    const zohoTokens = await getStoredZohoTokens(adminId);
    const isZohoConnected = !!zohoTokens;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
                <p className="text-sm text-muted-foreground">
                    Connect third-party tools to enhance your workflow.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Google Drive Integration */}
                <Card className="flex flex-col h-full border shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="flex gap-4">
                            <div className="p-2 w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <HardDrive className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">Google Drive</CardTitle>
                                <CardDescription className="text-xs">Storage & Assets</CardDescription>
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className={cn(
                                "gap-1.5 py-1",
                                isConnected
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {isConnected ? (
                                <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Active</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Inactive</span>
                                </>
                            )}
                        </Badge>
                    </CardHeader>
                    <CardContent className="flex-1 py-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Connect your Google Drive to automatically store and manage property images,
                            documents, and backups securely in the cloud.
                        </p>
                    </CardContent>
                    <CardFooter className="pt-4 border-t bg-muted/20">
                        <Button asChild variant={isConnected ? "outline" : "default"} className="w-full">
                            <Link href="/api/auth/google">
                                {isConnected ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" /> Reconnect Drive
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" /> Connect Drive
                                    </>
                                )}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Zoho Creator Integration */}
                <Card className="flex flex-col h-full border shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="flex gap-4">
                            <div className="p-2 w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                                <Database className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">Zoho Creator</CardTitle>
                                <CardDescription className="text-xs">CRM & Automation</CardDescription>
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className={cn(
                                "gap-1.5 py-1",
                                isZohoConnected
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {isZohoConnected ? (
                                <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Active</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Inactive</span>
                                </>
                            )}
                        </Badge>
                    </CardHeader>
                    <CardContent className="flex-1 py-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Sync data with Zoho Creator applications to streamline your business logic,
                            manage leads, and automate workflows externally.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-3 pt-4 border-t bg-muted/20">
                        <Button asChild variant={isZohoConnected ? "outline" : "default"} className="flex-1 min-w-[120px]">
                            <Link href="/api/auth/zoho">
                                {isZohoConnected ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" /> Reconnect
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" /> Connect Zoho
                                    </>
                                )}
                            </Link>
                        </Button>
                        {isZohoConnected && (
                            <>
                                <Button variant="secondary" asChild className="flex-1 min-w-[120px]">
                                    <Link href="/admin/integrations/zoho">
                                        <Settings2 className="mr-2 h-4 w-4" /> Configure
                                    </Link>
                                </Button>
                                <div className="flex-1 min-w-[100px]">
                                    <ZohoResetButton
                                        variant="ghost"
                                        className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    />
                                </div>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
