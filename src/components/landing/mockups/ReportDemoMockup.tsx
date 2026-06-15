"use client";

import { useI18n } from "@/contexts/I18nContext";

export function ReportDemoMockup() {
  const { t } = useI18n();
  const painPoints = t.mockups.painPointLabels.map((label, i) => ({
    label,
    intensity: [92, 85, 78][i] ?? 70,
  }));

  return (
    <div className="glass-card mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-glow-lg">
      <div className="flex items-center gap-2 border-b border-glass-border px-5 py-3.5">
        <div className="h-3 w-3 rounded-full bg-red-500/50" />
        <div className="h-3 w-3 rounded-full bg-amber-500/50" />
        <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
        <span className="ml-2 font-mono text-xs text-muted">{t.mockups.reportTitle}</span>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-accent-blue/30 bg-accent-blue/10 px-5 py-3 shadow-glow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
              {t.mockups.opportunityScore}
            </p>
            <p className="font-display text-3xl font-bold text-white">
              7.8<span className="text-sm font-normal text-muted">/10</span>
            </p>
          </div>
          <div className="glass-card rounded-xl px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
              {t.mockups.marketSize}
            </p>
            <p className="font-display text-3xl font-bold text-white">$4.2B</p>
          </div>
          <div className="glass-card rounded-xl px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
              {t.mockups.competition}
            </p>
            <p className="font-display text-3xl font-bold text-white">{t.mockups.moderate}</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
            {t.mockups.topPainPoints}
          </p>
          <div className="space-y-3">
            {painPoints.map((p) => (
              <div key={p.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-white/80">{p.label}</span>
                  <span className="font-medium text-accent-sky">{p.intensity}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-sky"
                    style={{ width: `${p.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {["HubSpot", "Pipedrive", "Close"].map((name) => (
            <div key={name} className="glass-card rounded-lg p-3 text-center">
              <p className="text-xs font-medium text-white">{name}</p>
              <p className="mt-1 text-[10px] text-accent-sky">★ 4.4</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
