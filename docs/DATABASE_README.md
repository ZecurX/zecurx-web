# ZecurX Database Handbook

This document explains how database access works in this repository, how schemas are organized, and what to check before shipping DB-related changes.

> **Security first:** Never store real database hosts, usernames, passwords, or admin credentials in documentation. Use environment variables only.

---

## 1) Database Platform

- **Engine:** PostgreSQL
- **Client library:** `pg` (Node/Postgres)
- **Connection source:** `DATABASE_URL`
- **Connection code:** `src/lib/db.ts`
- **Query style:** raw SQL (no ORM)

### Runtime connection behavior
When a DB connection is established, the app sets:

- `search_path TO zecurx_admin, seminar, public`
- `statement_timeout = 10000` (10 seconds)

This affects how unqualified table names resolve.

---

## 2) Schema Overview

### `zecurx_admin`
Primary business/admin schema:

- admin users/sessions/invitations
- products/plans/orders/transactions/customers
- blog/whitepaper/case-study content
- referrals/payouts
- lead management and activity tracking
- audit logs

### `seminar`
Seminar operations:

- seminar registrations
- attendance/feedback
- certificate-related records

### `public`
Shared LMS-facing data:

- users
- enrollments
- internships
- password reset tokens

---

## 3) Key Data Relationships (Conceptual)

- `transactions.customer_id -> customers.id`
- `transactions.plan_id -> plans.id`
- `orders / order_items` link commerce purchases to products
- `blog_posts.author_id -> admins.id`
- `blog_post_labels` maps many-to-many blog labels
- `audit_logs.admin_id -> admins.id`

> Note: Always verify actual constraints in SQL scripts/current DB before major refactors.

---

## 4) Environment Variables

Use `.env.example` as reference. Typical DB-related vars:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>
```

Related infrastructure that often matters for DB flows:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RAZORPAY_*`
- `SENDGRID_API_KEY`
- `JWT_SECRET`

---

## 5) Where DB Logic Lives

- `src/lib/db.ts` — pool setup + base query helpers
- `src/lib/audit.ts` — audit logging helpers
- `src/app/api/**/route.ts` — API handlers issuing SQL queries
- `sql/` — schema evolution scripts

---

## 6) Operational Safety Rules

1. **Never commit secrets** (`.env.local`, credentials, tokens).
2. **Always schema-qualify** when query intent spans multiple schemas.
3. **Preserve idempotency** in payment/webhook writes.
4. **RBAC before data access** for admin-sensitive operations.
5. **Use transactions** for multi-step writes that must stay consistent.
6. **Avoid destructive SQL** in app code unless explicitly required and reviewed.

---

## 7) Migration & Change Process

Current approach is SQL-script based (folder: `sql/`).

When introducing a DB change:

1. Add a new SQL script in `sql/`
2. Update route/lib queries impacted by the change
3. Validate indexes and query performance
4. Test locally against realistic data
5. Update docs (`KNOWLEDGE_TRANSFER.md` + this file)

---

## 8) Useful SQL Snippets (Safe)

### Table row estimates by schema
```sql
SELECT schemaname, relname AS table_name, n_live_tup AS approx_rows
FROM pg_stat_user_tables
WHERE schemaname IN ('zecurx_admin', 'seminar', 'public')
ORDER BY schemaname, n_live_tup DESC;
```

### Recent transactions (example)
```sql
SET search_path TO zecurx_admin, seminar, public;

SELECT t.id, t.amount, t.status, t.created_at, c.email
FROM transactions t
LEFT JOIN customers c ON c.id = t.customer_id
ORDER BY t.created_at DESC
LIMIT 20;
```

### Recent audit activity
```sql
SET search_path TO zecurx_admin, seminar, public;

SELECT action, resource, admin_email, created_at
FROM audit_logs
ORDER BY created_at DESC
LIMIT 20;
```

### Index overview
```sql
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname IN ('zecurx_admin', 'seminar', 'public')
ORDER BY schemaname, tablename;
```

---

## 9) Troubleshooting

### "relation does not exist"
- Check schema qualification (`schema.table`)
- Confirm `search_path` assumptions
- Verify migration was applied

### Slow API query
- Run `EXPLAIN (ANALYZE, BUFFERS)`
- Check missing/unused indexes
- Review large scans and sort/hash operations

### Intermittent DB errors
- Verify `DATABASE_URL`
- Check pool exhaustion / long-running queries
- Confirm `statement_timeout` is appropriate

---

## 10) Human Handoff Checklist

Before handing over DB-related work:

- [ ] SQL script added (if schema changed)
- [ ] API and lib queries updated
- [ ] Lint/test/build pass
- [ ] Risky writes reviewed
- [ ] Documentation updated
