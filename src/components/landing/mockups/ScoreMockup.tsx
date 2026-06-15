"use client";

import { useI18n } from "@/contexts/I18nContext";

export function ScoreMockup() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent-blue/30 bg-accent-blue/10 p-8 shadow-glow">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
          {t.mockups.opportunityScore}
        </p>
        <p className="mt-3 font-display text-6xl font-extrabold text-white">
          7.8<span className="text-xl font-normal text-muted">/10</span>
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-accent-blue to-accent-sky" />
        </div>
      </div>
      <div className="glass-card rounded-2xl border-accent-sky/20 p-5">
        <p className="font-display font-semibold text-accent-sky">{t.mockups.verdict}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{t.mockups.verdictText}</p>
      </div>
    </div>
  );
}
