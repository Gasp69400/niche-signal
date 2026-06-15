"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useI18n } from "@/contexts/I18nContext";

export function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const { openAuth } = useAuthModal();
  const { locale, t } = useI18n();
  const a = t.auth;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      if (!supabase) {
        if (!cancelled) setReady(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!cancelled) {
        setReady(Boolean(session));
      }
    }

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(a.passwordMismatch);
      return;
    }

    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
  }

  if (!ready) {
    return (
      <div className="glass-card mx-auto w-full max-w-md rounded-2xl p-6 text-center shadow-glow-lg sm:p-8">
        <p className="text-sm text-red-400">{a.resetInvalidLink}</p>
        <button
          type="button"
          onClick={() => openAuth("login")}
          className="mt-4 text-sm font-semibold text-accent-blue hover:text-accent-sky"
        >
          {a.backToLogin}
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="glass-card mx-auto w-full max-w-md rounded-2xl p-6 text-center shadow-glow-lg sm:p-8">
        <p className="text-sm text-emerald-400">{a.resetSuccess}</p>
        <Link
          href={`/${locale}`}
          className="mt-4 inline-block text-sm font-semibold text-accent-blue hover:text-accent-sky"
        >
          {t.legal.backToSite}
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card mx-auto w-full max-w-md rounded-2xl p-6 shadow-glow-lg sm:p-8">
      <h1 className="text-xl font-bold text-white">{a.resetTitle}</h1>
      <p className="mt-1 text-sm text-muted">{a.resetSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-muted">
            {a.newPassword}
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-glass-border bg-background px-4 py-3 text-white placeholder:text-muted/50 outline-none transition focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-muted">
            {a.confirmPassword}
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-glass-border bg-background px-4 py-3 text-white placeholder:text-muted/50 outline-none transition focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 ring-1 ring-red-500/20">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-glow w-full rounded-xl bg-accent-blue py-3 text-sm font-semibold text-white shadow-glow-sm disabled:opacity-50"
        >
          {submitting ? a.loading : a.resetButton}
        </button>
      </form>
    </div>
  );
}
