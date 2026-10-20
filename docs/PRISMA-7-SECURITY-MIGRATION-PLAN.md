# Prisma 7 security-remediation migration plan

Status: proposed; not yet implemented or validated.

## Why this work is needed

The dependency audit on CI runs #38 and #39 reports three high-severity vulnerability records in the Prisma 6 dependency path: `prisma`, `@prisma/config`, and `deepmerge-ts`. npm's suggested remediation is Prisma 7.10.1, a major-version upgrade. The PostCSS override cleared PostCSS from the captured audit report, and the quality job passes, but the security gate remains blocked.

## Official migration references

- Prisma ORM 7 upgrade guide: https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
- Prisma config reference: https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference
- Better Auth Prisma adapter guide: https://better-auth.com/docs/adapters/prisma

Prisma 7 changes include ESM package support, a required explicit Prisma Client output path, moving datasource connection configuration to `prisma.config.ts`, and requiring a database driver adapter for Prisma Client. Prisma's guide lists Node.js 20.19.0 as the minimum Node 20 version. The CI workflow uses Node 20; confirm the resolved runtime is at least that version.

## Controlled implementation sequence

1. Make this migration on the existing feature branch while keeping the pull request in draft.
2. Update `prisma` and `@prisma/client` together to the same tested Prisma 7 patch version. Do not use `npm audit fix --force` as a substitute for the migration.
3. Add the PostgreSQL driver adapter package and `pg` dependencies required by the selected Prisma 7 setup.
4. Add `prisma.config.ts` with the schema/migrations paths and datasource URL sourced from `DATABASE_URL`; ensure CI has that variable available for migration commands.
5. Update the Prisma generator to the supported Prisma 7 client provider with an explicit output path, and update every Prisma Client import to use that generated output.
6. Update the shared database client to instantiate Prisma Client with the PostgreSQL driver adapter. Preserve the existing singleton pattern where appropriate for Next.js development.
7. Verify the Better Auth Prisma adapter accepts the generated Prisma Client and provider configuration; keep password sign-up disabled.
8. Regenerate and inspect migrations; do not rewrite or apply a destructive migration to any production database.
9. Add and commit a generated `package-lock.json`. Then change CI installation steps to `npm ci`, retaining an audit artifact and the enforced high-severity threshold.
10. Run the complete quality pipeline: client generation, migration deployment to ephemeral PostgreSQL, tenant-consistency constraints, cross-organisation reference rejection, type-check, unit tests, and production build.
11. Accept the remediation only when a fresh `npm audit --audit-level=high` passes and all quality checks pass. Record any remaining advisories explicitly.

## Safety and release criteria

- No production database is connected in this remediation task.
- Do not enable authentication sign-up or deploy the app as part of the dependency upgrade.
- Do not merge the pull request while the security gate is failing.
- If Prisma 7 causes incompatible behavior, stop and document the blocker rather than weakening the audit threshold or suppressing the advisory.
