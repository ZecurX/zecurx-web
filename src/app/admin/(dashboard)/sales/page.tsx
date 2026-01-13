import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

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
    // Verify the user has permission to view sales
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    
    if (!sessionCookie) {
        redirect('/admin/login');
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
        redirect('/admin/login');
    }

    // Check if user has read permission for sales
    if (!hasPermission(session.role, 'sales', 'read')) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground">You don't have permission to view sales.</p>
                </div>
            </div>
        );
    }
    const { data: transactions } = await supabase
        .from("transactions")
        .select("*, customers(name, email, phone)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales &amp; Transactions</h1>

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
                            {(transactions as Transaction[] | null)?.map((tx) => (
                                <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{tx.customers?.name}</span>
                                            <span className="text-xs text-muted-foreground">{tx.customers?.email}</span>
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
