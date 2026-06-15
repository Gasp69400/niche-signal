"use client";

import { useI18n } from "@/contexts/I18nContext";

const competitors = [
  { name: "HubSpot", arr: "$2.1B ARR", year: 2006, rating: 4.4 },
  { name: "Pipedrive", arr: "$120M ARR", year: 2010, rating: 4.3 },
];

export function CompetitorsMockup() {
  const { t } = useI18n();

  return (
    <div className="glass-card rounded-2xl p-6 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
        {t.mockups.competitors}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {competitors.map((c) => (
          <div
            key={c.name}
            className="rounded-xl border border-glass-border bg-white/[0.02] p-4 transition hover:border-accent-blue/30"
          >
            <p className="font-display font-semibold text-white">{c.name}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-muted">{t.mockups.arrMrr}</p>
            <p className="text-sm font-medium text-accent-sky">{c.arr}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted">
                {t.mockups.founded} {c.year}
              </span>
              <span className="text-amber-400">★ {c.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
