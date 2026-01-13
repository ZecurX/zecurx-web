import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { supabase } from "@/lib/supabase";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { AdminJWTPayload } from "@/types/auth";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Check user role for redirect
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (session?.value) {
        try {
            const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
            const { payload } = await jwtVerify(session.value, secret);
            const user = payload as unknown as AdminJWTPayload;

            if (user.role === 'marketing') {
                redirect('/admin/blog');
            }
        } catch (e) {
            // Ignore error, layout will handle auth
        }
    }

    // Fetch stats (parallel)
    const [
        { count: transactionCount, data: transactions },
        { count: customerCount },
        { count: activePlanCount },
        { data: recentSales }
    ] = await Promise.all([
        supabase.from("transactions").select("amount", { count: "exact" }),
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("plans").select("*", { count: "exact", head: true }).eq('active', true),
        supabase
            .from("transactions")
            .select("*, customers(name, email)")
            .order("created_at", { ascending: false })
            .limit(5)
    ]);

    const totalRevenue = transactions?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                />
                <StatsCard
                    title="Sales"
                    value={transactionCount?.toString() || "0"}
                    icon={<ShoppingCart className="w-4 h-4 text-blue-500" />}
                />
                <StatsCard
                    title="Active Customers"
                    value={customerCount?.toString() || "0"}
                    icon={<Users className="w-4 h-4 text-orange-500" />}
                />
                <StatsCard
                    title="Active Plans"
                    value={activePlanCount?.toString() || "0"}
                    icon={<TrendingUp className="w-4 h-4 text-purple-500" />}
                    trend="Internship & Academy"
                />
            </div>

            {/* Recent Sales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-card/40 border border-border/50 rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {recentSales?.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No transactions found.</p>
                        ) : (
                            recentSales?.map((sale) => (
                                <div key={sale.id} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">
                                            {(sale.customers as any)?.name || 'Unknown User'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{(sale.customers as any)?.email}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-medium text-foreground">₹{sale.amount}</span>
                                        <span className="block text-xs text-emerald-500 capitalize">{sale.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Placeholder for Chart */}
                <div className="col-span-3 bg-card/40 border border-border/50 rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground">
                    <p>Sales Chart Component</p>
                    <p className="text-xs mt-2">(Coming Soon)</p>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend?: string }) {
    return (
        <div className="p-6 bg-card/40 border border-border/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                {icon}
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
        </div>
    );
}
