import { db } from "@/lib/db";
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

    const customersResult = await db.query<{
        id: string;
        name: string;
        email: string;
        phone: string;
        college: string | null;
        created_at: string;
    }>(
        'SELECT id, name, email, phone, college, created_at FROM customers ORDER BY created_at DESC'
    );

    const customerIds = customersResult.rows.map(c => c.id);
    
    let transactionsMap: Record<string, Transaction[]> = {};
    
    if (customerIds.length > 0) {
        const placeholders = customerIds.map((_, i) => `$${i + 1}`).join(', ');
        const transactionsResult = await db.query<{
            customer_id: string;
            created_at: string;
            amount: number;
            plan_name: string | null;
            plan_type: string | null;
        }>(
            `SELECT t.customer_id, t.created_at, t.amount, p.name as plan_name, p.type as plan_type
            FROM transactions t
            LEFT JOIN plans p ON t.plan_id = p.id
            WHERE t.customer_id IN (${placeholders})`,
            customerIds
        );

        transactionsResult.rows.forEach(row => {
            if (!transactionsMap[row.customer_id]) {
                transactionsMap[row.customer_id] = [];
            }
            transactionsMap[row.customer_id].push({
                created_at: row.created_at,
                amount: row.amount,
                plans: row.plan_name ? { name: row.plan_name, type: row.plan_type || '' } : null
            });
        });
    }

    const customers: CustomerWithTransactions[] = customersResult.rows.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        college: c.college || undefined,
        created_at: c.created_at,
        transactions: transactionsMap[c.id] || []
    }));

    return <CustomersClient customers={customers} />;
}
