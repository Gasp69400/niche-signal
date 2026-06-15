"use client";

import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { FavoriteButton } from "@/components/report/FavoriteButton";
import type { AnalyzeReport } from "@/types/market-report";

interface AnalysisReadyBannerProps {
  report: AnalyzeReport;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export function AnalysisReadyBanner({
  report,
  onFavoriteChange,
}: AnalysisReadyBannerProps) {
  const { locale, t } = useI18n();

  if (!report.id) return null;

  return (
    <div className="glass-card mx-auto mt-12 max-w-2xl rounded-2xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-400">
            {t.hero.reportReady}
          </p>
          <h2 className="mt-2 truncate font-display text-xl font-bold text-white sm:text-2xl">
            {report.domain}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {t.hero.reportReadyHint}
          </p>
        </div>
        <FavoriteButton
          reportId={report.id}
          isFavorite={report.isFavorite}
          onToggle={onFavoriteChange}
        />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
        <span className="text-sm text-muted">{t.dashboard.score}</span>
        <span className="font-display text-2xl font-bold text-accent-blue">
          {report.opportunityScore}
          <span className="text-sm font-normal text-muted">/100</span>
        </span>
      </div>

      <Link
        href={`/${locale}/dashboard/${report.id}`}
        className="btn-glow mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-blue py-3.5 text-sm font-semibold text-white shadow-glow-sm"
      >
        {t.hero.viewFullReport}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
