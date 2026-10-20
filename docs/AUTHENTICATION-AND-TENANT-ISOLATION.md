# Authentication and tenant-isolation implementation

**Status: foundation integrated; not production-ready. Do not use with customer data.**

## Provider and current implementation

Better Auth is the selected open-source authentication foundation, using PostgreSQL through the Prisma adapter. The repository remains on Prisma 6; Better Auth's adapter documentation states that Prisma 6 or earlier can retain the existing Prisma Client setup. The provider's required models have been added alongside the existing domain models rather than replacing them.

Implemented on the feature branch:
- Better Auth configuration in `src/lib/auth.ts`.
- Next.js handler at `src/app/api/auth/[...all]/route.ts`.
- Server-verified session lookup in `src/lib/auth/authorization.ts`.
- Prisma models for sessions, accounts, and verification records, plus authentication fields on the existing User model.
- Email/password sign-up remains disabled. No social providers are enabled.
- CI uses a clearly non-production-only secret and local URL values.

This is an integration foundation, not a completed authentication release. The schema has not yet been migrated against a real database, no migration SQL has been reviewed, and end-to-end sign-in/sign-out/session tests have not yet been completed. No production secret or database has been configured.

Official references:
- Better Auth Prisma adapter: https://better-auth.com/docs/adapters/prisma
- Better Auth Next.js integration: https://better-auth.com/docs/integrations/next
- Prisma guide for Better Auth and Next.js: https://www.prisma.io/docs/guides/authentication/better-auth/nextjs

No paid service or subscription is authorised by this decision.

## Integration constraints

1. Preserve the existing `User`, `Organisation`, `Membership`, `Lead`, `PipelineStage`, `Activity`, and `AuditEvent` domain model semantics.
2. Keep authentication session lookup server-only. Never accept a browser-supplied user ID as proof of identity.
3. Never expose lead or organisation data to anonymous users.
4. Enforce membership on every organisation-scoped read and write. An organisation ID supplied by the browser is only a selector, not authorisation.
5. Preserve database-level composite tenant constraints on lead-to-stage and activity-to-lead references.
6. Keep production authentication secrets in environment variables. Never commit real secrets.
7. Do not enable social sign-in until callback URLs, provider credentials, and failure cases are configured and reviewed.
8. Do not enable public email/password registration until email verification and password-reset delivery are configured and tested.

## Remaining implementation sequence

- [ ] Generate and review a migration for the new authentication tables and user fields. Do not apply it to a production database without explicit review.
- [ ] Configure and test secure email verification and account recovery before enabling registration.
- [ ] Add organisation creation and owner membership creation in one transaction, with a safe onboarding boundary.
- [ ] Require verified organisation context and role checks for all protected server actions and route handlers.
- [ ] Add tests for anonymous requests, invalid sessions, missing membership, wrong-organisation reads and writes, role boundaries, and valid member access.
- [ ] Add end-to-end tests for sign-in, sign-out, session expiry, and protected application routes.
- [ ] Generate a reproducible lockfile, re-run CI on the latest feature-branch head, review migration SQL, and document operational risks before deployment.

## Release gate

Authentication is not complete merely because a handler exists or CI passes. Release requires working server-side session verification, reviewed migrations, tenant-isolation negative tests, end-to-end verification, account recovery, secret management, and backup/recovery procedures. Until those exist, keep the product an engineering preview and do not store real customer data.
