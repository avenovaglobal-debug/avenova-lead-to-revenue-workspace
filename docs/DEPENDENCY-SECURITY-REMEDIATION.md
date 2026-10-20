# Dependency Security Remediation

Status: active remediation; release remains blocked pending current CI results and deployment setup.

## Findings and changes

- The previous audit artifact reported high-severity advisories involving `postcss` and `deepmerge-ts`, plus a moderate Next.js-related finding. That artifact's generated lockfile did not match the current scaffold manifest, so it is not a reliable basis for declaring the current branch safe.
- The remediation branch upgrades Next.js from `^15.5.28` to `^16.4.2`, the patched version identified by that earlier audit report. This is a major-version upgrade and must pass the full CI suite before merge.
- Prisma is pinned at `7.10.1` on the scaffold branch. The earlier report identifies `7.10.1` as the patched release for the reported Prisma advisory, but the current dependency tree must still be audited.

## Required verification

- [ ] Obtain a current audit report generated from the exact commit under review.
- [ ] Commit a lockfile generated from the current `package.json`; verify it matches the manifest.
- [ ] Confirm reproducible installation with `npm ci` after the lockfile is committed.
- [ ] Inspect all direct and transitive advisories, patched versions, and dependency paths.
- [ ] Run `npm run db:generate`, `npm run typecheck`, `npm test`, migration/tenant-isolation checks, and `npm run build`.
- [ ] Run `npm audit --audit-level=high` against the same committed dependency tree.
- [ ] Update CI to consume the committed lockfile with `npm ci`, not silently regenerate a transient lockfile each run.
- [ ] Confirm the production deployment target and required environment variables before release.

## Release rule

Do not release this scaffold as a production customer-data service while dependency security or authentication/tenant-isolation gates are failing. Do not enable public registration until email verification, account recovery, and authentication end-to-end tests are complete. Never suppress findings merely to make CI green.

## Current limitations

A previous CI run reported quality checks passing but the dependency security gate failing. A Next.js upgrade has now been proposed on this branch; it is not considered complete until current CI and audit results confirm it. The project is not yet confirmed as deployed, and the connected Vercel account currently exposes no teams or projects to this workspace.
