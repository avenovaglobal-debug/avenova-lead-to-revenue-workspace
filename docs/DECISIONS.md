# Architecture decisions

## Separate product application

The SaaS workspace is a separate application and repository from the Avenova marketing site.

## Narrow product hypothesis

Begin with lead/enquiry capture, pipeline stages, follow-up scheduling, activity history, and simple reporting for service businesses. This is a hypothesis; validate the problem and willingness to pay through customer discovery before expanding scope.

## Proposed stack

Next.js App Router, TypeScript, PostgreSQL, Prisma, Zod, Vitest, and Playwright. Reassess based on requirements rather than treating the proposal as irreversible.

## Authentication

Provider not selected. No public lead API is implemented until real server-side authentication and organisation authorisation are available.

## Tenant isolation

Every organisation-owned record must be queried and mutated through a verified organisation context. Cross-tenant negative tests are a release blocker.

## Spending

No paid provider has been selected or authorised. Obtain explicit approval before any paid plan, subscription, or upgrade.
