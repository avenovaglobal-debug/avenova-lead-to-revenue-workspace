# Dependency Security Remediation

Status: open release blocker. This checklist does not certify the current dependency tree as safe.

## Required inputs

- [ ] Generate and commit `package-lock.json` using the project's supported Node/npm toolchain.
- [ ] Preserve the audit JSON from the latest CI run and identify each direct/transitive advisory, affected package, dependency path, severity, and patched version.
- [ ] Confirm the lockfile is reproducible with `npm ci`.

## Remediation procedure

1. Start from the committed lockfile and run `npm audit --json`; retain the report as a CI artifact.
2. For each high/critical advisory, inspect the advisory range and patched release. Trace whether it is direct or transitive.
3. Prefer the smallest compatible upgrade. Review changelogs and breaking changes before any major-version upgrade.
4. Regenerate the lockfile with the selected package changes; inspect the diff for unrelated dependency churn.
5. Run `npm ci`, `npm run db:generate`, `npm run typecheck`, `npm test`, migration/tenant-isolation checks, and `npm run build`.
6. Run the audit again. The security gate may pass only when no high/critical advisory remains, or when a documented, reviewed exception is explicitly approved. Do not suppress findings merely to make CI green.
7. Ensure CI uses the committed lockfile and `npm ci`; remove CI steps that create a transient lockfile as an artifact in place of a committed one.

## Release rule

Do not merge or deploy this scaffold with customer data while the high-severity dependency gate is failing. Do not enable public registration until email verification, account recovery, and authentication end-to-end tests are complete.

## Current limitations

The latest recorded CI summary reports quality checks passing but the dependency audit failing. The exact advisory list and a committed lockfile still need to be retrieved/generated before selecting package versions. No package upgrade is declared complete by this document.
