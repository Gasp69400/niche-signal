"use client";

import { useI18n } from "@/contexts/I18nContext";
import type { AnalyzeReport, MarketTrendDirection } from "@/types/market-report";

const TREND_STYLES: Record<
  MarketTrendDirection,
  { dot: string }
> = {
  growing: { dot: "bg-emerald-400" },
  stable: { dot: "bg-amber-400" },
  declining: { dot: "bg-red-400" },
};

function SignalCard({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {children}
        <p className="font-display text-lg font-bold leading-snug text-white">{value}</p>
      </div>
    </div>
  );
}

export function ReportMarketSignals({ report }: { report: AnalyzeReport }) {
  const { t } = useI18n();
  const s = t.report.signals;
  const trendStyle = TREND_STYLES[report.marketTrendDirection];
  const trendLabel =
    report.marketTrendDirection === "growing"
      ? s.trendGrowing
      : report.marketTrendDirection === "declining"
        ? s.trendDeclining
        : s.trendStable;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SignalCard label={s.willingnessToPay} value={report.willingnessToPayEstimate} />
      <SignalCard label={s.marketTrend} value={trendLabel}>
        <span className={`h-2 w-2 shrink-0 rounded-full ${trendStyle.dot}`} />
      </SignalCard>
      <SignalCard label={s.geographicFocus} value={report.geographicFocus}>
        <svg
          className="h-4 w-4 shrink-0 text-accent-sky"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.47.732-3.582"
          />
        </svg>
      </SignalCard>
    </div>
  );
}
