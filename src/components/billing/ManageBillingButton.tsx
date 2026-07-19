"use client";

import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { openBillingPortal } from "@/components/billing/SubscribeButton";

export function ManageBillingButton() {
  const { locale, t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      await openBillingPortal(locale);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.billing.portalError);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={loading}
        className="text-sm font-medium text-muted transition hover:text-white disabled:opacity-50"
      >
        {loading ? t.billing.portalLoading : t.billing.manageBilling}
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
