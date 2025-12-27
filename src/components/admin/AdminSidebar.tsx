"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    ChevronRight,
    Plug,
    Megaphone,
    Calculator,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";

type UserRole = "admin" | "manager" | "editor";

interface SidebarLink {
    label: string;
    href: string;
    icon: React.ElementType;
    roles?: UserRole[]; // If not specified, visible to all staff roles
}

const sidebarLinks: SidebarLink[] = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Properties",
        href: "/admin/properties",
        icon: Building2,
    },
    {
        label: "Marketing",
        href: "/admin/marketing",
        icon: Megaphone,
    },
    {
        label: "Tools",
        href: "/admin/tools",
        icon: Calculator,
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: Users,
        roles: ["admin"], // Only visible to admins
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        // Visible to all staff
    },
    {
        label: "Integrations",
        href: "/admin/integrations",
        icon: Plug,
        roles: ["admin"], // Only visible to admins
    },
];

const roleColors: Record<UserRole, string> = {
    admin: "bg-red-500/10 text-red-600 border-red-500/20",
    manager: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    editor: "bg-green-500/10 text-green-600 border-green-500/20",
};

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { data: session } = useSession();

    const userRole = (session?.user?.role as UserRole) || "editor";

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/admin/login";
    };

    // Filter links based on user role
    const visibleLinks = sidebarLinks.filter((link) => {
        if (!link.roles) return true; // Visible to all if no roles specified
        return link.roles.includes(userRole);
    });

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-sm"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
                    isCollapsed ? "w-[70px]" : "w-[260px]",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                                <span className="text-accent-foreground font-bold text-xl">H</span>
                            </div>
                            {!isCollapsed && (
                                <span className="text-lg font-bold text-foreground">
                                    HOPO<span className="text-accent">Admin</span>
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {visibleLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <link.icon className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && <span className="font-medium">{link.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-border">
                        {/* User Info with Role Badge */}
                        {!isCollapsed && session?.user && (
                            <div className="mb-3 px-3 py-2">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {session.user.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className={cn("text-xs capitalize", roleColors[userRole])}>
                                        {userRole}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* Back to Site */}
                        <Link
                            href="/"
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mb-2",
                            )}
                        >
                            <Home className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span className="font-medium">Back to Site</span>}
                        </Link>

                        {/* Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
                            )}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span className="font-medium">Sign Out</span>}
                        </button>
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        className="hidden lg:flex items-center justify-center p-2 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <ChevronRight
                            className={cn(
                                "w-5 h-5 transition-transform",
                                isCollapsed ? "" : "rotate-180"
                            )}
                        />
                    </button>
                </div>
            </aside>
        </>
    );
}

