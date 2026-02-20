# RBAC Update: Media Role Implementation

**Date:** 2026-01-16  
**Change Type:** Role-Based Access Control Update  
**Status:** ✅ Implemented - Pending Database Migration

---

## Summary

Added a new `media` role to the ZecurX RBAC system with exclusive blog management access. Only `media` and `super_admin` roles can access blog functionality, with `super_admin` having additional publish/unpublish privileges.

---

## Changes Made

### 1. Type Definitions (`src/types/auth.ts`)

**Added:**
- `ROLES.MEDIA = 'media'`
- `ACTIONS.PUBLISH = 'publish'`

**New Role Type:**
```typescript
export type Role = 'super_admin' | 'admin' | 'sales' | 'marketing' | 'media'
```

**New Action Type:**
```typescript
export type Action = 'read' | 'write' | 'create' | 'update' | 'delete' | 'publish' | '*'
```

### 2. Permission Configuration (`src/lib/permissions.ts`)

**Role Hierarchy:**
```typescript
SUPER_ADMIN: 100  // Full access
ADMIN:       50   // No blog access
SALES:       30   // No blog access
MARKETING:   20   // No blog access (deprecated)
MEDIA:       15   // Blog access only
```

**Updated Permissions:**

| Role | Blog Permissions | Publish/Unpublish |
|------|-----------------|-------------------|
| `super_admin` | ✅ Full access (`*`) | ✅ Yes |
| `admin` | ❌ No access | ❌ No |
| `sales` | ❌ No access | ❌ No |
| `marketing` | ❌ No access (deprecated) | ❌ No |
| `media` | ✅ Full blog access (`blog:*`) | ✅ Yes |

**Detailed Media Permissions:**
```typescript
[ROLES.MEDIA]: [
  'blog:*',  // ✅ Full access to all blog actions
]

// This includes:
// - blog:create   ✅ Can create posts
// - blog:read     ✅ Can view all posts
// - blog:update   ✅ Can edit posts
// - blog:delete   ✅ Can delete posts
// - blog:publish  ✅ Can publish/unpublish posts
```

### 3. Publish Endpoint Security (`src/app/api/admin/blog/[id]/publish/route.ts`)

**Updated Permission Check:**
```typescript
// Before: requirePermission('blog', 'update', req)
// After:  requirePermission('blog', 'publish', req)
```

**Who Can Publish/Unpublish:**
- ✅ `super_admin` (has `*` permission for everything)
- ✅ `media` (has `blog:*` permission)
- ❌ All other roles (no blog access)

### 4. New API Endpoint: Media User Setup

**Endpoint:** `POST /api/admin/setup/media-user`  
**Access:** `super_admin` only  
**Purpose:** Create default media user account

**Response Example:**
```json
{
  "success": true,
  "message": "Media user created successfully",
  "user": {
    "id": "uuid",
    "email": "media@zecurx.com",
    "role": "media",
    "name": "Media Team",
    "is_active": true,
    "created_at": "2026-01-16T..."
  },
  "credentials": {
    "email": "media@zecurx.com",
    "password": "media123",
    "warning": "CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN"
  },
  "permissions": {
    "blog:create": true,
    "blog:read": true,
    "blog:update": true,
    "blog:delete": true,
    "blog:publish": true
  }
}
```

### 5. Database Migration Script

**File:** `scripts/add_media_role.sql`

**What It Does:**
1. Adds `'media'` to `admin_role` enum type
2. Creates default media user if not exists
3. Verifies migration success

**Expected Output:**
```
NOTICE: Added media role to admin_role enum
NOTICE: Created media user with ID: <uuid>
NOTICE: Default password: media123 (CHANGE THIS IMMEDIATELY)
```

---

## Migration Steps

### Step 1: Update Database Enum

Run the SQL migration to add the `media` role to your database:

```bash
# Option A: Using psql
psql -h <host> -U <user> -d <database> -f scripts/add_media_role.sql

# Option B: Using the Next.js API (recommended)
curl -X POST http://localhost:3000/api/admin/setup/media-user \
  -H "Authorization: Bearer <super_admin_token>" \
  -H "Content-Type: application/json"
```

### Step 2: Verify Migration

Check that the media role and user exist:

```sql
-- Verify role exists in enum
SELECT unnest(enum_range(NULL::admin_role)) AS available_roles;

-- Verify media user created
SELECT id, email, role, name, is_active 
FROM admins 
WHERE role = 'media';
```

### Step 3: Test Access Control

**Test 1: Media User Login**
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "media@zecurx.com", "password": "media123"}'
```

**Test 2: Create Blog Post (Should Succeed)**
```bash
curl -X POST http://localhost:3000/api/admin/blog \
  -H "Authorization: Bearer <media_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "<p>Test content</p>",
    "status": "draft"
  }'
```

**Test 3: Publish Post as Media (Should Succeed)**
```bash
curl -X POST http://localhost:3000/api/admin/blog/<post_id>/publish \
  -H "Authorization: Bearer <media_token>"

# Expected: {"success": true, "message": "Blog post published"}
```

**Test 4: Publish as Super Admin (Should Also Succeed)**
```bash
curl -X POST http://localhost:3000/api/admin/blog/<post_id>/publish \
  -H "Authorization: Bearer <super_admin_token>"

