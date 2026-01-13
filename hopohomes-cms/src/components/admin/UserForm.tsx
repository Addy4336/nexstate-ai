"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteUser } from "@/actions/user-actions";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const roles = [
    {
        value: "admin",
        label: "Admin",
        description: "Full access to all features and settings",
        color: "bg-destructive/10 text-destructive border-destructive/20"
    },
    {
        value: "manager",
        label: "Manager",
        description: "Manage properties, blogs, and view reports",
        color: "bg-chart-1/10 text-chart-1 border-chart-1/20"
    },
    {
        value: "editor",
        label: "Editor",
        description: "Create and edit content only",
        color: "bg-chart-2/10 text-chart-2 border-chart-2/20"
    },
];

export function UserForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRole, setSelectedRole] = useState("editor");
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);

        try {
            const result = await inviteUser(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(result?.message || "User invited successfully! 🎉");
                router.push("/admin/users");
            }
        } catch (e: any) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedRoleInfo = roles.find(r => r.value === selectedRole);

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. John Doe"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. john@example.com"
                        required
                    />
                    <p className="text-sm text-muted-foreground">
                        An invitation email with login credentials will be sent to this address.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                        name="role"
                        defaultValue="editor"
                        onValueChange={setSelectedRole}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    <div className="flex items-center gap-2">
                                        <span>{role.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedRoleInfo && (
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={selectedRoleInfo.color}>
                                {selectedRoleInfo.label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {selectedRoleInfo.description}
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Email Invitation</p>
                            <p className="text-sm text-muted-foreground">
                                A secure password will be automatically generated and sent to the user&apos;s email
                                along with login instructions. They can change their password after signing in.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Mail className="w-4 h-4 mr-2" />
                    )}
                    Send Invitation
                </Button>
            </div>
        </form>
    );
}

