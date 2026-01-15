import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { query } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { AdminJWTPayload, RESOURCES, ACTIONS } from "@/types/auth";
import StudentLeadsClient from "./StudentLeadsClient";
import { StudentLead } from "@/types/lead-types";

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

        if (!hasPermission(user.role, RESOURCES.LEADS, ACTIONS.READ)) {
            redirect("/admin");
        }
    } catch {
        redirect("/admin/login");
    }

    const countResult = await query<{ count: string }>(
        `SELECT COUNT(*) as count FROM student_leads`
    );
    const totalCount = parseInt(countResult.rows[0]?.count || '0');

    const leadsResult = await query<StudentLead>(
        `SELECT * FROM student_leads ORDER BY created_at DESC LIMIT 20`
    );

    return (
        <StudentLeadsClient
            initialLeads={leadsResult.rows}
            totalCount={totalCount}
        />
    );
}
