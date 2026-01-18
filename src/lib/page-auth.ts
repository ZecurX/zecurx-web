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
    redirect('/zx-ctrl-6fdbff/login');
  }

  try {
    const { payload } = await jwtVerify(session.value, getJwtSecret());
    const user = payload as unknown as AdminJWTPayload;

    const canAccess = hasPermission(user.role, resource, action);

    if (!canAccess) {
      const roleRedirects: Record<string, string> = {
        media: '/zx-ctrl-6fdbff/blog',
        marketing: '/zx-ctrl-6fdbff/plans',
        sales: '/zx-ctrl-6fdbff',
        admin: '/zx-ctrl-6fdbff',
        super_admin: '/zx-ctrl-6fdbff',
      };

      redirect(roleRedirects[user.role] || '/zx-ctrl-6fdbff/login');
    }

    return user;
  } catch {
    redirect('/zx-ctrl-6fdbff/login');
  }
}
