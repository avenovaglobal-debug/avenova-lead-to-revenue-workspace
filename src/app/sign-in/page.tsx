"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type AuthStatus = {
  configured: boolean;
  signInEnabled: boolean;
  signUpEnabled: false;
};

export default function SignInPage() {
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/status", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not check sign-in readiness.");
        return (await response.json()) as AuthStatus;
      })
      .then((value) => {
        if (active) setStatus(value);
      })
      .catch(() => {
        if (active) setStatus({ configured: false, signInEnabled: false, signUpEnabled: false });
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: email.trim(), password, callbackURL: "/dashboard" }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!response.ok) {
        setError(result.message || result.error || "Sign-in failed. Check your details and try again.");
        return;
      }
      window.location.assign("/dashboard");
    } catch {
      setError("Unable to reach the sign-in service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="workspace-page">
      <header className="workspace-topbar">
        <a className="workspace-brand" href="/">Avenova <span>Workspace</span></a>
        <span className="workspace-role">Restricted access</span>
      </header>
      <section className="workspace-auth-card">
        <p className="workspace-eyebrow">FOUNDER / TEAM ACCESS</p>
        <h1>Sign in to your workspace.</h1>
        <p className="workspace-auth-intro">Access is restricted to provisioned accounts. Public registration is disabled.</p>
        {status === null ? (
          <p className="workspace-auth-notice" role="status">Checking authentication readiness…</p>
        ) : !status.configured ? (
          <p className="workspace-auth-notice" role="status">Authentication configuration is incomplete. Sign-in remains locked.</p>
        ) : !status.signInEnabled ? (
          <p className="workspace-auth-notice" role="status">Sign-in is currently locked while founder access is being provisioned. No account can be created from this page.</p>
        ) : (
          <form className="workspace-auth-form" onSubmit={handleSubmit}>
            <label>Email address
              <input autoComplete="username" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>Password
              <input autoComplete="current-password" type="password" required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error ? <p className="workspace-error" role="alert">{error}</p> : null}
            <button className="workspace-button" type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button>
            <p className="workspace-auth-footnote">Registration and password recovery are not available here. Contact the workspace administrator if you need access assistance.</p>
          </form>
        )}
        <a className="workspace-back" href="/">Back to Avenova overview</a>
      </section>
      <footer className="workspace-footer">Avenova Global · Engineering preview · Do not enter real customer data until release gates are complete.</footer>
    </main>
  );
}
