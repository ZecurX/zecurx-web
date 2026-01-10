import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
    const { data: transactions } = await supabase
        .from("transactions")
        .select("*, customers(name, email, phone)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales & Transactions</h1>

            <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {transactions?.map((tx) => (
                                <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{(tx.customers as any)?.name}</span>
                                            <span className="text-xs text-muted-foreground">{(tx.customers as any)?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground font-mono">{tx.order_id}</td>
                                    <td className="px-6 py-4 text-foreground font-medium">₹{tx.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'captured' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {(!transactions || transactions.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
