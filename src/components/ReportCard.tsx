"use client";

import { useAuth } from "@/contexts/AuthContext";
import { MarketTrendChart } from "@/components/report/MarketTrendChart";
import { OpportunityRadar } from "@/components/report/OpportunityRadar";
import { PositioningAngle } from "@/components/report/PositioningAngle";
import { ReportActionBar } from "@/components/report/ReportActionBar";
import { ReportMarketSignals } from "@/components/report/ReportMarketSignals";
import { ReportSection } from "@/components/report/ReportSection";
import { SimilarNiches } from "@/components/report/SimilarNiches";
import { FavoriteButton } from "@/components/report/FavoriteButton";
import { TargetPersona } from "@/components/report/TargetPersona";
import type { AnalyzeReport } from "@/types/market-report";

interface ReportCardProps {
  report: AnalyzeReport;
  onAnalyzeNiche?: (niche: string) => void;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 ${
        highlight ? "border-accent-blue/30 shadow-glow-sm" : ""
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-2xl font-bold ${
          highlight ? "text-accent-blue" : "text-white"
        }`}
      >
        {value}
        {highlight && typeof value === "number" ? (
          <span className="ml-1 text-sm font-normal text-muted">/100</span>
        ) : null}
      </p>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 ${
            i < Math.round(rating) ? "text-amber-400" : "text-white/20"
          }`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02l4.111-2.462 4.111 2.462c.714.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.401Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
      <span className="ml-1.5 text-sm font-medium text-muted">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function ReportCard({ report, onAnalyzeNiche, onFavoriteChange }: ReportCardProps) {
  const { profile } = useAuth();
  const isPro = profile?.plan === "pro";
  const isPositiveVerdict = report.opportunityScore >= 70;

  return (
    <>
      <div id="report-print-area" className="w-full pb-24">
        <div className="glass-card mb-6 rounded-2xl p-6 shadow-glow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
                Rapport d&apos;analyse
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                {report.domain}
              </h2>
            </div>
            <FavoriteButton
              reportId={report.id}
              isFavorite={report.isFavorite}
              onToggle={onFavoriteChange}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Score d'opportunité" value={report.opportunityScore} highlight />
          <MetricCard label="Taille du marché" value={report.marketSize} />
          <MetricCard label="Concurrence" value={report.competition} />
          <MetricCard label="Difficulté de build" value={report.buildDifficulty} />
        </div>

        <div className="mt-4">
          <ReportMarketSignals report={report} />
        </div>
        <div id="report-metrics-end" className="h-px" aria-hidden="true" />

        <ReportSection label="Tendance du marché">
          <MarketTrendChart
            data={report.marketTrend.data}
            sixMonthChange={report.marketTrend.sixMonthChange}
            trend={report.marketTrend.trend}
            marketTrendDirection={report.marketTrendDirection}
          />
        </ReportSection>

        <ReportSection label="Analyse détaillée">
          <OpportunityRadar data={report.radar} />
        </ReportSection>

        <ReportSection label="Pain points">
          <div className="glass-card rounded-2xl p-6">
            <div className="space-y-4">
              {report.painPoints.map((point) => (
                <div key={point.label}>
                  <div className="mb-1.5 flex items-center justify-between gap-4">
                    <span className="text-sm text-white/80">{point.label}</span>
                    <span className="shrink-0 text-xs font-semibold text-accent-sky">
                      {point.intensity}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-sky"
                      style={{ width: `${point.intensity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ReportSection>

        <ReportSection label="Concurrents">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {report.competitors.map((competitor) => (
              <a
                key={competitor.name}
                href={competitor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card card-hover group block rounded-2xl p-5 transition hover:ring-1 hover:ring-accent-sky/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-white transition group-hover:text-accent-sky">
                    {competitor.name}
                  </h4>
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:text-accent-sky"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted">ARR / MRR</dt>
                    <dd className="mt-1 font-medium text-accent-sky">
                      {competitor.arrMrrEstimate}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted">Fondé en</dt>
                    <dd className="mt-1 text-white/80">{competitor.foundedYear}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted">Note</dt>
                    <dd className="mt-1">
                      <StarRating rating={competitor.rating} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted">Prix</dt>
                    <dd className="mt-1 text-white/80">{competitor.price}</dd>
                  </div>
                  {competitor.region && (
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted">Région</dt>
                      <dd className="mt-1 text-white/80">{competitor.region}</dd>
                    </div>
                  )}
                </dl>
              </a>
            ))}
          </div>
        </ReportSection>

        <ReportSection label="Persona cible idéal">
          <TargetPersona persona={report.persona} />
        </ReportSection>

        <ReportSection label="Angle de positionnement suggéré">
          <PositioningAngle positioning={report.positioning} />
        </ReportSection>

        <section
          className={`mt-8 rounded-2xl border p-6 ${
            isPositiveVerdict
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-amber-500/30 bg-amber-500/10"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
            Verdict
          </p>
          <h3
            className={`mt-2 font-display font-semibold ${
              isPositiveVerdict ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {isPositiveVerdict ? "Opportunité prometteuse" : "À approfondir"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{report.verdict}</p>
        </section>

        {onAnalyzeNiche && (
          <ReportSection label="Niches similaires à explorer">
            <SimilarNiches niches={report.similarNiches} onSelect={onAnalyzeNiche} />
          </ReportSection>
        )}
      </div>

      <ReportActionBar
        report={report}
        reportId={report.id}
        isPro={isPro}
        onSave={() => {
          /* déjà sauvegardé via API */
        }}
      />
    </>
  );
}
