import { db } from "@/lib/db";
import CustomersClient from "./CustomersClient";
import { requirePagePermission } from "@/lib/page-auth";
import { RESOURCES, ACTIONS } from "@/types/auth";

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
    await requirePagePermission(RESOURCES.CUSTOMERS, ACTIONS.READ);

    const customersResult = await db.query<{
        id: string;
        name: string;
        email: string;
        phone: string;
        college: string | null;
        created_at: string;
    }>(
        'SELECT id, name, email, phone, college, created_at FROM customers WHERE COALESCE(is_test, FALSE) = FALSE ORDER BY created_at DESC'
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
