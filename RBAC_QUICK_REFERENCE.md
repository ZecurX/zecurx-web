# RBAC Quick Reference Card

## Quick Permission Lookup

| Role | Dashboard | Customers | Sales | Products | Plans | Blog | Users | Audit |
|------|-----------|-----------|-------|----------|-------|------|-------|-------|
| super_admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| admin | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| sales | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| marketing | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| media | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

## One-Line Summary

- **super_admin**: Everything
- **admin**: Business + Dashboard (no blog/users)
- **sales**: Customers/Sales/Products + Dashboard
- **marketing**: Plans only
- **media**: Blog only

## Code Reference

```typescript
// src/lib/permissions.ts
ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: ['dashboard:*', 'customers:*', 'sales:*', 'plans:*', 'products:*'],
  sales: ['dashboard:*', 'customers:*', 'sales:*', 'products:*'],
  marketing: ['plans:*'],
  media: ['blog:*'],
}
```

## Files Modified
- `src/lib/permissions.ts` - Main permission config
- `src/types/auth.ts` - Type definitions
- `FINAL_RBAC_PERMISSIONS.md` - Full documentation
