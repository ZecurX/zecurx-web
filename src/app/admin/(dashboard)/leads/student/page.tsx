import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { supabase } from "@/lib/supabase";
import { hasPermission } from "@/lib/permissions";
import { AdminJWTPayload, RESOURCES, ACTIONS } from "@/types/auth";
import StudentLeadsClient from "./StudentLeadsClient";

export const dynamic = 'force-dynamic';

export default async function StudentLeadsPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session?.value) {
        redirect("/admin/login");
    }

    try {
        const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
        const { payload } = await jwtVerify(session.value, secret);
        const user = payload as unknown as AdminJWTPayload;

        // Check permission
        if (!hasPermission(user.role, RESOURCES.LEADS, ACTIONS.READ)) {
            redirect("/admin");
        }
    } catch {
        redirect("/admin/login");
    }

    // Fetch initial leads
    const { data: leads, count } = await supabase
        .from("student_leads")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(20);

    return (
        <StudentLeadsClient
            initialLeads={leads || []}
            totalCount={count || 0}
        />
    );
}
