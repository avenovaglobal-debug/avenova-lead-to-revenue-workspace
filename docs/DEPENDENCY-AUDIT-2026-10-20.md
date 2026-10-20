# Dependency audit — 2026-10-20

## Scope and evidence

Reviewed the `npm audit --json` artifact from GitHub Actions CI run #34 for commit `ee49ba2da25b0a2f13b4e015cf79cb25c3f43563` on branch `feat/initial-saas-scaffold`.

The report listed **5 advisories: 4 high and 1 moderate**, across three direct/transitive dependency paths. This is a snapshot from that run, not a guarantee of the current registry state.

## Findings

| Package/path | Reported severity | Summary | Reported remediation |
| --- | --- | --- | --- |
| `deepmerge-ts` → `@prisma/config` → `prisma` | High | Recursive object-graph merge can cause stack exhaustion (GHSA-ggr8-5vv4-36mx) | npm suggested Prisma 7.10.1; major-version upgrade |
| `postcss` → `next` | High / Moderate advisories | XSS and source-map path traversal / file-disclosure advisories affecting reported PostCSS versions | npm suggested Next.js 16.4.2; major-version upgrade |
| `prisma` | High | Inherited from the vulnerable Prisma config dependency | npm suggested Prisma 7.10.1; major-version upgrade |

The report metadata counted one moderate and four high vulnerability records, with no critical records. Advisory severity and practical exploitability depend on the affected code paths and deployment context; do not dismiss these findings solely because this is an early scaffold.

## Required remediation plan

1. Keep registration and production launch disabled until the dependency review is complete.
2. Review the current advisories and compatibility notes against the installed Next.js, Prisma, React, and Better Auth versions.
3. Upgrade in a dedicated branch. Do not apply `npm audit fix --force` blindly: the report's suggested fixes cross major versions and may require code or configuration changes.
4. Commit a generated `package-lock.json` and change CI to use `npm ci` so dependency resolution is repeatable. The current workflow generates the lockfile during CI and uploads it as an artifact; that does not pin dependencies in the repository.
5. Re-run the audit, migration checks, tenant-isolation checks, type-check, unit tests, and production build after upgrading.
6. Record remaining advisories and their approved disposition before any production release.

## Release status

**Release gate: blocked pending review and remediation.** This document records the observed audit output; it does not mean vulnerabilities have been fixed. No production database, billing, customer data, or deployment was configured at the time of this audit.
## Follow-up CI result — run #36

On commit `ec051c3bd3072ef19d8a7116815ce055f329ddce`, the quality job passed, including Prisma client generation, ephemeral PostgreSQL migration deployment, tenant-consistency constraint checks, cross-organisation reference rejection, TypeScript type-checking, Vitest tests, and the production build. The separate `npm audit --audit-level=high` security job failed, confirming that high-severity advisories remain in the dependency tree at that commit. This is an enforced release gate, not evidence of remediation.

The pull request remains a draft and has not been merged or deployed. Next implementation work should focus on compatibility-tested dependency updates and a committed lockfile before changing CI to `npm ci`. Do not claim the dependency risk is resolved until a fresh audit and the full quality job pass on the updated dependency set.
## Verified follow-up CI result — runs #38 and #39

Commit `838f79302c356461774cce41cd61164cf5f961eb` added an npm override requesting PostCSS `^8.5.23`. CI run #38 completed the quality job successfully, including database migration checks, tenant constraints, type-checking, tests, and production build. The dependency security gate still failed. Its captured audit report lists **3 high-severity vulnerability records and 0 moderate/critical records**, all associated with the Prisma 6 / `@prisma/config` / `deepmerge-ts` dependency path. PostCSS no longer appears in that captured report, so the override appears to have cleared the previously reported PostCSS findings for that resolution; it does not resolve the remaining Prisma advisories.

CI run #39 also completed its quality job successfully, but its dependency security gate failed. The current security blocker is the Prisma / `@prisma/config` / `deepmerge-ts` path.

The audit report suggests Prisma `7.10.1`, a major-version upgrade from Prisma 6. Treat this as a compatibility migration, not a blind version bump: inspect the Prisma 7 migration guide and adapter compatibility, check schema/config changes, regenerate the client, and rerun migration, tenant-isolation, type-check, test, and production-build checks before accepting it.

The repository still has no committed `package-lock.json`; the generated lockfile artifact is not a substitute for a versioned lockfile. Add and validate a committed lockfile before switching CI from `npm install` to reproducible `npm ci`.

**Release status remains blocked.** The workspace has not been merged or deployed, and the remaining high-severity findings must be remediated and verified before production use.
