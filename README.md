# ZecurX Web

Official web application for ZecurX (marketing site, academy flows, shop/checkout, and admin portal).

## At a Glance

- **Runtime:** Next.js App Router
- **Primary domain areas:** Website, commerce, seminars, admin operations
- **Data layer:** PostgreSQL (multi-schema)
- **Critical integrations:** Razorpay, SendGrid, Upstash Redis, S3-compatible storage

## Start Here (Human Onboarding)

- **Primary guide:** [KNOWLEDGE_TRANSFER.md](./KNOWLEDGE_TRANSFER.md)
- **Database handbook:** [docs/DATABASE_README.md](./docs/DATABASE_README.md)

If you are new to this project, read the KT guide first. It explains architecture, libraries, database schemas, integrations, RBAC/security, operations, and key pitfalls.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict)
- **Styling/UI:** Tailwind CSS v4 + shadcn/ui + Radix primitives
- **Database:** PostgreSQL (`pg` driver, multi-schema setup)
- **Auth/Security:** JWT (`jose`), Argon2/Bcrypt compatibility, middleware-based admin protection
- **Payments:** Razorpay
- **Email:** SendGrid
- **Rate limiting:** Upstash Redis

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- PostgreSQL access

### Install

```bash
pnpm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Fill required values in `.env.local` (never commit secrets).

### Run locally

```bash
pnpm dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Run production server
- `pnpm lint` — Run ESLint
- `pnpm test` — Run Vitest tests
- `pnpm test:watch` — Run tests in watch mode

## Project Structure

- `src/app/` — Next.js routes, layouts, pages, API route handlers
- `src/components/` — reusable UI and feature components
- `src/lib/` — shared business logic/utilities (db, auth, integrations)
- `src/types/` — shared TypeScript domain types
- `sql/` — SQL migration/update scripts
- `docs/` — operational and reference documentation
- `middleware.ts` — admin route protection and permission checks

## Documentation

- [KNOWLEDGE_TRANSFER.md](./KNOWLEDGE_TRANSFER.md) — complete human onboarding
- [docs/RBAC_QUICK_REFERENCE.md](./docs/RBAC_QUICK_REFERENCE.md)
- [docs/MEDIA_ROLE_QUICKSTART.md](./docs/MEDIA_ROLE_QUICKSTART.md)
- [docs/SECURITY_FIX_VERIFICATION.md](./docs/SECURITY_FIX_VERIFICATION.md)
- [docs/DATABASE_README.md](./docs/DATABASE_README.md)

## Health Check

- API health endpoint: `GET /api/health`
- Useful after environment setup or deployment changes.

## Contribution Checklist

Before opening a PR:

```bash
pnpm lint
pnpm test
pnpm build
```

Also ensure:
- no secrets are committed (`.env.local`, API keys, tokens)
- RBAC checks are applied for admin-sensitive routes/pages
- payment/webhook flows remain signature-verified and idempotent

## Security Note

This repository contains company-owned production code and business workflows. Treat all customer/admin/payment-related changes as production-sensitive.

## Maintainer Tip

If you are doing anything involving auth, payments, or DB schema changes, update the related docs in the same PR so handover remains easy.
