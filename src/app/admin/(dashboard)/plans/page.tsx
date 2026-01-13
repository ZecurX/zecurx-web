import { supabase } from "@/lib/supabase";
import PlansList from "./PlansList";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PlansPage() {
    // Verify the user has permission to view plans
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    
    if (!sessionCookie) {
        redirect('/admin/login');
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
        redirect('/admin/login');
    }

    // Check if user has read permission for plans
    if (!hasPermission(session.role, 'plans', 'read')) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground">You don't have permission to view plans.</p>
                </div>
            </div>
        );
    }
    const { data: plans } = await supabase
        .from("plans")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Plans</h1>
                    <p className="text-zinc-400">Manage your internships and academy courses.</p>
                </div>
            </div>

            <PlansList initialPlans={plans || []} />
        </div>
    );
}

