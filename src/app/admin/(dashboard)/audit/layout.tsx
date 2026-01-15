'use client';

import { ReactNode } from 'react';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { RESOURCES, ACTIONS } from '@/types/auth';

export default function AuditLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard resource={RESOURCES.AUDIT} action={ACTIONS.READ}>
      {children}
    </PermissionGuard>
  );
}
