# ZecurX Web — Knowledge Transfer (Human Onboarding Guide)

> Audience: Engineers, maintainers, and operators joining this project.
> 
> Goal: Give you enough context to run, maintain, debug, and safely extend this codebase without tribal knowledge.

## Documentation map (read in this order)

1. `README.md` — quick setup and contribution checklist
2. `KNOWLEDGE_TRANSFER.md` (this file) — full project onboarding
3. `docs/DATABASE_README.md` — database operations and safe SQL guidance
4. `docs/RBAC_QUICK_REFERENCE.md` + `docs/MEDIA_ROLE_QUICKSTART.md` — role/access behavior
5. `docs/SECURITY_FIX_VERIFICATION.md` — historical security fixes and verification notes

---

## 1) What this project is

`zecurx-web` is a **Next.js App Router** application that combines:

- a public marketing website (services, tools, resources, academy)
- an e-commerce flow (plans/products, cart, checkout, Razorpay)
- seminar flows (booking, registration, certificates)
- a protected admin portal (`/admin`) with role-based access control

The project is built for **human operators + business workflows**, not just static content.

---

## 2) High-level architecture

### Frontend/UI
- Next.js 15 App Router (`src/app`)
- React 19
- Tailwind CSS v4 + shadcn/ui (New York style)
- Framer Motion / Motion + Lenis for animation/smooth UX

### Backend/API (inside same Next.js app)
- Route Handlers under `src/app/api/**/route.ts`
- Raw SQL via `pg` (no heavy ORM)
- Shared backend utilities in `src/lib`

### Data + External Systems
- PostgreSQL (multi-schema usage)
- Razorpay (orders, verification, webhook)
- SendGrid (email delivery)
- Google Sheets (select workflow syncs)
- Upstash Redis (rate limiting)
- S3-compatible object storage (Hetzner/Linode setup patterns)
- LMS integration (`lms.zecurx.com`) through shared Postgres data

---

## 3) Repository map (where to look first)

- `src/app/` — App Router pages/layout/routes
- `src/app/api/` — HTTP API route handlers
- `src/components/` — UI components (including admin, forms, landing)
- `src/lib/` — core business logic/utilities (db/auth/payments/email/rbac)
- `src/types/` — TypeScript domain types (`auth.ts` is key)
- `sql/` — migration-like SQL files and schema updates
- `docs/` — operational/security/RBAC docs
- `middleware.ts` — admin auth + route permission gate

---

## 4) Core libraries and why they matter

### Core framework
- `next`, `react`, `react-dom`

### UI / frontend
- `tailwindcss` + `tailwindcss-animate`
- `@radix-ui/*` primitives
- `class-variance-authority`, `clsx`, `tailwind-merge`
- `lucide-react`
- `framer-motion`, `motion`, `lenis`, `lottie-react`
- `next-themes`, `nextjs-toploader`

### Forms / validation / safety
- `react-hook-form`, `@hookform/resolvers`
- `zod`
- `sanitize-html`, `validator`

### Auth / security
- `jose` (JWT create/verify)
- `argon2` + `bcryptjs` (password/hash compatibility)

### Database / infra
- `pg`
- `@upstash/redis`, `@upstash/ratelimit`
- `pino`, `pino-pretty`

