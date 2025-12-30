import { supabaseAdmin } from "@/lib/db";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal } from "lucide-react";
import { requireAdmin } from "@/lib/auth-utils";

async function getUsers() {
    const { data, error } = await supabaseAdmin
        .from("user")
        .select("id, name, email, role, created_at, email_verified")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return data || [];
}

export default async function UsersPage() {
    // Verify admin access
    await requireAdmin();
    
    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage admin access and user roles.
                    </p>
                </div>
                <Link href="/admin/users/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.email_verified ? (
                                            <span className="text-green-600 font-medium text-xs">Verified</span>
                                        ) : (
                                            <span className="text-amber-600 font-medium text-xs">Pending</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <strong>Tip:</strong> To create a new user, you can currently use the
                <code className="bg-amber-100 px-1 py-0.5 rounded mx-1">/admin/setup</code> page
                in an Incognito/Private window (to avoid logging out).
                Full user creation inside the dashboard is coming soon.
            </div>
        </div>
    );
}
