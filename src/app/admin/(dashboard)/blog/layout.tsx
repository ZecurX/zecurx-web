'use client';

import { ReactNode } from 'react';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { RESOURCES, ACTIONS } from '@/types/auth';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard resource={RESOURCES.BLOG} action={ACTIONS.READ}>
      {children}
    </PermissionGuard>
  );
}
