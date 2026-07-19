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
import { ReportCompetitors } from "@/components/report/ReportCompetitors";
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

        <ReportCompetitors competitors={report.competitors} />

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
