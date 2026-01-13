
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredTokens } from "@/lib/google-drive";
import { getStoredZohoTokens } from "@/lib/zoho-crm";
import { CheckCircle, AlertCircle, HardDrive, Users } from "lucide-react";
import Link from "next/link";
import { ZohoResetButton } from "@/components/admin/ZohoResetButton";

export default async function IntegrationsPage() {
    const tokens = await getStoredTokens();
    const isConnected = !!tokens;

    const zohoTokens = await getStoredZohoTokens();
    const isZohoConnected = !!zohoTokens;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-6 w-6" />
                            Google Drive
                        </CardTitle>
                        <CardDescription>
                            Connect your Google Drive to store property images.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            Status:
                            {isConnected ? (
                                <span className="text-chart-2 flex items-center gap-1 font-medium">
                                    <CheckCircle className="h-4 w-4" /> Connected
                                </span>
                            ) : (
                                <span className="text-chart-4 flex items-center gap-1 font-medium">
                                    <AlertCircle className="h-4 w-4" /> Not Connected
                                </span>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild>
                            <Link href="/api/auth/google">
                                {isConnected ? "Reconnect Drive" : "Connect Drive"}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            Zoho Creator
                        </CardTitle>
                        <CardDescription>
                            Connect Zoho Creator to sync data with your applications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            Status:
                            {isZohoConnected ? (
                                <span className="text-chart-2 flex items-center gap-1 font-medium">
                                    <CheckCircle className="h-4 w-4" /> Connected
                                </span>
                            ) : (
                                <span className="text-chart-4 flex items-center gap-1 font-medium">
                                    <AlertCircle className="h-4 w-4" /> Not Connected
                                </span>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <div className="flex gap-2 w-full">
                            <Button asChild className="flex-1">
                                <Link href="/api/auth/zoho">
                                    {isZohoConnected ? "Reconnect" : "Connect Zoho"}
                                </Link>
                            </Button>
                            {isZohoConnected && (
                                <Button variant="outline" asChild>
                                    <Link href="/admin/integrations/zoho">
                                        Configure
                                    </Link>
                                </Button>
                            )}
                        </div>
                        {isZohoConnected && (
                            <div className="w-full">
                                <ZohoResetButton />
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
