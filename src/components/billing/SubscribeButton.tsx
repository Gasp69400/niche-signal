"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useI18n } from "@/contexts/I18nContext";
import { apiFetch } from "@/lib/api/fetch";

const PENDING_CHECKOUT_KEY = "niche-founder-pending-checkout";

interface SubscribeButtonProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  redirectIfPro?: string;
}

export function SubscribeButton({
  children,
  className = "",
  wrapperClassName = "w-full",
  redirectIfPro,
}: SubscribeButtonProps) {
  const { locale, t } = useI18n();
  const { user, canAnalyze } = useAuth();
  const { openAuth } = useAuthModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ locale }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : t.billing.checkoutError
        );
      }

      if (typeof data.url !== "string") {
        throw new Error(t.billing.checkoutError);
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t.billing.checkoutError);
      setLoading(false);
    }
  }, [locale, t.billing.checkoutError]);

  useEffect(() => {
    if (!user || canAnalyze) return;
    if (sessionStorage.getItem(PENDING_CHECKOUT_KEY) !== "1") return;

    sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
    void startCheckout();
  }, [user, canAnalyze, startCheckout]);

  async function handleClick() {
    if (loading) return;

    if (!user) {
      sessionStorage.setItem(PENDING_CHECKOUT_KEY, "1");
      openAuth("signup");
      return;
    }

    if (canAnalyze) {
      if (redirectIfPro) {
        router.push(redirectIfPro);
      }
      return;
    }

    await startCheckout();
  }

  return (
    <div className={wrapperClassName}>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={loading}
        className={className}
      >
        {loading ? t.billing.checkoutLoading : children}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutReturnHandler() {
  const { t } = useI18n();
  const { refreshProfile } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");

    if (!checkout) return;

    if (checkout === "success") {
      void refreshProfile();
      setMessage(t.billing.checkoutSuccess);
    } else if (checkout === "cancel") {
      setMessage(t.billing.checkoutCancel);
    }

    const cleanUrl =
      window.location.pathname + (window.location.hash || "");
    window.history.replaceState({}, "", cleanUrl);
  }, [refreshProfile, t.billing.checkoutCancel, t.billing.checkoutSuccess]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl border border-accent-blue/30 bg-background/95 px-4 py-3 text-center text-sm text-white shadow-glow backdrop-blur-xl">
      {message}
    </div>
  );
}

export async function openBillingPortal(locale: string) {
  const res = await apiFetch("/api/stripe/portal", {
    method: "POST",
    body: JSON.stringify({ locale }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || typeof data.url !== "string") {
    throw new Error(
      typeof data.error === "string" ? data.error : "Portail indisponible"
    );
  }

  window.location.href = data.url;
}
