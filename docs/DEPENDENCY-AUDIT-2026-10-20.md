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
