"use client";

import { ReactNode } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Resource, Action } from "@/types/auth";

interface PermissionGateProps {
    resource: Resource;
    action: Action;
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Conditionally renders children based on user permissions.
 * If user doesn't have permission, renders fallback (or nothing).
 */
export function PermissionGate({ 
    resource, 
    action, 
    children, 
    fallback = null 
}: PermissionGateProps) {
    const { hasPermission, isLoading } = useAuth();

    if (isLoading) {
        return null; // Or a loading skeleton
    }

    if (!hasPermission(resource, action)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

interface SuperAdminGateProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Only renders children for super_admin users.
 */
export function SuperAdminGate({ children, fallback = null }: SuperAdminGateProps) {
    const { isSuperAdmin, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!isSuperAdmin()) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
