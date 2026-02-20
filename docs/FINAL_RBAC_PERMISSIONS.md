# Final RBAC Permission Matrix - ZecurX Platform

**Last Updated:** 2026-01-16  
**Status:** ✅ Production Ready

---

## Role Hierarchy

```
100 - super_admin   (Full System Access)
 50 - admin         (Business Operations + Analytics)
 30 - sales         (Sales Operations + Analytics)
 20 - marketing     (Plans Only)
 15 - media         (Blog Only)
```

---

## Complete Permission Matrix

| Resource / Feature | super_admin | admin | sales | marketing | media |
|-------------------|-------------|-------|-------|-----------|-------|
| **Dashboard** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Analytics** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Users Management** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Customers** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Sales** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Products** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Plans** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Blog** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Audit Logs** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Detailed Role Permissions

### 🔴 Super Admin
**Hierarchy Level:** 100  
**Permission:** `*` (wildcard - full access)

**Access:**
- ✅ Dashboard & Analytics
- ✅ User Management (create, edit, delete users)
- ✅ Customers Management
- ✅ Sales Management
- ✅ Products Management
- ✅ Plans Management
- ✅ Blog Management (create, edit, delete, publish)
- ✅ Audit Logs Viewing
- ✅ System Settings

**Use Case:** System administrators, platform owners

---

### 🟠 Admin
**Hierarchy Level:** 50  
**Permissions:** `dashboard:*`, `customers:*`, `sales:*`, `plans:*`, `products:*`

**Access:**
- ✅ Dashboard & Analytics
- ✅ Customers Management (full CRUD)
- ✅ Sales Management (full CRUD)
- ✅ Products Management (full CRUD)
- ✅ Plans Management (full CRUD)
- ❌ User Management
- ❌ Blog Management
- ❌ Audit Logs

**Use Case:** Business managers, operations leads

---

### 🟡 Sales Team
**Hierarchy Level:** 30  
**Permissions:** `dashboard:*`, `customers:*`, `sales:*`, `products:*`

**Access:**
- ✅ Dashboard & Analytics
- ✅ Customers Management (full CRUD)
- ✅ Sales Management (full CRUD)
- ✅ Products Management (full CRUD)
- ❌ Plans Management
- ❌ User Management
- ❌ Blog Management
- ❌ Audit Logs

**Use Case:** Sales representatives, account managers

**Key Difference from Admin:**
- Cannot manage Plans (pricing tiers)
- Focused on customer relationships and sales operations

---

### 🟢 Marketing Team
**Hierarchy Level:** 20  
**Permissions:** `plans:*`

**Access:**
- ✅ Plans Management (full CRUD)
- ❌ Dashboard & Analytics
- ❌ Customers
- ❌ Sales
- ❌ Products
- ❌ Blog
- ❌ User Management
- ❌ Audit Logs

**Use Case:** Marketing team managing pricing strategies

**What They Can Do:**
- Create new pricing plans
- Update plan features and pricing
- Activate/deactivate plans
- View plan subscription counts

**What They Cannot Do:**
- View customer data
- Access sales records
- See dashboard analytics
- Manage blog content

---

### 🔵 Media Team
**Hierarchy Level:** 15  
**Permissions:** `blog:*`

**Access:**
- ✅ Blog Management (full CRUD + publish)
- ❌ Dashboard & Analytics
- ❌ Customers
- ❌ Sales
- ❌ Products
- ❌ Plans
- ❌ User Management
- ❌ Audit Logs

**Use Case:** Content creators, blog editors

**What They Can Do:**
- Create blog posts
- Edit blog posts
- Delete blog posts
- Publish/unpublish posts
- Upload images
- Manage blog labels

**What They Cannot Do:**
- View business metrics
- Access customer data
- See sales information
- View dashboard

---

## Dashboard & Analytics Access

**Who Can View Dashboard:**
- ✅ `super_admin` - Full access to all metrics
- ✅ `admin` - Full business analytics
- ✅ `sales` - Sales and customer analytics
- ❌ `marketing` - **NO ACCESS**
- ❌ `media` - **NO ACCESS**

**Analytics Breakdown:**

| Metric Type | super_admin | admin | sales | marketing | media |
|-------------|-------------|-------|-------|-----------|-------|
| Revenue Analytics | ✅ | ✅ | ✅ | ❌ | ❌ |
| Customer Insights | ✅ | ✅ | ✅ | ❌ | ❌ |
| Sales Performance | ✅ | ✅ | ✅ | ❌ | ❌ |
| Product Metrics | ✅ | ✅ | ✅ | ❌ | ❌ |
| Plan Subscriptions | ✅ | ✅ | ❌ | ❌ | ❌ |
| Blog Analytics | ✅ | ❌ | ❌ | ❌ | ❌ |
| User Activity | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Sidebar Navigation by Role

### Super Admin Sidebar
```
📊 Dashboard
👥 Users
👤 Customers
💰 Sales
📦 Products
💳 Plans
📝 Blog
📋 Audit Logs
```

### Admin Sidebar
```
📊 Dashboard
👤 Customers
💰 Sales
📦 Products
💳 Plans
```

### Sales Team Sidebar
```
📊 Dashboard
👤 Customers
💰 Sales
📦 Products
```

### Marketing Team Sidebar
```
💳 Plans
```

### Media Team Sidebar
```
📝 Blog
```

---

## Permission Enforcement

### API Endpoint Protection

All endpoints use `requirePermission(resource, action, req)`:

