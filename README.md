# Avenova Lead-to-Revenue Workspace

**Status: early engineering scaffold — not production-ready.** This project explores a focused lead/enquiry pipeline and follow-up workspace for small service businesses. Market demand is not yet validated.

Avenova Global is an independent initiative and is not yet legally registered. This repository makes no claim of existing customers, validated demand, or production capabilities.

## Direction

- Next.js App Router + TypeScript
- PostgreSQL + Prisma
- Zod validation
- Vitest unit tests and Playwright end-to-end tests
- Better Auth authentication foundation with server-verified sessions; public sign-up remains disabled

## Security release gates

Do not deploy with customer data until all of the following are implemented and tested:

1. Real authentication, secure sessions, and account recovery.
2. Server-side organisation membership and role checks on every protected operation.
3. Tenant isolation tests proving a member of organisation A cannot read or mutate organisation B's records.
4. Reviewed database migrations, backup and recovery procedures, and secret management.
5. Audit events for security-relevant actions and safe, redacted logs.
6. Automated typecheck, unit/integration tests, production build, and end-to-end tests.

Never trust an organisation ID supplied by the browser without verifying membership server-side. Do not create public lead CRUD routes before authentication is implemented.

## Authentication implementation plan

The current Better Auth foundation, schema-preservation constraints, remaining security tests, and release gates are documented in [`docs/AUTHENTICATION-AND-TENANT-ISOLATION.md`](docs/AUTHENTICATION-AND-TENANT-ISOLATION.md). A restricted sign-in screen and readiness endpoint are now present. Password sign-in remains **off by default** and public sign-up is disabled.

To keep sign-in disabled, leave `AVENOVA_ENABLE_PASSWORD_SIGNIN` unset or set it to anything other than `true`. Do not set it to `true` until the founder account and first organisation have been securely provisioned, the trusted production origin has been verified, and account recovery/release gates have been reviewed. This flag does not create an account. Do not enable public sign-up as a workaround.

The deployment still requires a tested founder-account provisioning path, account recovery, tenant-isolation tests, and production configuration before real customer data can be used.

## Cost policy

No paid provider or subscription has been selected or authorised. Recommend options and obtain approval before any paid commitment, upgrade, or subscription.

## Current scope

The first product hypothesis covers lead capture, qualification, pipeline stages, follow-up reminders, interaction history, and simple reporting. Avoid general-purpose CRM bloat until customer discovery provides evidence.

## Local setup

Requires Node.js 20+ and PostgreSQL.

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a local PostgreSQL database.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Review and create migrations before running `npm run db:migrate`.
6. Run `npm run typecheck` and `npm test`.
7. Run `npm run dev` to start the preview.

The engineering preview is not a live customer service. Public registration, account recovery, reviewed migrations, complete CRUD routes, tenant-isolation tests, deployment, billing, integrations, and operational backups remain incomplete.
