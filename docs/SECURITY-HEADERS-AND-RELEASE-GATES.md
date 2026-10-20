# Application security baseline

**Status: policy documented; runtime headers must be verified in a deployed test environment.**

## Required response headers

The web application should set and verify the following response headers before handling customer data:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY` and/or a Content Security Policy `frame-ancestors 'none'`
- `Permissions-Policy` restricting browser capabilities not required by the product
- `Strict-Transport-Security` only on HTTPS production hosts, with a reviewed max-age
- A Content Security Policy designed around the actual scripts, styles, authentication callbacks, and any future integrations. Do not blindly deploy a restrictive policy that breaks the application or weaken it with broad wildcards.

## Release checks

- [ ] Configure headers in the application framework and inspect actual responses in a deployed test environment.
- [ ] Confirm CSP does not allow framing, unsafe external script origins, or unnecessary inline script execution.
- [ ] Confirm production uses HTTPS and secure cookies.
- [ ] Verify authentication callback URLs and trusted origins are exact and environment-specific.
- [ ] Keep secrets out of source control and logs.
- [ ] Run dependency review against a committed lockfile; resolve critical/high findings deliberately, documenting accepted risks.
- [ ] Apply reviewed Prisma migrations to a disposable PostgreSQL database and verify a clean deploy from scratch.
- [ ] Run tenant isolation tests and end-to-end authentication tests before any customer data is accepted.

## Explicit non-goals

This document does not certify the product as secure, configure production infrastructure, or authorize a deployment. The project remains an engineering preview, with registration disabled and no real customer data permitted.
