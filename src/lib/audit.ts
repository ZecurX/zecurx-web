import { db } from './db';
import { AuditAction, AuditLog, Role } from '@/types/auth';

interface AuditLogInput {
  adminId: string;
  adminEmail: string;
  adminRole: Role;
  action: AuditAction;
  resource: string;
  resourceId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function createAuditLog(input: AuditLogInput): Promise<{ success: boolean; error?: string }> {
  try {
    await db.query(
      `INSERT INTO audit_logs (admin_id, admin_email, admin_role, action, resource, resource_id, details, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        input.adminId,
        input.adminEmail,
        input.adminRole,
        input.action,
        input.resource,
        input.resourceId || null,
        input.details ? JSON.stringify(input.details) : null,
        input.ipAddress || null,
        input.userAgent || null,
      ]
    );

    return { success: true };
  } catch (err) {
    console.error('Audit log error:', err);
    return { success: false, error: 'Failed to create audit log' };
  }
}

export async function getAuditLogs(options: {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: AuditAction;
  resource?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ data: AuditLog[] | null; count: number; error?: string }> {
  try {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (options.adminId) {
      conditions.push(`admin_id = $${paramIndex++}`);
      values.push(options.adminId);
    }
    if (options.action) {
      conditions.push(`action = $${paramIndex++}`);
      values.push(options.action);
    }
    if (options.resource) {
      conditions.push(`resource = $${paramIndex++}`);
      values.push(options.resource);
    }
    if (options.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      values.push(options.startDate);
    }
    if (options.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      values.push(options.endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM audit_logs ${whereClause}`,
      values
    );
    const count = parseInt(countResult.rows[0].count);

    const dataResult = await db.query<AuditLog>(
      `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return { data: dataResult.rows, count };
  } catch (err) {
    console.error('Get audit logs error:', err);
    return { data: null, count: 0, error: 'Failed to fetch audit logs' };
  }
}

export async function cleanupOldAuditLogs(daysToKeep: number = 90): Promise<{ success: boolean; deleted?: number; error?: string }> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await db.query<{ id: string }>(
      `DELETE FROM audit_logs WHERE created_at < $1 RETURNING id`,
      [cutoffDate.toISOString()]
    );

    return { success: true, deleted: result.rows.length };
  } catch (err) {
    console.error('Cleanup audit logs error:', err);
    return { success: false, error: 'Failed to cleanup audit logs' };
  }
}

export async function logLogin(
  admin: { id: string; email: string; role: Role },
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await createAuditLog({
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'login',
    resource: 'auth',
    ipAddress,
    userAgent,
  });
}

export async function logLogout(
  admin: { id: string; email: string; role: Role },
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await createAuditLog({
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'logout',
    resource: 'auth',
    ipAddress,
    userAgent,
  });
}

export async function logCRUD(
  admin: { id: string; email: string; role: Role },
  action: 'create' | 'update' | 'delete',
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await createAuditLog({
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action,
    resource,
    resourceId,
    details,
    ipAddress,
    userAgent,
  });
}

export async function logPasswordReset(
  admin: { id: string; email: string; role: Role },
  targetUserId: string,
  targetUserEmail: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await createAuditLog({
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'password_reset',
    resource: 'user',
    resourceId: targetUserId,
    details: { target_email: targetUserEmail },
    ipAddress,
    userAgent,
  });
}

export async function logBlogCreate(
  admin: { id: string; email: string; role: Role },
  blogId: string,
  blogTitle: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await createAuditLog({
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'create',
    resource: 'blog',
    resourceId: blogId,
    details: { title: blogTitle },
    ipAddress,
    userAgent,
  });
}

export async function logBlogUpdate(
  admin: { id: string; email: string; role: Role },
  blogId: string,
  blogTitle: string,
  changes: Record<string, unknown>,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await createAuditLog({
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'update',
    resource: 'blog',
    resourceId: blogId,
    details: { title: blogTitle, changes },
    ipAddress,
    userAgent,
  });
}

export async function logBlogDelete(
  admin: { id: string; email: string; role: Role },
  blogId: string,
  blogTitle: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await createAuditLog({
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'delete',
    resource: 'blog',
    resourceId: blogId,
    details: { title: blogTitle },
    ipAddress,
    userAgent,
  });
}

export async function logBlogPublish(
  admin: { id: string; email: string; role: Role },
  blogId: string,
  blogTitle: string,
  published: boolean,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await createAuditLog({
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'update',
    resource: 'blog',
    resourceId: blogId,
    details: { title: blogTitle, action: published ? 'published' : 'unpublished' },
    ipAddress,
    userAgent,
  });
}
