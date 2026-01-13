import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { DollarSign, ShoppingCart, Users, TrendingUp, Package } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Fetch stats (parallel)
    const [
        { count: transactionCount, data: transactions },
        { count: customerCount },
        { count: activePlanCount },
        { count: productOrderCount, data: productOrders },
        { data: recentSales }
    ] = await Promise.all([
        supabase.from("transactions").select("amount", { count: "exact" }),
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("plans").select("*", { count: "exact", head: true }).eq('active', true),
        supabase.from("orders").select("amount", { count: "exact" }).eq('status', 'completed'),
        supabase
            .from("transactions")
            .select("*, customers(name, email)")
            .order("created_at", { ascending: false })
            .limit(5)
    ]);

    // Fetch recent product orders
    const { data: recentProductOrders } = await supabase
        .from("orders")
        .select("*, products(name)")
        .order("created_at", { ascending: false })
        .limit(5);

    const planRevenue = transactions?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0;
    const productRevenue = productOrders?.reduce((sum, order) => sum + (Number(order.amount) || 0), 0) || 0;
    const totalRevenue = planRevenue + productRevenue;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                    trend={`Plans: ₹${planRevenue.toLocaleString()} | Products: ₹${productRevenue.toLocaleString()}`}
                />
                <StatsCard
                    title="Plan Sales"
                    value={transactionCount?.toString() || "0"}
                    icon={<ShoppingCart className="w-4 h-4 text-blue-500" />}
                />
                <StatsCard
                    title="Products Sold"
                    value={productOrderCount?.toString() || "0"}
                    icon={<Package className="w-4 h-4 text-cyan-500" />}
                    trend="Hardware Orders"
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

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Plan Sales */}
                <div className="bg-card/40 border border-border/50 rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Recent Plan Sales</h3>
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

                {/* Recent Product Orders */}
                <div className="bg-card/40 border border-border/50 rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Recent Product Orders</h3>
                    <div className="space-y-4">
                        {recentProductOrders?.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No product orders yet.</p>
                        ) : (
                            recentProductOrders?.map((order) => (
                                <div key={order.id} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">
                                            {order.customer_name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{(order.products as any)?.name || 'Product'}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-medium text-foreground">₹{order.amount}</span>
                                        <span className={`block text-xs capitalize ${order.status === 'completed' ? 'text-emerald-500' : order.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
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
