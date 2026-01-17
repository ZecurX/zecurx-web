"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
    Newspaper,
    ChevronRight,
    ChevronDown,
    Menu,
    X,
    Ticket,
    FlaskConical,
    GraduationCap,
    Building2,
    ScrollText,
    Handshake
} from "lucide-react";
import { Role } from "@/types/auth";
import { RoleBadge } from "@/components/admin/RoleBadge";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    icon: string;
    children?: NavItem[];
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
    Newspaper,
    Ticket,
    FlaskConical,
    GraduationCap,
    Building2,
    ScrollText,
    Handshake
};

export function AdminSidebar({ navItems, user }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    useEffect(() => {
        const expandedParents = navItems
            .filter(item => item.children?.some(child => pathname.startsWith(child.href)))
            .map(item => item.href);
        setExpandedItems(expandedParents);
    }, [pathname, navItems]);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileOpen]);

    const toggleExpanded = (href: string) => {
        setExpandedItems(prev =>
            prev.includes(href)
                ? prev.filter(h => h !== href)
                : [...prev, href]
        );
    };

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

    const sidebarContent = (
        <>
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.08] dark:border-white/[0.06]">
                <Link
                    href="/admin"
                    className="flex items-center gap-2.5 group"
                    aria-label="Go to admin dashboard"
                >
                    <div className="relative w-8 h-8 transition-transform group-hover:scale-105 duration-300">
                        <Image
                            src="/images/zecurx-logo.png"
                            alt=""
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-manrope font-bold text-base tracking-tight text-foreground">
                            ZecurX
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 font-medium -mt-0.5">
                            Admin Panel
                        </span>
                    </div>
                </Link>
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                    aria-label="Close navigation menu"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>
            </div>

            <div className="mx-3 mt-4 p-3 rounded-xl bg-white/[0.03] dark:bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-start gap-3">
                    <div
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0"
                        aria-hidden="true"
                    >
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground/70 truncate">{user.email}</p>
                        <RoleBadge role={user.role} size="sm" className="mt-1.5" />
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
                <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider" id="nav-heading">
                    Menu
                </p>
                <ul role="list" aria-labelledby="nav-heading" className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedItems.includes(item.href);
                        const isChildActive = hasChildren && item.children?.some(child => 
                            pathname === child.href || pathname.startsWith(child.href)
                        );
                        const isActive = !hasChildren && (pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href)));

                        if (hasChildren) {
                            return (
                                <li key={item.href}>
                                    <button
                                        onClick={() => toggleExpanded(item.href)}
                                        className={cn(
                                            "w-full group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                            "min-h-[44px]",
                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                            isChildActive
                                                ? "text-foreground bg-white/[0.04]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "w-5 h-5 transition-transform duration-200",
                                                !isChildActive && "group-hover:scale-110"
                                            )}
                                        />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        <ChevronDown
                                            className={cn(
                                                "w-4 h-4 transition-transform duration-200",
                                                isExpanded && "rotate-180"
                                            )}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    {isExpanded && (
                                        <ul className="mt-1 space-y-1">
                                            {item.children?.map((child) => {
                                                const ChildIcon = ICON_MAP[child.icon] || LayoutDashboard;
                                                const isChildItemActive = pathname === child.href ||
                                                    pathname.startsWith(child.href);

                                                return (
                                                    <li key={child.href}>
                                                        <Link
                                                            href={child.href}
                                                            aria-current={isChildItemActive ? "page" : undefined}
                                                            className={cn(
                                                                "group flex items-center gap-3 pl-8 pr-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                                                                "min-h-[40px]",
                                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                                isChildItemActive
                                                                    ? "bg-foreground text-background shadow-lg shadow-foreground/10"
                                                                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                                                            )}
                                                        >
                                                            <ChildIcon
                                                                className={cn(
                                                                    "w-4 h-4 transition-transform duration-200",
                                                                    !isChildItemActive && "group-hover:scale-110"
                                                                )}
                                                            />
                                                            <span className="flex-1">{child.label}</span>
                                                            {isChildItemActive && (
                                                                <ChevronRight className="w-3 h-3 opacity-50" aria-hidden="true" />
                                                            )}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        }

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                        "min-h-[44px]",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                        isActive
                                            ? "bg-foreground text-background shadow-lg shadow-foreground/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "w-5 h-5 transition-transform duration-200",
                                            !isActive && "group-hover:scale-110"
                                        )}
                                    />
                                    <span className="flex-1">{item.label}</span>
                                    {isActive && (
                                        <ChevronRight className="w-4 h-4 opacity-50" aria-hidden="true" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-3 border-t border-white/[0.08] dark:border-white/[0.06] space-y-1">
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                        "min-h-[44px]",
                        "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        "group"
                    )}
                >
                    <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                    <span>Back to Site</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                        "min-h-[44px]",
                        "text-muted-foreground hover:text-red-500 hover:bg-red-500/5",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        "group"
                    )}
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl border-b border-white/[0.08]">
                <Link
                    href="/admin"
                    className="flex items-center gap-2"
                    aria-label="Go to admin dashboard"
                >
                    <div className="relative w-8 h-8">
                        <Image
                            src="/images/zecurx-logo.png"
                            alt=""
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="font-manrope font-bold text-base tracking-tight text-foreground">
                        ZecurX
                    </span>
                </Link>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-3 -mr-2 rounded-xl hover:bg-white/[0.04] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Open navigation menu"
                    aria-expanded={isMobileOpen}
                    aria-controls="mobile-sidebar"
                >
                    <Menu className="w-6 h-6" aria-hidden="true" />
                </button>
            </header>

            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                id="mobile-sidebar"
                className={cn(
                    "lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[280px] max-w-[85vw] flex flex-col",
                    "bg-background/95 backdrop-blur-2xl",
                    "border-l border-white/[0.08] dark:border-white/[0.06]",
                    "shadow-[-8px_0_30px_rgba(0,0,0,0.2)]",
                    "transform transition-transform duration-300 ease-out",
                    isMobileOpen ? "translate-x-0" : "translate-x-full"
                )}
                aria-label="Admin navigation"
                aria-hidden={!isMobileOpen}
            >
                {sidebarContent}
            </aside>

            <aside
                className={cn(
                    "hidden lg:flex w-64 flex-col fixed h-full z-20",
                    "bg-background/70 backdrop-blur-2xl",
                    "border-r border-white/[0.08] dark:border-white/[0.06]",
                    "shadow-[1px_0_0_0_rgba(0,0,0,0.03)]",
                    "dark:shadow-[1px_0_0_0_rgba(255,255,255,0.03)]"
                )}
                aria-label="Admin navigation"
            >
                {sidebarContent}
            </aside>
        </>
    );
}
