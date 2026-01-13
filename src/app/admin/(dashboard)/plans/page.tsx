import { supabase } from "@/lib/supabase";
import PlansList from "./PlansList";

export const dynamic = 'force-dynamic';

export default async function PlansPage() {
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

