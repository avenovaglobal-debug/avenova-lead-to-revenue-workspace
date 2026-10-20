"use client";

import { useState, type FormEvent } from "react";

type Lead = {
  id: string; name: string; company: string | null; email: string | null; status: string;
  currency: string; estimatedValue: string | null; nextFollowUpAt: string | null; updatedAt: string;
};

export function LeadsWorkspace({ organisationId, initialLeads }: { organisationId: string; initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    setError("");
    const form = new FormData(formElement);
    const rawValue = String(form.get("estimatedValue") ?? "").trim();
    const rawDate = String(form.get("nextFollowUpAt") ?? "").trim();
    const lead = {
      name: String(form.get("name") ?? "").trim(),
      company: String(form.get("company") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      source: String(form.get("source") ?? "").trim(),
      estimatedValue: rawValue ? Number(rawValue) : undefined,
      currency: String(form.get("currency") ?? "NGN"),
      nextFollowUpAt: rawDate ? new Date(rawDate).toISOString() : undefined,
    };

    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ organisationId, lead }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save lead.");
      const created = result.lead as Lead;
      setLeads((current) => [created, ...current].slice(0, 100));
      formElement.reset();
      setShowForm(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save lead.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = leads.filter((lead) => [lead.name, lead.company ?? "", lead.email ?? ""].join(" ").toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="workspace-leads" aria-labelledby="leads-title">
      <div className="workspace-list-heading">
        <div><p className="workspace-eyebrow">PIPELINE</p><h2 id="leads-title">Leads and enquiries</h2></div>
        <button className="workspace-button" onClick={() => setShowForm((value) => !value)} type="button">{showForm ? "Cancel" : "＋ Add lead"}</button>
      </div>
      {showForm && <form className="workspace-form" onSubmit={submitLead}>
        <label>Lead name *<input name="name" required maxLength={160} /></label>
        <label>Company<input name="company" maxLength={160} /></label>
        <label>Email<input name="email" type="email" maxLength={254} /></label>
        <label>Source<input name="source" maxLength={100} placeholder="e.g. Website enquiry" /></label>
        <label>Estimated value<input name="estimatedValue" type="number" min="0" step="0.01" /></label>
        <label>Currency<select name="currency" defaultValue="NGN"><option value="NGN">NGN — Naira</option><option value="USD">USD — US dollar</option><option value="GBP">GBP — Pound sterling</option><option value="EUR">EUR — Euro</option></select></label>
        <label>Next follow-up<input name="nextFollowUpAt" type="datetime-local" /></label>
        <div className="workspace-form-actions"><button className="workspace-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save lead"}</button></div>
      </form>}
      {error && <p className="workspace-error" role="alert">{error}</p>}
      <div className="workspace-search"><label htmlFor="lead-search">Search leads</label><input id="lead-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, company, or email" /></div>
      {filtered.length === 0 ? <div className="workspace-empty"><span className="workspace-empty-mark">＋</span><h3>{leads.length === 0 ? "No leads yet" : "No matching leads"}</h3><p>{leads.length === 0 ? "Create a lead to test the workflow. Do not use real customer data in this preview." : "Try a different search term."}</p></div> : <div className="workspace-table-wrap"><table className="workspace-table"><thead><tr><th>Lead</th><th>Status</th><th>Est. value</th><th>Next follow-up</th></tr></thead><tbody>{filtered.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong><small>{lead.company || lead.email || "No company or email"}</small></td><td><span className={"workspace-status status-" + lead.status.toLowerCase()}>{lead.status.toLowerCase()}</span></td><td>{lead.estimatedValue ? new Intl.NumberFormat("en-NG", { style: "currency", currency: lead.currency, maximumFractionDigits: 0 }).format(Number(lead.estimatedValue)) : "—"}</td><td>{lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleString() : "Not scheduled"}</td></tr>)}</tbody></table></div>}
      <p className="workspace-count">Showing {filtered.length} of {leads.length} loaded leads.</p>
    </section>
  );
}
