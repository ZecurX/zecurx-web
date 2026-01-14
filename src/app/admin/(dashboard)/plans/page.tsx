import { supabase } from "@/lib/supabase";
import PlansList from "./PlansList";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PlansPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    
    if (!sessionCookie) {
        redirect('/admin/login');
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
        redirect('/admin/login');
    }

    if (!hasPermission(session.role, 'plans', 'read')) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className={cn(
                    "text-center space-y-4 p-8 rounded-2xl",
                    "bg-background/70 backdrop-blur-xl",
                    "border border-white/[0.08]"
                )}>
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-manrope font-bold text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground text-sm">You don&apos;t have permission to view plans.</p>
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
            <div>
                <h1 className="text-2xl lg:text-3xl font-manrope font-bold tracking-tight text-foreground">
                    Plans
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your internships and academy courses.
                </p>
            </div>

            <PlansList initialPlans={plans || []} />
        </div>
    );
}
