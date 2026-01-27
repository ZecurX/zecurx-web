// Role-Based Access Control Types

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SALES: 'sales',
  MARKETING: 'marketing',
  MEDIA: 'media',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const RESOURCES = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  CUSTOMERS: 'customers',
  SALES: 'sales',
  PLANS: 'plans',
  PRODUCTS: 'products',
  AUDIT: 'audit',
  BLOG: 'blog',
  LEADS: 'leads',
  REFERRAL_CODES: 'referral_codes',
  SYSTEM_TEST: 'system_test',
  WHITEPAPERS: 'whitepapers',
  SEMINARS: 'seminars',
  SETTINGS: 'settings',
} as const;

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];

export const ACTIONS = {
  READ: 'read',
  WRITE: 'write',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  PUBLISH: 'publish',
  ALL: '*',
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

export type Permission = `${Resource}:${Action}` | '*';

// Admin user from database
export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  role: Role;
  name: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Admin without sensitive fields (for API responses)
export interface AdminPublic {
  id: string;
  email: string;
  role: Role;
  name: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// JWT Payload structure
export interface AdminJWTPayload {
  sub: string;      // Admin ID
  email: string;
  name: string;
  role: Role;
  iat: number;
  exp: number;
}

// Audit log entry
export interface AuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  admin_role: Role;
  action: AuditAction;
  resource: string;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const AUDIT_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  PASSWORD_RESET: 'password_reset',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

// Create user request
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: Role;
}

// Update user request
export interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: Role;
  is_active?: boolean;
}

// Password reset request
export interface PasswordResetRequest {
  new_password: string;
}

// Session info for frontend
export interface SessionInfo {
  id: string;
  email: string;
  name: string;
  role: Role;
}

// Blog types
export type BlogStatus = 'draft' | 'published';

export interface BlogLabel {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_id: string;
  author_name?: string;
  author_email?: string;
  status: BlogStatus;
  published_at: string | null;
  meta_description: string | null;
  view_count: number;
  labels?: BlogLabel[];
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  status: BlogStatus;
  meta_description?: string;
  label_ids?: string[];
}

export interface UpdateBlogPostRequest {
  title?: string;
  // slug is NOT allowed to be changed
  content?: string;
  excerpt?: string;
  featured_image_url?: string;
  status?: BlogStatus;
  meta_description?: string;
  label_ids?: string[];
}

export interface CreateBlogLabelRequest {
  name: string;
  color?: string;
}

export interface UpdateBlogLabelRequest {
  name?: string;
  color?: string;
}

// Whitepaper types
export type WhitepaperStatus = 'draft' | 'published';

export interface Whitepaper {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  pages: number;
  cover_image_url: string | null;
  pdf_url: string;
  author_id: string;
  author_name?: string;
  author_email?: string;
  status: WhitepaperStatus;
  published_at: string | null;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateWhitepaperRequest {
  title: string;
  slug?: string;
  summary: string;
  category: string;
  pages?: number;
  cover_image_url?: string;
  pdf_url: string;
  status: WhitepaperStatus;
}

export interface UpdateWhitepaperRequest {
  title?: string;
  summary?: string;
  category?: string;
  pages?: number;
  cover_image_url?: string;
  pdf_url?: string;
  status?: WhitepaperStatus;
}
