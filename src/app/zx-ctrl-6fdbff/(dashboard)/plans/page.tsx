import { db } from "@/lib/db";
import PlansList from "./PlansList";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

export default async function PlansPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    
    if (!sessionCookie) {
        redirect('/zx-ctrl-6fdbff/login');
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
        redirect('/zx-ctrl-6fdbff/login');
    }

    if (!hasPermission(session.role, 'plans', 'read')) {
        const roleRedirects: Record<string, string> = {
            media: '/zx-ctrl-6fdbff/blog',
            marketing: '/zx-ctrl-6fdbff/plans',
            sales: '/zx-ctrl-6fdbff',
            admin: '/zx-ctrl-6fdbff',
            super_admin: '/zx-ctrl-6fdbff',
        };
        redirect(roleRedirects[session.role] || '/zx-ctrl-6fdbff/login');
    }

    const result = await db.query<{
        id: string;
        name: string;
        type: string;
        price: number;
        description: string | null;
        active: boolean;
        in_stock: boolean;
        test_mode: boolean;
        created_at: string;
    }>(
        'SELECT id, name, type, price, description, active, COALESCE(in_stock, true) as in_stock, COALESCE(test_mode, false) as test_mode, created_at FROM plans ORDER BY created_at DESC'
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl lg:text-3xl font-manrope font-bold tracking-tight text-foreground">
                    Plans
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your internships and academy courses.
                </p>
            </div>

            <PlansList initialPlans={result.rows} />
        </div>
    );
}