### Storage / assets
- `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- `sharp`

### Payments / messaging / documents
- `razorpay`
- `@sendgrid/mail`
- `pdf-lib`, `exceljs`
- `@googleapis/sheets`

### Testing / quality
- `eslint`, `eslint-config-next`
- `typescript`
- `vitest`

---

## 5) Database and schemas

## Primary database
- PostgreSQL via `src/lib/db.ts`
- Connection from `DATABASE_URL`
- Pooling enabled (`max: 20`)

## Important DB runtime behavior
On connection, the app sets:
- `search_path TO zecurx_admin, seminar, public`
- `statement_timeout = 10000` (10s)

This means unqualified table names usually resolve to `zecurx_admin` first.

## Key schema purpose
- `zecurx_admin`: website/admin/business tables
- `seminar`: seminar registrations, attendance, feedback, certificates
- `public`: LMS/shared user/course/enrollment data

## Key table families (business view)
- Admin + RBAC: `admins`, `admin_sessions`, `admin_invitations`
- Content: `blog_posts`, `blog_labels`, `whitepapers`, `case_studies`
- Commerce: `products`, `plans`, `orders`, `order_items`, `transactions`, `customers`
- Inventory/shop: `shop_orders`, `shop_order_items`, `shop_inventory`
- Leads/CRM: `student_leads*`, `enterprise_leads*`
- Referrals: `referral_codes*`, `partner_referrals*`, `partner_payouts`
- Ops/Audit: `audit_logs` (and compatibility with `audit_log`)
- Seminar system: `seminar.*`
- LMS links: `public.users`, `public.enrollments`, `public.internships`, `public.password_reset_tokens`

---

## 6) Authentication, sessions, and RBAC

## Session model
- Admin auth is cookie-based (`admin_session`)
- JWT handled with `jose` in `src/lib/auth.ts`
- Cookie settings: HTTP-only, strict same-site, 24h max age

## Middleware enforcement
`middleware.ts` protects `/admin/:path*`:
- redirects unauthenticated users to `/admin/login`
- checks route-level permissions for admin sub-pages
- attaches user context headers (`x-user-id`, `x-user-role`, etc.)

## Roles
Defined in `src/types/auth.ts`:
- `super_admin`, `admin`, `sales`, `marketing`, `media`

Role permission map and hierarchy are in `src/lib/permissions.ts`.

---

## 7) API surface (major functional groups)

There are many route handlers; the most important groups:

- Admin auth/users/settings: `/api/admin/auth`, `/api/admin/users`, `/api/admin/settings`
- Admin content management: blog/whitepapers/case-studies endpoints
- Admin seminars/registrations/notifications endpoints
- Public content: `/api/blog`, `/api/whitepapers`, `/api/case-studies`, `/api/products`
- Payments: `/api/razorpay/create-order`, `/api/razorpay/verify-payment`, `/api/razorpay/webhook`
- Leads + communications: `/api/send-email`, `/api/leads/*`
- Health/ops: `/api/health`

---

## 8) Important business flows

## Purchase flow (Razorpay)
1. Client creates order (`/api/razorpay/create-order`)
2. Payment success triggers webhook (`/api/razorpay/webhook`)
3. Webhook verifies signature (HMAC)
4. Customer + transaction persisted
5. Invoice PDF generated
6. Email(s) sent (customer/admin)
7. Optional referral/promo usage updates
8. LMS enrollment / reset-link setup when applicable

## Lead capture flow
- Form submission via `/api/send-email`
- rate limit check
- classify into student vs enterprise lead
- persist to DB
- send admin/user notifications
- optional Google Sheets sync for selected purchase/internship cases

## Seminar flow
- seminar listing, booking, registration, OTP/certificate-related endpoints
- admin approval/notification route handlers in `/api/admin/seminars/*`

---

## 9) Environment variables (what each is for)

Use `.env.example` as template. Do not commit real values.

## Required in most environments
- `DATABASE_URL` — Postgres connection
- `JWT_SECRET` — admin JWT signing/verification secret
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL` — canonical/public app URLs

## Payments
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

## Email
- `SENDGRID_API_KEY` (actively used)
- `RESEND_API_KEY` (legacy/optional integration path)
- SMTP vars may exist for compatibility workflows

## Storage/CDN
- `HETZNER_S3_ENDPOINT`, `HETZNER_S3_BUCKET`, `HETZNER_S3_ACCESS_KEY`, `HETZNER_S3_SECRET_KEY`
- (optional alternate) `LINODE_S3_*`
- `NEXT_PUBLIC_CDN_URL`

## Anti-abuse / rate limiting
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Google Sheets integration
- `GOOGLE_SHEET_ID` or `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_CLIENT_EMAIL`
- `GOOGLE_SHEETS_PRIVATE_KEY`

## Optional external services
- `ZECURX_API_URL`, `ZECURX_API_KEY`

---

## 10) Local development setup

## Prerequisites
- Node.js 18+
- `pnpm` recommended
- PostgreSQL access

## Steps
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create env file:
   - copy `.env.example` → `.env.local`
   - fill required secrets/URLs
3. Run dev server:
   ```bash
   pnpm dev
   ```
4. Verify quality gates:
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

---

## 11) Design system and frontend conventions

From project conventions (`AGENTS.md` + component guides):

- Tailwind + semantic theme variables (avoid hardcoded color utilities when semantic token exists)
- shadcn/ui base components live in `src/components/ui/` (prefer composition over editing primitives)
- Icon library: Lucide
- App Router only (no `/pages`)
- Public pages follow landing shell pattern (navbar + content wrapper + footer)

Notable style helpers:
- `.glass-card` in `src/app/globals.css`
- animation utilities and custom keyframes are centrally defined in globals

---

## 12) Things to be careful about (critical)

1. **Secrets hygiene**
   - Never commit `.env.local` or secrets.
   - Treat any accidentally committed credentials as compromised; rotate immediately.

2. **RBAC first, data second**
   - For admin pages/routes, check permission **before** any sensitive queries.
   - Follow existing `requirePermission` / page-auth patterns.

3. **Webhook security**
   - Never bypass Razorpay signature verification.
   - Keep raw request body for signature checking.

4. **Production rate limiting**
   - Upstash env vars are mandatory in production (`/api/health` enforces this expectation).

5. **Schema/search_path assumptions**
   - Unqualified table names depend on `search_path`; be explicit for cross-schema queries.

6. **Hash compatibility**
   - Admin auth supports both `argon2` and `bcrypt` hashes. Don’t remove compatibility without migration.

7. **Admin route sprawl**
   - Many admin endpoints exist; keep authorization checks consistent per route.

8. **Email side effects**
   - Several flows send multiple emails and attachments; test end-to-end after changes.

9. **LMS coupling**
   - Payment/webhook logic may enroll users into LMS and generate password reset tokens.

10. **Build/lint/test before handoff**
   - Always run at least lint + build for confidence.

---

## 13) Observability, health, and debugging

- Health endpoint: `GET /api/health`
  - checks DB connectivity
  - checks whether rate limiting integration is active
- Logging utilities exist in `src/lib/logger.ts` and selected route handlers
- Common failure domains:
  - DB connectivity / search_path mismatch
  - missing env vars
  - webhook secret mismatch
  - email provider quota/credential failures

---

## 14) SQL and migration handling

- SQL change scripts are in `/sql`
- Current model is **script-based migrations** (not an auto-managed migration framework)
- When changing data model:
  1. add SQL script in `sql/`
  2. update any dependent query logic in `src/lib` / `src/app/api`
  3. update this KT doc + relevant docs in `/docs`

---

## 15) Operational checklist for new maintainers

During your first week, verify:

1. You can run `pnpm dev`, `pnpm lint`, `pnpm test`, `pnpm build`
2. You can log into `/admin` with a non-production test account
3. `/api/health` returns healthy/degraded as expected locally
4. You understand where RBAC is enforced (`middleware.ts`, `auth.ts`, `permissions.ts`)
5. You can trace purchase flow from order creation to webhook persistence
6. You can identify where to add a new API route + permission

---

## 16) Recommended documentation to read next

- `README.md` (quick start)
- `docs/DATABASE_README.md` (DB-focused operational handbook)
- `docs/SECURITY_FIX_VERIFICATION.md` (authz pitfall history)
- `docs/RBAC_QUICK_REFERENCE.md`
- `docs/MEDIA_ROLE_QUICKSTART.md`

---

## 17) Ownership note

This codebase mixes product, operations, and business-critical flows. Treat changes as production-sensitive, especially around:

- auth/RBAC
- payments/webhooks
- lead and customer data
- email automation

When in doubt: ship smaller changes, verify thoroughly, and document behavior changes here.
