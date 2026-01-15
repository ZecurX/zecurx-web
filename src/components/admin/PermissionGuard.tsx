'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { hasPermission } from '@/lib/permissions';
import { Resource, Action } from '@/types/auth';
import { Loader2 } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  resource: Resource;
  action: Action;
}

export function PermissionGuard({ children, resource, action }: PermissionGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/admin/login');
      return;
    }

    const canAccess = hasPermission(user.role, resource, action);

    if (!canAccess) {
      const roleRedirects: Record<string, string> = {
        media: '/admin/blog',
        marketing: '/admin/plans',
        sales: '/admin',
        admin: '/admin',
        super_admin: '/admin',
      };

      router.push(roleRedirects[user.role] || '/admin/login');
      return;
    }

    setIsChecking(false);
  }, [user, isLoading, resource, action, router]);

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
