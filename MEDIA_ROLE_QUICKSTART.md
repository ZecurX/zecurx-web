# Media Role - Quick Reference

## Setup (Choose One Method)

### Method 1: API Endpoint (Recommended)
```bash
curl -X POST http://localhost:3000/api/admin/setup/media-user \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Method 2: SQL Script
```bash
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB -f scripts/add_media_role.sql
```

## Default Credentials
- **Email:** media@zecurx.com
- **Password:** media123
- **⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN**

## Permissions Summary

| Role | Blog Access | Publish | Other Features |
|------|------------|---------|----------------|
| media | ✅ Full | ✅ Yes | ❌ None |
| super_admin | ✅ Full | ✅ Yes | ✅ All |
| admin | ❌ None | ❌ No | ✅ Business |
| sales | ❌ None | ❌ No | ✅ Sales |
| marketing | ❌ None | ❌ No | ❌ None |

## Files Changed
- `src/types/auth.ts` - Added MEDIA role
- `src/lib/permissions.ts` - Updated permissions
- `src/app/api/admin/blog/[id]/publish/route.ts` - Updated auth
- `src/app/api/admin/setup/media-user/route.ts` - New endpoint
- `scripts/add_media_role.sql` - Migration script

## Testing
1. Create media user (see setup above)
2. Login at `/admin/login`
3. Navigate to `/admin/blog/new`
4. Create and publish a post
5. Verify on `/blog`

## Documentation
- **Full Guide:** `RBAC_MEDIA_ROLE.md`
- **Security Report:** `BLOG_SECURITY_REPORT.md`
