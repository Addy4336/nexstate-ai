"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

export default function SetupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signUp.email({
                email,
                password,
                name,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Admin account created!", {
                            description: "You can now log in.",
                        });
                        router.push("/admin/login");
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Failed to create account");
                    }
                }
            });
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Initial Admin Setup</h1>
                    <p className="text-muted-foreground mt-2">
                        Create the first admin account. Delete this route after use.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Admin User"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Create Admin Account
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        Don't forget to update your role to 'admin' in Supabase after this!
                    </p>
                </form>
            </div>
        </div>
    );
}
