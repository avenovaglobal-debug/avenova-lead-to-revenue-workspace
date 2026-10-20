const pillars = [
  { number: "01", title: "Lead clarity", description: "Keep enquiries, source, value, and next action visible in one place." },
  { number: "02", title: "Follow-through", description: "Make follow-up dates and recent activity part of the workflow." },
  { number: "03", title: "Pipeline visibility", description: "See what is new, active, won, or lost without treating forecasts as facts." },
];

export default function HomePage() {
  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Avenova Workspace home">
          <span className="brand-mark">A</span>
          <span>Avenova <span className="muted">Workspace</span></span>
        </a>
        <span className="status">Engineering preview · no customer data</span>
      </header>
      <section className="hero">
        <p className="eyebrow">LEAD-TO-REVENUE WORKSPACE</p>
        <h1>Fewer lost enquiries.<br /><span>More intentional follow-up.</span></h1>
        <p className="intro">A focused workspace concept for service businesses that need a clearer way to track enquiries, opportunities, and the next action. Product demand is still being validated; this is not a live customer service.</p>
        <div className="hero-actions">
          <a className="primary-link" href="#product-principles">Explore the product direction <span aria-hidden="true">↗</span></a>
          <span className="safe-note">No sign-in or data collection is enabled.</span>
        </div>
      </section>
      <section id="product-principles" className="pillars" aria-labelledby="pillars-heading">
        <div className="section-heading">
          <p className="eyebrow">PRODUCT PRINCIPLES</p>
          <h2 id="pillars-heading">Designed around the next useful action.</h2>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article className="pillar" key={pillar.number}>
              <span className="pillar-number">{pillar.number}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="guardrail" aria-labelledby="guardrail-heading">
        <div className="guardrail-icon" aria-hidden="true">!</div>
        <div>
          <h2 id="guardrail-heading">Built carefully before it handles real business data.</h2>
          <p>Authentication, organisation-level permissions, database persistence, audit trails, and tenant-isolation tests are mandatory build gates—not optional upgrades.</p>
        </div>
      </section>
      <footer className="footer">
        <span>Avenova Global · Independent initiative · Not yet legally registered</span>
        <span>Internal engineering scaffold v0.2</span>
      </footer>
    </main>
  );
}