# Expected: {"success": true, "message": "Blog post published"}
```

---

## Access Control Matrix

| Action | super_admin | admin | sales | marketing | media |
|--------|------------|-------|-------|-----------|-------|
| **Dashboard** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Users** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Customers** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Sales** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Plans** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Products** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Blog: Create** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Blog: Read** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Blog: Update** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Blog: Delete** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Blog: Publish** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Audit Logs** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Security Considerations

### 1. Publish/Unpublish Workflow

**Media Team Workflow:**
1. Media team creates blog posts via `/admin/blog/new`
2. Posts can be saved as `draft` or `published`
3. Media team can edit, delete, and publish their posts
4. **Can** publish/unpublish posts directly
5. Full autonomy over blog content

**Super Admin Workflow:**
1. Has same blog access as media team
2. Can override/edit any blog post
3. Can publish/unpublish any post
4. Plus access to all other system features

### 2. UI Changes Required

**Edit Page (`/admin/blog/[id]/edit/page.tsx`):**
```typescript
// No role-specific UI changes needed
// Both super_admin and media see the same interface
// Publish/Unpublish button visible to both roles
```

**Blog List Page (`/admin/blog/page.tsx`):**
- Show publish status badge
- Add "Publish/Unpublish" toggle for both super_admin and media
- Both roles have identical blog management UI

### 3. Audit Logging

All publish/unpublish actions are logged:

```sql
INSERT INTO audit_logs (
  admin_id,
  admin_email,
  admin_role,
  action,
  resource,
  resource_id,
  details,
  ip_address,
  user_agent
) VALUES (
  '<super_admin_id>',
  'admin@zecurx.com',
  'super_admin',
  'publish',
  'blog_post',
  '<post_id>',
  '{"post_title": "...", "published": true}',
  '192.168.1.100',
  'Mozilla/5.0...'
);
```

---

## Rollback Plan

If issues arise, rollback using:

```sql
-- Step 1: Remove media users
DELETE FROM admins WHERE role = 'media';

-- Step 2: Remove media role from enum (PostgreSQL 12+)
-- Note: Cannot remove enum values in older PostgreSQL versions
-- You would need to recreate the enum type

-- Alternative: Disable media users
UPDATE admins SET is_active = false WHERE role = 'media';
```

---

## Default Credentials

**⚠️ SECURITY WARNING:**

After migration, a default media user is created with:
- **Email:** `media@zecurx.com`
- **Password:** `media123`
- **Role:** `media`

**CRITICAL:** Change this password immediately after first login!

---

## Testing Checklist

- [ ] Run database migration script
- [ ] Verify `media` role exists in `admin_role` enum
- [ ] Verify media user created with correct permissions
- [ ] Test media user login
- [ ] Test media user can create blog posts
- [ ] Test media user can edit blog posts
- [ ] Test media user can delete blog posts
- [ ] Test media user **CAN** publish posts (200 OK)
- [ ] Test super_admin can publish posts
- [ ] Test super_admin can unpublish posts
- [ ] Verify audit logs capture publish/unpublish actions
- [ ] Test UI shows/hides publish button based on role
- [ ] Change default media password

---

## API Endpoints Updated

| Endpoint | Method | Old Permission | New Permission | Who Can Access |
|----------|--------|---------------|----------------|----------------|
| `/api/admin/blog` | POST | `blog:create` | `blog:create` | super_admin, media |
| `/api/admin/blog` | GET | `blog:read` | `blog:read` | super_admin, media |
| `/api/admin/blog/[id]` | GET | `blog:read` | `blog:read` | super_admin, media |
| `/api/admin/blog/[id]` | PUT | `blog:update` | `blog:update` | super_admin, media |
| `/api/admin/blog/[id]` | DELETE | `blog:delete` | `blog:delete` | super_admin, media |
| `/api/admin/blog/[id]/publish` | POST | `blog:update` | `blog:publish` | **super_admin ONLY** |

---

## Files Modified

```
✅ src/types/auth.ts                                    (Added media role, publish action)
✅ src/lib/permissions.ts                               (Updated permissions)
✅ src/app/api/admin/blog/[id]/publish/route.ts        (Changed to blog:publish)
✅ src/app/api/admin/setup/media-user/route.ts         (New endpoint)
✅ scripts/add_media_role.sql                           (Database migration)
✅ scripts/create_media_user.ts                         (User creation script)
📝 RBAC_MEDIA_ROLE.md                                   (This documentation)
```

---

## Next Steps

1. **Run migration script** to add media role to database
2. **Create media user** via API or script
3. **Update UI components** to show/hide publish button based on role
4. **Test complete workflow** with both media and super_admin users
5. **Change default password** for media user
6. **Deploy to production** with proper environment variables

---

## Questions?

For issues or questions, refer to:
- **Permissions Logic:** `/src/lib/permissions.ts`
- **RBAC Types:** `/src/types/auth.ts`
- **Publish Endpoint:** `/src/app/api/admin/blog/[id]/publish/route.ts`
- **Audit Logs:** `/src/lib/audit.ts`

---

**End of Documentation**
