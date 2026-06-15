"use client";

import { useI18n } from "@/contexts/I18nContext";

export function PainPointsMockup() {
  const { t } = useI18n();
  const intensities = [92, 85, 78, 71];
  const points = t.mockups.painPointLabels.map((label, i) => ({
    label,
    intensity: intensities[i] ?? 70,
  }));

  return (
    <div className="glass-card rounded-2xl p-6 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
        {t.mockups.painPoints}
      </p>
      <div className="mt-5 space-y-4">
        {points.map((p) => (
          <div key={p.label}>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-white/80">{p.label}</span>
              <span className="font-medium text-accent-sky">{p.intensity}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-sky"
                style={{ width: `${p.intensity}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
