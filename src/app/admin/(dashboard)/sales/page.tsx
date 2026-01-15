import { db } from "@/lib/db";
import { requirePagePermission } from "@/lib/page-auth";
import { RESOURCES, ACTIONS } from "@/types/auth";

export const dynamic = 'force-dynamic';

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
}

interface Transaction {
    id: string;
    order_id: string;
    amount: number;
    status: string;
    created_at: string;
    customers: CustomerInfo | null;
}

export default async function SalesPage() {
    await requirePagePermission(RESOURCES.SALES, ACTIONS.READ);

    const result = await db.query<{
        id: string;
        order_id: string;
        amount: number;
        status: string;
        created_at: string;
        customer_name: string | null;
        customer_email: string | null;
        customer_phone: string | null;
    }>(
        `SELECT t.id, t.order_id, t.amount, t.status, t.created_at,
                c.name as customer_name, c.email as customer_email, c.phone as customer_phone
        FROM transactions t
        LEFT JOIN customers c ON t.customer_id = c.id
        ORDER BY t.created_at DESC`
    );

    const transactions: Transaction[] = result.rows.map(row => ({
        id: row.id,
        order_id: row.order_id,
        amount: row.amount,
        status: row.status,
        created_at: row.created_at,
        customers: row.customer_name ? {
            name: row.customer_name,
            email: row.customer_email || '',
            phone: row.customer_phone || ''
        } : null
    }));

    const totalRevenue = transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const capturedCount = transactions.filter(tx => tx.status === 'captured').length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl lg:text-3xl font-manrope font-bold tracking-tight text-foreground">
                    Sales & Transactions
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Track all payments and transactions.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-5 rounded-2xl bg-background/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground font-manrope mt-1">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-2xl bg-background/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]">
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold text-foreground font-manrope mt-1">{transactions.length}</p>
                </div>
                <div className="p-5 rounded-2xl bg-background/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]">
                    <p className="text-sm font-medium text-muted-foreground">Successful</p>
                    <p className="text-2xl font-bold text-emerald-500 font-manrope mt-1">{capturedCount}</p>
                </div>
            </div>

            <div className="hidden md:block rounded-2xl bg-background/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left" role="table" aria-label="Transactions list">
                        <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Customer</th>
                                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Order ID</th>
                                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Amount</th>
                                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold" aria-hidden="true">
                                                {tx.customers?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{tx.customers?.name || 'Unknown'}</p>
                                                <p className="text-xs text-muted-foreground/70">{tx.customers?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs text-muted-foreground bg-white/[0.03] px-2 py-1 rounded">
                                            {tx.order_id?.slice(0, 20)}...
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-foreground font-semibold">₹{tx.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            tx.status === 'captured' 
                                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <time dateTime={tx.created_at}>
                                            {new Date(tx.created_at).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </time>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="md:hidden space-y-3" role="list" aria-label="Transactions list">
                {transactions.map((tx) => (
                    <article key={tx.id} className="p-4 rounded-2xl bg-background/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)] space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0" aria-hidden="true">
                                    {tx.customers?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-foreground truncate">{tx.customers?.name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground/70 truncate">{tx.customers?.email}</p>
                                </div>
                            </div>
                            <span className={`shrink-0 inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                                tx.status === 'captured' 
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                                {tx.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                            <div>
                                <p className="text-xs text-muted-foreground">Amount</p>
                                <p className="text-lg font-bold text-foreground">₹{tx.amount}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Date</p>
                                <time dateTime={tx.created_at} className="text-sm text-foreground">
                                    {new Date(tx.created_at).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </time>
                            </div>
                        </div>
                    </article>
                ))}
                {transactions.length === 0 && (
                    <div className="p-8 rounded-2xl bg-background/70 backdrop-blur-xl border border-white/[0.08] text-center text-muted-foreground">
                        No transactions found.
                    </div>
                )}
            </div>
        </div>
    );
}
