"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useI18n } from "@/contexts/I18nContext";
import { redirectToPricing } from "@/lib/navigation";
import { apiFetch } from "@/lib/api/fetch";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { ReportQuotaCard } from "@/components/report/ReportQuotaCard";
import type { MonthlyOpportunityEdition } from "@/types/monthly-opportunity";

function formatEditionDate(
  year: number,
  month: number,
  generatedAt: string,
  locale: string
) {
  const monthLabel = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1)));

  const generatedLabel = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(generatedAt));

  return { monthLabel, generatedLabel };
}

export function MonthlyOpportunitiesPage() {
  const { locale, t } = useI18n();
  const { user, loading: authLoading, canAnalyze } = useAuth();
  const { openAuth } = useAuthModal();
  const router = useRouter();

  const [edition, setEdition] = useState<MonthlyOpportunityEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzingDomain, setAnalyzingDomain] = useState<string | null>(null);

  const loadEdition = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/api/opportunities/current?locale=${locale}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : t.monthlyOpportunities.loadError
        );
      }

      const data: MonthlyOpportunityEdition = await res.json();
      setEdition(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.monthlyOpportunities.loadError);
      setEdition(null);
    } finally {
      setLoading(false);
    }
  }, [locale, t.monthlyOpportunities.loadError]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      openAuth("login");
      router.replace(`/${locale}`);
      return;
    }

    if (!canAnalyze) {
      redirectToPricing();
      return;
    }

    void loadEdition();
  }, [authLoading, user, canAnalyze, openAuth, router, locale, loadEdition]);

  async function analyzeOpportunity(domain: string) {
    setAnalyzingDomain(domain);
    setError(null);

    try {
      const res = await apiFetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ domain: domain.trim(), refresh: true }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : t.monthlyOpportunities.analyzeError
        );
      }

      const data = await res.json();
      if (data.id) {
        router.push(`/${locale}/dashboard/${data.id}`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.monthlyOpportunities.analyzeError);
    } finally {
      setAnalyzingDomain(null);
    }
  }

  if (authLoading || !user || !canAnalyze) {
    return <div className="mx-auto max-w-6xl px-6 py-32" />;
  }

  const dates = edition
    ? formatEditionDate(edition.year, edition.month, edition.generatedAt, locale)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
            {t.monthlyOpportunities.label}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            {edition?.title ?? t.monthlyOpportunities.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {edition?.subtitle ?? t.monthlyOpportunities.subtitle}
          </p>
          {dates && (
            <p className="mt-3 text-xs text-muted">
              {t.monthlyOpportunities.publishedOn
                .replace("{month}", dates.monthLabel)
                .replace("{date}", dates.generatedLabel)}
            </p>
          )}
        </div>

        <Link
          href={`/${locale}`}
          className="btn-glow inline-flex shrink-0 items-center justify-center rounded-xl border border-glass-border px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/5"
        >
          {t.monthlyOpportunities.backHome}
        </Link>
      </div>

      <ReportQuotaCard variant="compact" className="mb-8" />

      {error && (
        <p className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid gap-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="glass-card animate-pulse rounded-2xl p-6 sm:p-8"
            >
              <div className="h-6 w-1/3 rounded bg-white/10" />
              <div className="mt-4 h-4 w-full rounded bg-white/10" />
              <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : edition && edition.opportunities.length > 0 ? (
        <div className="grid gap-5">
          {edition.opportunities.map((opportunity) => (
            <OpportunityCard
              key={`${opportunity.rank}-${opportunity.domain}`}
              opportunity={opportunity}
              onAnalyze={analyzeOpportunity}
              analyzing={analyzingDomain === opportunity.domain}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl px-6 py-16 text-center">
          <p className="text-lg font-medium text-white">{t.monthlyOpportunities.empty}</p>
          <button
            type="button"
            onClick={() => void loadEdition()}
            className="btn-glow mt-6 rounded-xl border border-glass-border px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/5"
          >
            {t.monthlyOpportunities.retry}
          </button>
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-white/75">
          {t.monthlyOpportunities.disclaimer}
        </p>
      </div>
    </div>
  );
}
