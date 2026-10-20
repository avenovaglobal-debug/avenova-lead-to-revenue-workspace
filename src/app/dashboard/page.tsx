import type { ReactNode } from "react";
import { headers } from "next/headers";
import { LeadsWorkspace } from "./leads-workspace";

export const dynamic = "force-dynamic";

function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="workspace-page">
      <a className="workspace-brand" href="/">Avenova <span>Workspace</span></a>
      <section className="workspace-notice">
        <p className="workspace-eyebrow">LEAD-TO-REVENUE WORKSPACE</p>
        <h1>{title}</h1>
        <p>{children}</p>
        <a className="workspace-back" href="/">Back to workspace overview</a>
      </section>
    </main>
  );
}

export default async function DashboardPage() {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET || !process.env.BETTER_AUTH_URL) {
    return <Notice title="Workspace setup is incomplete">The database and authentication configuration must be verified before this dashboard can show business data. No sample metrics are displayed.</Notice>;
  }

  const [{ auth }, { db }] = await Promise.all([import("@/lib/auth"), import("@/lib/db")]);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return <Notice title="Sign-in is not enabled yet">This workspace is still an engineering preview. Public account creation and sign-in are not enabled, so lead records are not exposed here.</Notice>;
  }

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { organisationId: true, role: true, organisation: { select: { name: true } } },
  });

  if (!membership) {
    return <Notice title="No organisation is connected">This account does not yet belong to a workspace organisation. Organisation onboarding must be completed before leads can be managed.</Notice>;
  }

  const leads = await db.lead.findMany({
    where: { organisationId: membership.organisationId },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: { id: true, name: true, company: true, email: true, status: true, currency: true, estimatedValue: true, nextFollowUpAt: true, updatedAt: true },
  });
  const totalValue = leads.reduce((sum, lead) => sum + (lead.status === "WON" && lead.currency === "NGN" ? Number(lead.estimatedValue ?? 0) : 0), 0);
  const overdue = leads.filter((lead) => lead.nextFollowUpAt && lead.nextFollowUpAt.getTime() < Date.now() && lead.status !== "WON" && lead.status !== "LOST").length;

  return (
    <main className="workspace-page">
      <header className="workspace-topbar">
        <a className="workspace-brand" href="/">Avenova <span>Workspace</span></a>
        <div className="workspace-identity"><span>{membership.organisation.name}</span><span className="workspace-role">{membership.role.toLowerCase()}</span></div>
      </header>
      <section className="workspace-heading">
        <p className="workspace-eyebrow">WORKSPACE OVERVIEW</p>
        <h1>Keep every opportunity moving.</h1>
        <p>Track real enquiries, their current status, and the next follow-up. Only records in your verified organisation are shown.</p>
      </section>
      <section className="workspace-metrics" aria-label="Lead summary">
        <article><span>Leads loaded</span><strong>{leads.length}</strong><small>Latest 100 records only</small></article>
        <article><span>Follow-ups overdue</span><strong>{overdue}</strong><small>Within the latest 100 records</small></article>
        <article><span>Won value</span><strong>{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(totalValue)}</strong><small>Latest 100 records; NGN only</small></article>
      </section>
      <LeadsWorkspace organisationId={membership.organisationId} initialLeads={leads.map((lead) => ({ ...lead, estimatedValue: lead.estimatedValue === null ? null : String(lead.estimatedValue), nextFollowUpAt: lead.nextFollowUpAt?.toISOString() ?? null, updatedAt: lead.updatedAt.toISOString() }))} />
      <footer className="workspace-footer">Avenova Global · Engineering preview · Do not enter real customer data until release gates are complete.</footer>
    </main>
  );
}
