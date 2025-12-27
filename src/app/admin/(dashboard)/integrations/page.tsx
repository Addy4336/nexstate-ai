
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredTokens } from "@/lib/google-drive";
import { CheckCircle, AlertCircle, HardDrive } from "lucide-react";
import Link from "next/link";

export default async function IntegrationsPage() {
    const tokens = await getStoredTokens();
    const isConnected = !!tokens;

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
                                <span className="text-green-600 flex items-center gap-1 font-medium">
                                    <CheckCircle className="h-4 w-4" /> Connected
                                </span>
                            ) : (
                                <span className="text-yellow-600 flex items-center gap-1 font-medium">
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
            </div>
        </div>
    );
}
