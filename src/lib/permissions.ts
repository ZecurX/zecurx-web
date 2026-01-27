import { Role, Permission, Resource, Action, ROLES, RESOURCES, ACTIONS } from '@/types/auth';

// Role hierarchy - higher number = more privileges
export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.ADMIN]: 50,
  [ROLES.SALES]: 30,
  [ROLES.MARKETING]: 20,
  [ROLES.MEDIA]: 15,
};

// Role display names
export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SALES]: 'Sales',
  [ROLES.MARKETING]: 'Marketing',
  [ROLES.MEDIA]: 'Media',
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: 'Full system access including all features and analytics',
  [ROLES.ADMIN]: 'Full business operations access with dashboard and analytics',
  [ROLES.SALES]: 'Customers, sales, and products management with analytics access',
  [ROLES.MARKETING]: 'Plans and whitepapers management (no dashboard or analytics)',
  [ROLES.MEDIA]: 'Exclusive blog and whitepapers management (no dashboard or analytics)',
};

// Permissions for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: ['*'], // Full access to everything
  
  [ROLES.ADMIN]: [
    'dashboard:*',
    'customers:*',
    'sales:*',
    'plans:*',
    'products:*',
    'leads:*',
    'referral_codes:*',
    'blog:read',
    'whitepapers:*',
    'seminars:*',
    'settings:*',
  ],

  [ROLES.SALES]: [
    'dashboard:*',
    'customers:*',
    'sales:*',
    'products:*',
    'leads:*',
    'referral_codes:*',
    // NO blog access
  ],

  [ROLES.MARKETING]: [
    'plans:*',
    'leads:read',
    'whitepapers:*',
  ],
  
  [ROLES.MEDIA]: [
    'blog:*', // Full blog management
    'whitepapers:*',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, resource: Resource, action: Action): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  // Super admin has all permissions
  if (permissions.includes('*')) {
    return true;
  }

  // Check for exact permission match
  const exactPermission = `${resource}:${action}` as Permission;
  if (permissions.includes(exactPermission)) {
    return true;
  }

  // Check for wildcard action on resource (e.g., 'customers:*')
  const wildcardPermission = `${resource}:*` as Permission;
  if (permissions.includes(wildcardPermission)) {
    return true;
  }

  // Check if '*' action is requested and role has any permission on resource
  if (action === ACTIONS.ALL) {
    return permissions.some(p => p.startsWith(`${resource}:`));
  }

  return false;
}

/**
 * Check if a role can manage another role (for user management)
 * Only higher hierarchy roles can manage lower ones
 */
export function canManageRole(managerRole: Role, targetRole: Role): boolean {
  // Super admin can manage all roles
  if (managerRole === ROLES.SUPER_ADMIN) {
    return true;
  }

  // Others cannot manage any roles
  return false;
}

/**
 * Get all permissions for a role (expanded from wildcards)
 */
export function getExpandedPermissions(role: Role): string[] {
  const permissions = ROLE_PERMISSIONS[role];

  if (permissions.includes('*')) {
    // Return all possible permissions
    const allPermissions: string[] = [];
    Object.values(RESOURCES).forEach(resource => {
      Object.values(ACTIONS).forEach(action => {
        if (action !== '*') {
          allPermissions.push(`${resource}:${action}`);
        }
      });
    });
    return allPermissions;
  }

  const expanded: string[] = [];
  permissions.forEach(permission => {
    if (permission.endsWith(':*')) {
      const resource = permission.split(':')[0];
      Object.values(ACTIONS).forEach(action => {
        if (action !== '*') {
          expanded.push(`${resource}:${action}`);
        }
      });
    } else {
      expanded.push(permission);
    }
  });

  return expanded;
}

/**
 * Get roles that a given role can assign to new users
 */
export function getAssignableRoles(role: Role): Role[] {
  if (role !== ROLES.SUPER_ADMIN) {
    return [];
  }
  
  // Super admin can assign all roles except super_admin
  return [ROLES.ADMIN, ROLES.SALES, ROLES.MARKETING, ROLES.MEDIA];
}

/**
 * Validate if a role string is valid
 */
export function isValidRole(role: string): role is Role {
  return Object.values(ROLES).includes(role as Role);
}

/**
 * Get sidebar navigation items based on role
 */
export function getSidebarItemsForRole(role: Role): {
  name: string;
  href: string;
  icon: string;
  resource: Resource;
}[] {
  const allItems = [
    { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard', resource: RESOURCES.DASHBOARD },
    { name: 'Users', href: '/admin/users', icon: 'Users', resource: RESOURCES.USERS },
    { name: 'Customers', href: '/admin/customers', icon: 'UserCircle', resource: RESOURCES.CUSTOMERS },
    { name: 'Sales', href: '/admin/sales', icon: 'CreditCard', resource: RESOURCES.SALES },
    { name: 'Plans', href: '/admin/plans', icon: 'Package', resource: RESOURCES.PLANS },
    { name: 'Products', href: '/admin/products', icon: 'ShoppingBag', resource: RESOURCES.PRODUCTS },
    { name: 'Seminars', href: '/admin/seminars', icon: 'CalendarDays', resource: RESOURCES.SEMINARS },
    { name: 'Blog', href: '/admin/blog', icon: 'Newspaper', resource: RESOURCES.BLOG },
    { name: 'Whitepapers', href: '/admin/whitepapers', icon: 'FileText', resource: RESOURCES.WHITEPAPERS },
    { name: 'Audit Logs', href: '/admin/audit', icon: 'ScrollText', resource: RESOURCES.AUDIT },
  ];

  return allItems.filter(item => hasPermission(role, item.resource, ACTIONS.READ));
}
