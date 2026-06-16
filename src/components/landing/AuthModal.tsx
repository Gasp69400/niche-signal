"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { mapAuthError } from "@/lib/auth/errors";

type AuthMode = "login" | "signup" | "forgot";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const { t, locale } = useI18n();
  const a = t.auth;
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccess(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialMode]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (mode === "forgot") {
      const result = await resetPassword(email, locale);
      setSubmitting(false);

      if (result.error) {
        setError(mapAuthError(result.error, locale));
        return;
      }

      setSuccess(a.forgotSuccess);
      return;
    }

    if (mode === "login") {
      const result = await signIn(email, password);
      setSubmitting(false);

      if (result.error) {
        setError(mapAuthError(result.error, locale));
        return;
      }

      if (!result.session) {
        setError(a.loginFailed);
        return;
      }

      onClose();
      return;
    }

    const result = await signUp(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(mapAuthError(result.error, locale));
      return;
    }

    if (result.needsEmailConfirmation) {
      setSuccess(a.confirmEmail);
      setMode("login");
      return;
    }

    if (!result.session) {
      setError(a.loginFailed);
      return;
    }

    onClose();
  }

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label={a.close}
      />

      <div className="glass-card relative w-full max-w-md rounded-2xl p-6 shadow-glow-lg sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted transition hover:bg-white/5 hover:text-white"
          aria-label={a.close}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-white">
          {mode === "login"
            ? a.loginTitle
            : mode === "signup"
              ? a.signupTitle
              : a.forgotTitle}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {mode === "login"
            ? a.loginSubtitle
            : mode === "signup"
              ? a.signupSubtitle
              : a.forgotSubtitle}
        </p>

        {mode !== "forgot" && (
        <div className="mt-6 flex rounded-xl bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-accent-blue/20 text-white"
                : "text-muted hover:text-white"
            }`}
          >
            {a.loginTab}
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "signup"
                ? "bg-accent-blue/20 text-white"
                : "text-muted hover:text-white"
            }`}
          >
            {a.signupTab}
          </button>
        </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-muted">
              {a.email}
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={a.emailPlaceholder}
              required
              className="w-full rounded-xl border border-glass-border bg-background px-4 py-3 text-white placeholder:text-muted/50 outline-none transition focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
            />
          </div>
          {mode !== "forgot" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="auth-password" className="text-sm font-medium text-muted">
                {a.password}
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-xs font-medium text-accent-blue hover:text-accent-sky"
                >
                  {a.forgotPassword}
                </button>
              )}
            </div>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-xl border border-glass-border bg-background px-4 py-3 text-white placeholder:text-muted/50 outline-none transition focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
            />
          </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 ring-1 ring-red-500/20">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400 ring-1 ring-emerald-500/20">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-glow w-full rounded-xl bg-accent-blue py-3 text-sm font-semibold text-white shadow-glow-sm disabled:opacity-50"
          >
            {submitting
              ? a.loading
              : mode === "login"
                ? a.loginButton
                : mode === "signup"
                  ? a.signupButton
                  : a.forgotButton}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          {mode === "forgot" ? (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccess(null);
              }}
              className="font-semibold text-accent-blue hover:text-accent-sky"
            >
              {a.backToLogin}
            </button>
          ) : mode === "login" ? (
            <>
              {a.noAccount}{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-semibold text-accent-blue hover:text-accent-sky"
              >
                {a.signupTab}
              </button>
            </>
          ) : (
            <>
              {a.hasAccount}{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-accent-blue hover:text-accent-sky"
              >
                {a.loginTab}
              </button>
            </>
          )}
        </p>
      </div>
    </div>,
    document.body
  );
}
