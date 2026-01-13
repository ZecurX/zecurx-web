import { supabase } from './supabase';
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

/**
 * Create an audit log entry
 */
export async function createAuditLog(input: AuditLogInput): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      admin_id: input.adminId,
      admin_email: input.adminEmail,
      admin_role: input.adminRole,
      action: input.action,
      resource: input.resource,
      resource_id: input.resourceId || null,
      details: input.details || null,
      ip_address: input.ipAddress || null,
      user_agent: input.userAgent || null,
    });

    if (error) {
      console.error('Failed to create audit log:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Audit log error:', err);
    return { success: false, error: 'Failed to create audit log' };
  }
}

/**
 * Get audit logs with filtering and pagination
 */
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

    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (options.adminId) {
      query = query.eq('admin_id', options.adminId);
    }
    if (options.action) {
      query = query.eq('action', options.action);
    }
    if (options.resource) {
      query = query.eq('resource', options.resource);
    }
    if (options.startDate) {
      query = query.gte('created_at', options.startDate);
    }
    if (options.endDate) {
      query = query.lte('created_at', options.endDate);
    }

    const { data, count, error } = await query;

    if (error) {
      return { data: null, count: 0, error: error.message };
    }

    return { data: data as AuditLog[], count: count || 0 };
  } catch (err) {
    console.error('Get audit logs error:', err);
    return { data: null, count: 0, error: 'Failed to fetch audit logs' };
  }
}

/**
 * Delete audit logs older than specified days (for cleanup)
 */
export async function cleanupOldAuditLogs(daysToKeep: number = 90): Promise<{ success: boolean; deleted?: number; error?: string }> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { data, error } = await supabase
      .from('audit_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .select('id');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, deleted: data?.length || 0 };
  } catch (err) {
    console.error('Cleanup audit logs error:', err);
    return { success: false, error: 'Failed to cleanup audit logs' };
  }
}

/**
 * Helper to log login events
 */
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

/**
 * Helper to log logout events
 */
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

/**
 * Helper to log CRUD operations
 */
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

/**
 * Helper to log password reset events
 */
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

/**
 * Helper to log blog post creation
 */
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

/**
 * Helper to log blog post updates
 */
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

/**
 * Helper to log blog post deletion
 */
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

/**
 * Helper to log blog publish/unpublish
 */
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
