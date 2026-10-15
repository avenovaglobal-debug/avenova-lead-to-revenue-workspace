# Security release gates

This application must not be used with real customer data until every applicable gate is complete and reviewed.

- [ ] Integrate real authentication and secure server-side session verification.
- [ ] Require verified organisation membership for every read and mutation.
- [ ] Test cross-tenant access denial for list, detail, create, update, delete, export, and background jobs.
- [ ] Review role-based permissions and account recovery.
- [ ] Create and review versioned database migrations.
- [ ] Validate inputs server-side and enforce safe output handling.
- [ ] Record security-relevant events without secrets or unnecessary personal data.
- [ ] Configure secrets outside source control.
- [ ] Establish backups, restore drills, retention, deletion, and incident-response procedures.
- [ ] Run typecheck, unit/integration tests, production build, and end-to-end tests in CI.
- [ ] Complete privacy notice and applicable legal review before collecting real user data.

The current authentication helper deliberately fails closed. Do not replace it with a browser-supplied user ID or organisation ID.
