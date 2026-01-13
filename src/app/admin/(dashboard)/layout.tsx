import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, ShoppingBag } from "lucide-react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // Auth Guard
    // Middleware already protects this, but we double-check for safety
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session?.value) {
        redirect("/admin/login");
    }

    // Optional: You could verify JWT here too if you want strict server-side checking
    // But middleware handles the heavy lifting.

    return (
        <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden font-manrope selection:bg-primary/20">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Sidebar (Glassmorphic) */}
            <aside className="w-64 border-r border-border/40 bg-background/50 backdrop-blur-xl flex flex-col fixed h-full z-20">
                <div className="h-16 flex items-center px-6 border-b border-border/40 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="font-bold text-lg tracking-tight relative z-10 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">ZecurX Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />}>Overview</NavLink>
                    <NavLink href="/admin/sales" icon={<ShoppingCart className="w-4 h-4" />}>Sales</NavLink>
                    <NavLink href="/admin/customers" icon={<Users className="w-4 h-4" />}>Customers</NavLink>
                    <NavLink href="/admin/plans" icon={<Package className="w-4 h-4" />}>Plans</NavLink>
                    <NavLink href="/admin/products" icon={<ShoppingBag className="w-4 h-4" />}>Products</NavLink>
                </nav>

                <div className="p-4 border-t border-border/40">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
                        <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                        <span>Settings</span>
                    </div>
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2 group">
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen relative z-10">
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/10"
        >
            {icon}
            {children}
        </Link>
    );
}
