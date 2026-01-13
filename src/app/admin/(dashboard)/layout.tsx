import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { AdminJWTPayload, Role, RESOURCES, ACTIONS } from "@/types/auth";
import { hasPermission } from "@/lib/permissions";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // Auth Guard - Get session and verify
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session?.value) {
        redirect("/admin/login");
    }

    // Verify JWT and extract user info
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

    // Build navigation items based on user's role
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
            href: "/admin/blog", 
            label: "Blog", 
            icon: "Newspaper",
            visible: hasPermission(userInfo.role, RESOURCES.BLOG, ACTIONS.READ)
        },
        { 
            href: "/admin/audit", 
            label: "Audit Logs", 
            icon: "FileText",
            visible: hasPermission(userInfo.role, RESOURCES.AUDIT, ACTIONS.READ)
        },
    ].filter(item => item.visible);

    return (
        <AuthProvider>
            <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden font-manrope selection:bg-primary/20">
                {/* Background Effects */}
                <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

                {/* Sidebar */}
                <AdminSidebar navItems={navItems} user={userInfo} />

                {/* Main Content */}
                <main className="flex-1 ml-64 min-h-screen relative z-10">
                    <div className="p-8 max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
