'use client';

import { ReactNode } from 'react';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { RESOURCES, ACTIONS } from '@/types/auth';

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard resource={RESOURCES.USERS} action={ACTIONS.READ}>
      {children}
    </PermissionGuard>
  );
}
