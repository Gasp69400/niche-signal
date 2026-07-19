"use client";

import { useI18n } from "@/contexts/I18nContext";
import type { MonthlyOpportunityItem } from "@/types/monthly-opportunity";

interface OpportunityCardProps {
  opportunity: MonthlyOpportunityItem;
  onAnalyze: (domain: string) => void;
  analyzing?: boolean;
}

export function OpportunityCard({
  opportunity,
  onAnalyze,
  analyzing = false,
}: OpportunityCardProps) {
  const { t } = useI18n();

  return (
    <article className="glass-card relative overflow-hidden rounded-2xl border border-glass-border p-6 transition hover:border-accent-blue/30 sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-blue/10 blur-2xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-blue/20 text-sm font-bold text-accent-sky">
              #{opportunity.rank}
            </span>
            <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold text-accent-blue">
              {opportunity.opportunityScore}/100
            </span>
            {opportunity.trend && (
              <span className="text-xs font-medium text-emerald-400/90">
                {opportunity.trend}
              </span>
            )}
          </div>

          <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
            {opportunity.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-accent-sky">{opportunity.domain}</p>

          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {opportunity.highlight}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric label={t.monthlyOpportunities.metrics.marketSize} value={opportunity.marketSize} />
            <Metric label={t.monthlyOpportunities.metrics.competition} value={opportunity.competition} />
            <Metric
              label={t.monthlyOpportunities.metrics.willingnessToPay}
              value={opportunity.willingnessToPayEstimate}
            />
            <Metric
              label={t.monthlyOpportunities.metrics.painLevel}
              value={`${opportunity.painLevel}/10`}
            />
          </div>

          <div className="mt-5 space-y-3 rounded-xl bg-white/[0.03] p-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {t.monthlyOpportunities.whyNow}
              </p>
              <p className="mt-1 text-sm text-white/80">{opportunity.whyNow}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {t.monthlyOpportunities.topPain}
              </p>
              <p className="mt-1 text-sm text-white/80">{opportunity.topPainPoint}</p>
            </div>
          </div>

          {opportunity.sources.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.sources.map((source) => (
                <span
                  key={source}
                  className="rounded-full border border-glass-border bg-background/60 px-2.5 py-1 text-[11px] text-muted"
                >
                  {source}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAnalyze(opportunity.domain)}
          disabled={analyzing}
          className="btn-glow shrink-0 rounded-xl bg-accent-blue px-5 py-3 text-sm font-semibold text-white shadow-glow-sm disabled:opacity-50 lg:mt-2"
        >
          {analyzing ? t.monthlyOpportunities.analyzing : t.monthlyOpportunities.analyzeCta}
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
