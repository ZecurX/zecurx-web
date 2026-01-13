import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getAuditLogs, cleanupOldAuditLogs } from "@/lib/audit";
import { ROLES, AuditAction } from "@/types/auth";

// GET - Fetch audit logs with filtering (super_admin only)
export async function GET(req: NextRequest) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const searchParams = req.nextUrl.searchParams;
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const adminId = searchParams.get('admin_id') || undefined;
        const action = searchParams.get('action') as AuditAction | undefined;
        const resource = searchParams.get('resource') || undefined;
        const startDate = searchParams.get('start_date') || undefined;
        const endDate = searchParams.get('end_date') || undefined;

        const { data, count, error } = await getAuditLogs({
            page,
            limit,
            adminId,
            action,
            resource,
            startDate,
            endDate,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({
            logs: data,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            }
        });
    } catch (error) {
        console.error("Get audit logs error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// DELETE - Cleanup old audit logs (super_admin only)
export async function DELETE(req: NextRequest) {
    const auth = await requireRole([ROLES.SUPER_ADMIN], req);
    
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        // Clean up logs older than 90 days
        const { success, deleted, error } = await cleanupOldAuditLogs(90);

        if (!success) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Cleaned up ${deleted} old audit logs` 
        });
    } catch (error) {
        console.error("Cleanup audit logs error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
