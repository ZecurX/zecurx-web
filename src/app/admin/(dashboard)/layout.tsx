import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { AdminJWTPayload, Role, RESOURCES, ACTIONS } from "@/types/auth";
import { hasPermission } from "@/lib/permissions";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session?.value) {
        redirect("/admin/login");
    }

    let userInfo: { id: string; email: string; name: string; role: Role } | null = null;

    try {
        const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
        const { payload } = await jwtVerify(session.value, secret);
        const jwtPayload = payload as unknown as AdminJWTPayload;

        userInfo = {
            id: jwtPayload.sub,
            email: jwtPayload.email,
            name: jwtPayload.name,
            role: jwtPayload.role,
        };
    } catch {
        redirect("/admin/login");
    }

    const navItems = [
        {
            href: "/admin",
            label: "Overview",
            icon: "LayoutDashboard",
            visible: hasPermission(userInfo.role, RESOURCES.DASHBOARD, ACTIONS.READ)
        },
        {
            href: "/admin/users",
            label: "Users",
            icon: "UserCog",
            visible: hasPermission(userInfo.role, RESOURCES.USERS, ACTIONS.READ)
        },
        {
            href: "/admin/customers",
            label: "Customers",
            icon: "Users",
            visible: hasPermission(userInfo.role, RESOURCES.CUSTOMERS, ACTIONS.READ)
        },
        {
            href: "/admin/leads/student",
            label: "Student Leads",
            icon: "GraduationCap",
            visible: hasPermission(userInfo.role, RESOURCES.LEADS, ACTIONS.READ)
        },
        {
            href: "/admin/leads/enterprise",
            label: "Enterprise Leads",
            icon: "Building2",
            visible: hasPermission(userInfo.role, RESOURCES.LEADS, ACTIONS.READ)
        },
        {
            href: "/admin/sales",
            label: "Sales",
            icon: "ShoppingCart",
            visible: hasPermission(userInfo.role, RESOURCES.SALES, ACTIONS.READ)
        },
        {
            href: "/admin/plans",
            label: "Plans",
            icon: "Package",
            visible: hasPermission(userInfo.role, RESOURCES.PLANS, ACTIONS.READ)
        },
        {
            href: "/admin/products",
            label: "Products",
            icon: "ShoppingBag",
            visible: hasPermission(userInfo.role, RESOURCES.PRODUCTS, ACTIONS.READ)
        },
        {
            href: "/admin/referral-codes",
            label: "Referral Codes",
            icon: "Ticket",
            visible: hasPermission(userInfo.role, RESOURCES.REFERRAL_CODES, ACTIONS.READ)
        },
        {
            href: "/admin/blog",
            label: "Blog",
            icon: "Newspaper",
            visible: hasPermission(userInfo.role, RESOURCES.BLOG, ACTIONS.READ)
        },
        {
            href: "/admin/whitepapers",
            label: "Whitepapers",
            icon: "FileText",
            visible: hasPermission(userInfo.role, RESOURCES.WHITEPAPERS, ACTIONS.READ)
        },
        {
            href: "/admin/audit",
            label: "Audit Logs",
            icon: "ScrollText",
            visible: hasPermission(userInfo.role, RESOURCES.AUDIT, ACTIONS.READ)
        },
        {
            href: "/admin/system-test",
            label: "System Test",
            icon: "FlaskConical",
            visible: hasPermission(userInfo.role, RESOURCES.SYSTEM_TEST, ACTIONS.READ)
        },
    ].filter(item => item.visible);

    return (
        <AuthProvider>
            <div className="min-h-screen bg-background text-foreground flex relative overflow-x-hidden font-inter selection:bg-primary/20">
                <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2" />
                </div>

                <AdminSidebar navItems={navItems} user={userInfo} />

                <main
                    className="flex-1 lg:ml-64 min-h-screen relative z-10 pt-16 lg:pt-0"
                    role="main"
                    aria-label="Main content"
                >
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
