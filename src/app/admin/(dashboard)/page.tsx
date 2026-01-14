import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { supabase } from "@/lib/supabase";
import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AdminJWTPayload } from "@/types/auth";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

interface CustomerInfo {
    name: string;
    email: string;
}

interface Sale {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    customers: CustomerInfo | null;
}

export default async function AdminDashboard() {
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
                <div>
                    <h1 className="text-2xl lg:text-3xl font-manrope font-bold tracking-tight text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Welcome back! Here&apos;s what&apos;s happening today.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="w-4 h-4" />}
                    iconBg="bg-emerald-500/10"
                    iconColor="text-emerald-500"
                    trend={{ value: 12, positive: true }}
                />
                <StatsCard
                    title="Sales"
                    value={transactionCount?.toString() || "0"}
                    icon={<ShoppingCart className="w-4 h-4" />}
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-500"
                    trend={{ value: 8, positive: true }}
                />
                <StatsCard
                    title="Active Customers"
                    value={customerCount?.toString() || "0"}
                    icon={<Users className="w-4 h-4" />}
                    iconBg="bg-orange-500/10"
                    iconColor="text-orange-500"
                />
                <StatsCard
                    title="Active Plans"
                    value={activePlanCount?.toString() || "0"}
                    icon={<TrendingUp className="w-4 h-4" />}
                    iconBg="bg-purple-500/10"
                    iconColor="text-purple-500"
                    subtitle="Internship & Academy"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                <div className={cn(
                    "lg:col-span-4 p-6 rounded-2xl",
                    "bg-background/70 backdrop-blur-xl",
                    "border border-white/[0.08] dark:border-white/[0.06]",
                    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
                    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
                )}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-manrope font-semibold text-foreground">Recent Transactions</h3>
                        <span className="text-xs text-muted-foreground">Last 5</span>
                    </div>
                    <div className="space-y-4">
                        {recentSales?.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-8 text-center">No transactions found.</p>
                        ) : (
                            (recentSales as Sale[] | null)?.map((sale, index) => (
                                <div 
                                    key={sale.id} 
                                    className={cn(
                                        "flex items-center justify-between py-3",
                                        index !== (recentSales?.length ?? 0) - 1 && "border-b border-white/[0.06]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                                            {sale.customers?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {sale.customers?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70">{sale.customers?.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-foreground">₹{sale.amount}</p>
                                        <p className={cn(
                                            "text-xs font-medium capitalize",
                                            sale.status === 'captured' ? 'text-emerald-500' : 'text-muted-foreground'
                                        )}>
                                            {sale.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={cn(
                    "lg:col-span-3 p-6 rounded-2xl flex flex-col items-center justify-center",
                    "bg-background/70 backdrop-blur-xl",
                    "border border-white/[0.08] dark:border-white/[0.06]",
                    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
                    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
                )}>
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                        <TrendingUp className="w-7 h-7 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">Sales Analytics</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Coming Soon</p>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ 
    title, 
    value, 
    icon, 
    iconBg = "bg-primary/10", 
    iconColor = "text-primary",
    trend,
    subtitle 
}: { 
    title: string; 
    value: string; 
    icon: React.ReactNode; 
    iconBg?: string;
    iconColor?: string;
    trend?: { value: number; positive: boolean };
    subtitle?: string;
}) {
    return (
        <div className={cn(
            "p-5 rounded-2xl space-y-3",
            "bg-background/70 backdrop-blur-xl",
            "border border-white/[0.08] dark:border-white/[0.06]",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
            "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]",
            "hover:border-white/[0.12] transition-colors duration-300"
        )}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className={cn("p-2 rounded-xl", iconBg, iconColor)}>
                    {icon}
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-foreground font-manrope">{value}</div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-0.5 text-xs font-medium",
                        trend.positive ? "text-emerald-500" : "text-red-500"
                    )}>
                        {trend.positive ? (
                            <ArrowUpRight className="w-3 h-3" />
                        ) : (
                            <ArrowDownRight className="w-3 h-3" />
                        )}
                        {trend.value}%
                    </div>
                )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground/60">{subtitle}</p>}
        </div>
    );
}