```typescript
// Example: Sales endpoint
export async function GET(req: NextRequest) {
  const authResult = await requirePermission('sales', 'read', req);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 403 });
  }
  // ... proceed with logic
}
```

### Frontend Route Guards

```typescript
// In admin layout or dashboard page
const userRole = session.role;

// Redirect based on role
if (userRole === 'marketing' && path === '/admin/dashboard') {
  redirect('/admin/plans'); // Marketing can't view dashboard
}

if (userRole === 'media' && path === '/admin/dashboard') {
  redirect('/admin/blog'); // Media can't view dashboard
}
```

---

## Use Case Scenarios

### Scenario 1: Sales Representative Daily Workflow
**Role:** `sales`

**Morning:**
1. Login → Redirected to Dashboard ✅
2. View today's sales metrics ✅
3. Check customer activity ✅

**During Day:**
4. Add new customer ✅
5. Create sales order ✅
6. Update product inventory ✅
7. Try to view Plans → ❌ Access Denied

### Scenario 2: Marketing Manager Daily Workflow
**Role:** `marketing`

**Morning:**
1. Login → Redirected to Plans page (no dashboard access) ✅
2. Try to view Dashboard → ❌ Access Denied

**During Day:**
3. Create new pricing plan ✅
4. Update plan features ✅
5. Activate seasonal promotion plan ✅
6. Try to view customer data → ❌ Access Denied
7. Try to view sales reports → ❌ Access Denied

### Scenario 3: Media Team Daily Workflow
**Role:** `media`

**Morning:**
1. Login → Redirected to Blog page (no dashboard access) ✅
2. Try to view Dashboard → ❌ Access Denied

**During Day:**
3. Create new blog post ✅
4. Upload featured image ✅
5. Add labels to post ✅
6. Publish post ✅
7. Try to view customer data → ❌ Access Denied
8. Try to view sales reports → ❌ Access Denied

---

## Security Considerations

### 1. Principle of Least Privilege
Each role has **only** the permissions needed for their job function:
- Marketing doesn't need customer data → No access
- Media doesn't need business metrics → No dashboard
- Sales doesn't need plan pricing control → No plans access

### 2. Data Isolation
- Marketing team **cannot** view customer PII
- Media team **cannot** view sales revenue
- Sales team **cannot** modify pricing plans

### 3. Audit Trail
All actions are logged with:
- User ID and role
- Resource accessed
- Action performed
- IP address
- Timestamp

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/types/auth.ts` | Role and permission type definitions |
| `src/lib/permissions.ts` | Permission matrix and authorization logic |
| `src/lib/auth.ts` | JWT validation and permission checking |
| `src/app/api/*/route.ts` | API endpoint protection |

---

## Testing Checklist

### Super Admin Tests
- [ ] Can access all features
- [ ] Can view dashboard
- [ ] Can manage users
- [ ] Can manage blog
- [ ] Can view audit logs

### Admin Tests
- [ ] Can view dashboard ✅
- [ ] Can manage customers ✅
- [ ] Can manage sales ✅
- [ ] Can manage products ✅
- [ ] Can manage plans ✅
- [ ] Cannot manage users ❌
- [ ] Cannot manage blog ❌
- [ ] Cannot view audit logs ❌

### Sales Team Tests
- [ ] Can view dashboard ✅
- [ ] Can manage customers ✅
- [ ] Can manage sales ✅
- [ ] Can manage products ✅
- [ ] Cannot manage plans ❌
- [ ] Cannot manage blog ❌
- [ ] Cannot manage users ❌

### Marketing Team Tests
- [ ] Can manage plans ✅
- [ ] Cannot view dashboard ❌
- [ ] Cannot view customers ❌
- [ ] Cannot view sales ❌
- [ ] Cannot manage products ❌
- [ ] Cannot manage blog ❌
- [ ] Redirected to /admin/plans on login ✅

### Media Team Tests
- [ ] Can manage blog ✅
- [ ] Can publish posts ✅
- [ ] Cannot view dashboard ❌
- [ ] Cannot view customers ❌
- [ ] Cannot view sales ❌
- [ ] Cannot manage plans ❌
- [ ] Redirected to /admin/blog on login ✅

---

## Migration from Old Structure

### Changes Made

**Admin Role:**
- ✅ Kept: Dashboard, Customers, Sales, Products, Plans
- ❌ Removed: Blog access

**Sales Role:**
- ✅ Kept: Dashboard, Customers, Sales, Products
- ❌ Removed: Plans access

**Marketing Role:**
- ✅ Added: Plans access
- ❌ Removed: All other access

**Media Role:**
- ✅ Added: Blog access (new role)
- ❌ Removed: All other access

---

## Summary

### Key Changes
1. ✅ **Marketing** now has **plans access only** (no dashboard, no analytics)
2. ✅ **Sales** now has **customers, sales, products** + **dashboard/analytics** (no plans)
3. ✅ **Media** has **blog access only** (no dashboard, no analytics)
4. ✅ **Admin** has full business access + dashboard/analytics (no blog)
5. ✅ **Super Admin** has full system access

### Dashboard Access
- ✅ Super Admin, Admin, Sales
- ❌ Marketing, Media

### Who Can View What
```
Dashboard/Analytics: super_admin, admin, sales
Customers:          super_admin, admin, sales
Sales:              super_admin, admin, sales
Products:           super_admin, admin, sales
Plans:              super_admin, admin, marketing
Blog:               super_admin, media
Users:              super_admin
Audit Logs:         super_admin
```

---

**End of Permission Matrix**
