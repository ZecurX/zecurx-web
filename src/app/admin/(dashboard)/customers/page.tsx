import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import CustomersClient from "./CustomersClient";

export const dynamic = 'force-dynamic';

interface Transaction {
    created_at: string;
    amount: number;
    plans: {
        name: string;
        type: string;
    } | null;
}

interface CustomerWithTransactions {
    id: string;
    name: string;
    email: string;
    phone: string;
    college?: string;
    created_at: string;
    transactions: Transaction[];
}

export default async function CustomersPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    
    if (!sessionCookie) {
        redirect('/admin/login');
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
        redirect('/admin/login');
    }

    if (!hasPermission(session.role, 'customers', 'read')) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground">You don&apos;t have permission to view customers.</p>
                </div>
            </div>
        );
    }

    const { data: customers } = await supabase
        .from("customers")
        .select(`
            *,
            transactions (
                created_at,
                amount,
                plans (
                    name,
                    type
                )
            )
        `)
        .order("created_at", { ascending: false });

    return <CustomersClient customers={(customers as CustomerWithTransactions[]) || []} />;
}
