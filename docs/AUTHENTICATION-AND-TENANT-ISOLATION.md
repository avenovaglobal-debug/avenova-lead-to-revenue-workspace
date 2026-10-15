# Authentication and tenant-isolation implementation plan

**Status: planned; not implemented. Do not use with customer data.**

## Provider decision

Use Better Auth as the initial open-source authentication candidate, with the existing PostgreSQL database and Prisma adapter. This is a proposed engineering choice, not a claim that the provider is configured or production-ready. Reconfirm compatibility against the installed package versions before implementation.

Official references:
- Better Auth Prisma adapter: https://better-auth.com/docs/adapters/prisma
- Prisma guide for Better Auth and Next.js: https://www.prisma.io/docs/guides/authentication/better-auth/nextjs

No paid service or subscription is authorised by this decision.

## Integration constraints

1. Preserve the existing `User`, `Organisation`, `Membership`, `Lead`, `PipelineStage`, `Activity`, and `AuditEvent` domain model semantics.
2. Integrate authentication fields deliberately. Do not blindly overwrite the current Prisma schema with generated provider schema.
3. Keep authentication session lookup server-only. Never accept a browser-supplied user ID as proof of identity.
4. Never expose lead or organisation data to anonymous users.
5. Enforce membership on every organisation-scoped read and write. A client-supplied organisation ID is only a selector; it is not authorisation.
6. Preserve database-level composite tenant constraints on lead-to-stage and activity-to-lead references.
7. Keep authentication secrets in environment variables. Do not commit real secrets.
8. Do not enable social sign-in until callback URLs, provider credentials, and failure cases are configured and reviewed.

## Required implementation sequence

- [ ] Add and pin the compatible authentication dependency.
- [ ] Add the auth configuration and Next.js route handler.
- [ ] Integrate required auth tables and user-field mappings into the existing Prisma schema without losing domain relations.
- [ ] Generate and review a migration; do not apply it to a production database without explicit review.
- [ ] Implement server-verified session retrieval in `src/lib/auth/authorization.ts`.
- [ ] Add sign-up/sign-in/sign-out and account recovery flows with appropriate validation and generic error handling.
- [ ] Add organisation creation and owner membership creation in one transaction, with a safe onboarding boundary.
- [ ] Require verified organisation context and role checks for all protected server actions and route handlers.
- [ ] Add tests for anonymous requests, invalid sessions, missing membership, wrong-organisation reads and writes, role boundaries, and valid member access.
- [ ] Add end-to-end tests for sign-in, sign-out, session expiry, and the protected application route.
- [ ] Re-run CI, review migration SQL, and document remaining operational risks before considering a deployment.

## Release gate

Authentication is not complete merely because a sign-in page renders or CI passes. Release requires working server-side session verification, reviewed migrations, tenant-isolation negative tests, and end-to-end verification. Until those exist, keep the product an engineering preview and do not store real customer data.
