"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ZohoResetButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleReset = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/zoho/revoke", {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                router.refresh();
                alert("Zoho connection reset successfully. You can now reconnect.");
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error: any) {
            console.error("Error resetting Zoho connection:", error);
            alert(`Error resetting connection: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Resetting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Reset Connection
                        </>
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reset Zoho Connection?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will clear all stored Zoho tokens from the database. After resetting:
                        <br />
                        <br />
                        1. Go to{" "}
                        <a
                            href="https://accounts.zoho.in/home#security/connectedapps"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Zoho Connected Apps
                        </a>
                        <br />
                        2. Revoke access for this application
                        <br />
                        3. Come back and click "Connect Zoho" again
                        <br />
                        <br />
                        This ensures you get a fresh refresh token from Zoho.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>
                        Reset Connection
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
