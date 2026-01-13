import { supabase } from "@/lib/supabase";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
    // Verify the user has permission to view customers
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    
    if (!sessionCookie) {
        redirect('/admin/login');
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
        redirect('/admin/login');
    }

    // Check if user has read permission for customers
    if (!hasPermission(session.role, 'customers', 'read')) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground">You don't have permission to view customers.</p>
                </div>
            </div>
        );
    }
    // Fetch customers with their latest transaction and plan details
    const { data: customers } = await supabase
        .from("customers")
        .select(`
            *,
            transactions (
                created_at,
                plans (
                    name
                )
            )
        `)
        .order("created_at", { ascending: false });

    // Process customers to get the latest plan
    const customersWithPlan = customers?.map(customer => {
        // Sort transactions by date descending to get the latest
        const latestTransaction = customer.transactions?.sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        return {
            ...customer,
            latestPlan: latestTransaction?.plans?.name || 'No Active Plan'
        };
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>

            <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Mobile Number</th>
                                <th className="px-6 py-4 font-medium">College</th>
                                <th className="px-6 py-4 font-medium">Active Plan</th>
                                <th className="px-6 py-4 font-medium">Joined Date</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {customersWithPlan?.map((customer) => (
                                <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-foreground">{customer.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="w-3 h-3" />
                                            {customer.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {customer.phone ? (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="w-3 h-3" />
                                                    {customer.phone}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground/50 text-xs italic">N/A</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm ${customer.college ? 'text-foreground' : 'text-muted-foreground/50 italic'}`}>
                                            {customer.college || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.latestPlan !== 'No Active Plan'
                                                ? 'bg-primary/10 text-primary border border-primary/20'
                                                : 'bg-muted text-muted-foreground border border-border'
                                            }`}>
                                            {customer.latestPlan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(customer.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-xs text-primary hover:text-primary/80 transition-colors">View History</button>
                                    </td>
                                </tr>
                            ))}
                            {(!customers || customers.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                        No customers found.
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
