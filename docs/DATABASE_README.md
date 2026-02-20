# ZecurX Database & Backend Documentation

## Database Connection

```
Host: 209.38.155.227
Port: 5432
Database: zecurx_platform
Username: zecurx
Password: zecurxdb2026
Schema: zecurx_admin (website), public (LMS)
SSL: disabled
```

**Connection String:**
```
DATABASE_URL=postgresql://zecurx:zecurxdb2026@209.38.155.227:5432/zecurx_platform
```

The `db.ts` file automatically sets `SET search_path TO zecurx_admin, public` on each connection.

---

## Admin Credentials

| Email                   | Password           | Role        |
| ----------------------- | ------------------ | ----------- |
| superadmin@zecurx.com   | SuperAdmin@2026!   | super_admin |
| admin@zecurx.com        | (bcrypt in DB)     | admin       |
| marketing@zecurx.com    | (bcrypt in DB)     | marketing   |
| windro@zecurx.com       | (bcrypt in DB)     | marketing   |

---

## Database Schema (zecurx_admin)

### Tables

| Table                      | Purpose                          |
| -------------------------- | -------------------------------- |
| admins                     | Admin users for dashboard        |
| audit_logs                 | All admin actions logged         |
| blog_posts                 | Blog articles                    |
| blog_labels                | Blog categories/tags             |
| blog_post_labels           | Many-to-many blog-label relation |
| customers                  | Payment customers                |
| transactions               | Payment records                  |
| plans                      | Internship/course plans          |
| products                   | Shop products                    |
| orders                     | Product orders                   |
| email_templates            | Email templates                  |
| scheduled_emails           | Scheduled email queue            |
| enterprise_leads           | B2B leads                        |
| enterprise_lead_activities | Lead activity tracking           |
| enterprise_lead_emails     | Lead email history               |
| enterprise_lead_notes      | Lead notes                       |
| student_leads              | Student leads                    |
| student_lead_activities    | Student activity tracking        |
| student_lead_emails        | Student email history            |
| student_lead_notes         | Student notes                    |

### Foreign Keys

```
transactions.customer_id → customers.id
transactions.plan_id → plans.id
blog_post_labels.blog_post_id → blog_posts.id
blog_post_labels.label_id → blog_labels.id
blog_posts.author_id → admins.id
audit_logs.admin_id → admins.id
orders.product_id → products.id
```

---

## Key Files

### Database Layer
```
/src/lib/db.ts              - PostgreSQL client (pg package)
/src/lib/audit.ts           - Audit logging functions
/src/lib/supabase-storage.ts - Supabase Storage only (images)
```

### API Routes (All use raw SQL)
```
/api/admin/auth             - Login, session
/api/admin/users            - Admin CRUD
/api/admin/blog             - Blog CRUD
/api/admin/blog/labels      - Label CRUD
/api/admin/products         - Product CRUD
/api/admin/plans/[id]       - Plan updates
/api/admin/audit            - Audit log viewer
/api/admin/export           - CSV/XLSX export
/api/admin/upload           - Image upload (Supabase Storage)
/api/blog                   - Public blog list
/api/blog/[slug]            - Public blog post
/api/products               - Public products
/api/razorpay/webhook       - Payment webhook + invoice
/api/razorpay/verify-payment - Payment verification
/api/razorpay/create-order  - Create Razorpay order
/api/send-email             - Email sending (Resend)
```

---

## Payment Flow

```
1. User pays via Razorpay
2. Razorpay sends webhook to /api/razorpay/webhook
3. Webhook verifies HMAC signature
4. Customer saved/updated in customers table
5. Transaction saved in transactions table
6. PDF Invoice generated
7. Email with invoice sent to customer
8. Admin notification sent
9. Google Sheets updated (internships only)
```

### Webhook Security
- HMAC-SHA256 signature verification
- Uses RAZORPAY_WEBHOOK_SECRET env var
- Timing-attack resistant with crypto.timingSafeEqual()

---

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://zecurx:zecurxdb2026@209.38.155.227:5432/zecurx_platform

# Supabase (Storage only)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Razorpay
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Email (Resend)
RESEND_API_KEY=xxx

# Google Sheets (optional)
GOOGLE_SHEETS_PRIVATE_KEY=xxx
GOOGLE_SHEETS_CLIENT_EMAIL=xxx
GOOGLE_SHEETS_SPREADSHEET_ID=xxx

# App
NEXT_PUBLIC_SITE_URL=https://www.zecurx.com
JWT_SECRET=xxx
```

---

## Useful SQL Commands

### Check table counts
```sql
SET search_path TO zecurx_admin;
SELECT relname, n_live_tup FROM pg_stat_user_tables WHERE schemaname = 'zecurx_admin' ORDER BY n_live_tup DESC;
```

### Recent transactions
```sql
SET search_path TO zecurx_admin;
SELECT c.name, c.email, t.amount, t.status, t.created_at 
FROM transactions t 
JOIN customers c ON t.customer_id = c.id 
ORDER BY t.created_at DESC LIMIT 10;
```

### Recent audit logs
```sql
SET search_path TO zecurx_admin;
SELECT action, resource, admin_email, created_at 
FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

### Check indexes
```sql
SET search_path TO zecurx_admin;
SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'zecurx_admin';
```

---

## Migration History

### January 2026: Supabase → VPS PostgreSQL
- Migrated all API routes from Supabase client to raw SQL
- Created `/src/lib/db.ts` with connection pooling
- Kept Supabase only for Storage (image uploads)
- Added invoice PDF generation on payment
- All data now in VPS PostgreSQL at 209.38.155.227

### Files Removed
- `/src/lib/supabase.ts` (wrapper - no longer needed)
- `/src/lib/supabase-client.ts` (client stub - no longer needed)

### Files Added
- `/src/lib/db.ts` - PostgreSQL client
- `/src/lib/invoice.ts` - PDF invoice generator
- `/src/lib/blog-utils.ts` - Client-safe blog utilities

---

## Testing APIs

### Login as admin
```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@zecurx.com","password":"SuperAdmin@2026!"}' \
  -c /tmp/cookies.txt
```

### Check session
```bash
curl http://localhost:3000/api/admin/auth -b /tmp/cookies.txt
```

### List blog posts
```bash
curl http://localhost:3000/api/blog
```

### Check webhook status
```bash
curl http://localhost:3000/api/razorpay/webhook
```

---

## Contact

- Website: https://www.zecurx.com
- Admin Email: official@zecurx.com
- Internship Email: zecurxintern@gmail.com
