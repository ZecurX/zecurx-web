import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { AdminJWTPayload, Resource, Action } from '@/types/auth';
import { hasPermission } from '@/lib/permissions';
import { getJwtSecret } from '@/lib/auth';

export async function requirePagePermission(resource: Resource, action: Action) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session?.value) {
    redirect('/admin/login');
  }

  try {
    const { payload } = await jwtVerify(session.value, getJwtSecret());
    const user = payload as unknown as AdminJWTPayload;

    const canAccess = hasPermission(user.role, resource, action);

    if (!canAccess) {
      const roleRedirects: Record<string, string> = {
        media: '/admin/blog',
        marketing: '/admin/plans',
        sales: '/admin',
        admin: '/admin',
        super_admin: '/admin',
      };

      redirect(roleRedirects[user.role] || '/admin/login');
    }

    return user;
  } catch {
    redirect('/admin/login');
  }
}
