"use client";

import Link from "next/link";
import Image from "next/image";
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
        label: "Leads",
        href: "/admin/leads",
        icon: Users,
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

interface AdminSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
    const pathname = usePathname();
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
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar border border-sidebar-border shadow-sm text-sidebar-foreground"
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
                    "fixed top-0 left-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden",
                    isCollapsed ? "w-[70px]" : "w-[260px]",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <div className={cn(
                                "relative h-8 flex-shrink-0 transition-all duration-300",
                                isCollapsed ? "w-9" : "w-24"
                            )}>
                                <Image
                                    src="/images/logo.webp"
                                    alt="HOPO Homes"
                                    fill
                                    className={cn(
                                        "object-left transition-all duration-300",
                                        isCollapsed ? "object-cover" : "object-contain"
                                    )}
                                />
                            </div>
                            {!isCollapsed && (
                                <div className="flex items-center gap-1.5 text-lg font-bold whitespace-nowrap">
                                    <span className="text-primary">Admin</span>
                                    <span className="text-foreground">Panel</span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className={cn(
                        "flex-1 space-y-2 overflow-y-auto overflow-x-hidden",
                        isCollapsed ? "p-2" : "p-4"
                    )}>
                        {visibleLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
                    <div className="p-4 border-t border-sidebar-border">
                        {/* User Info with Role Badge */}
                        {!isCollapsed && session?.user && (
                            <div className="mb-3 px-3 py-2">
                                <p className="text-sm font-medium text-sidebar-foreground truncate">
                                    {session.user.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className={cn("text-xs capitalize border-sidebar-border text-sidebar-foreground/70")}>
                                        {userRole}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* Back to Site */}
                        <Link
                            href="/"
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors mb-2",
                            )}
                        >
                            <Home className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span className="font-medium">Back to Site</span>}
                        </Link>

                        {/* Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors",
                            )}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span className="font-medium">Sign Out</span>}
                        </button>
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        className="hidden lg:flex items-center justify-center p-2 border-t border-sidebar-border text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                        onClick={onToggle}
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

