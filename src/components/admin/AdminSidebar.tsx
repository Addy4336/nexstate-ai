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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

const sidebarLinks = [
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
        label: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/admin/login";
    };

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
                        {sidebarLinks.map((link) => {
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
