"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    Users, 
    UserCog, 
    ShoppingCart, 
    Package, 
    ShoppingBag, 
    FileText, 
    LogOut,
    Home,
    Newspaper
} from "lucide-react";
import { Role } from "@/types/auth";
import { RoleBadge } from "@/components/admin/RoleBadge";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

interface AdminSidebarProps {
    navItems: NavItem[];
    user: {
        id: string;
        email: string;
        name: string;
        role: Role;
    };
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Users,
    UserCog,
    ShoppingCart,
    Package,
    ShoppingBag,
    FileText,
    Newspaper
};

export function AdminSidebar({ navItems, user }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
        router.push("/admin/login");
    };

    return (
        <aside className="w-64 border-r border-border/40 bg-background/50 backdrop-blur-xl flex flex-col fixed h-full z-20">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-border/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="font-bold text-lg tracking-tight relative z-10 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    ZecurX Admin
                </span>
            </div>

            {/* User Info */}
            <div className="px-4 py-3 border-b border-border/40">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    <RoleBadge role={user.role} size="sm" className="mt-1 w-fit" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                    const isActive = pathname === item.href || 
                        (item.href !== "/admin" && pathname.startsWith(item.href));
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border",
                                isActive 
                                    ? "text-foreground bg-primary/10 border-primary/20" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5 border-transparent hover:border-primary/10"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/40 space-y-1">
                <Link 
                    href="/" 
                    className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Back to Site</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-red-500 transition-colors group"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
