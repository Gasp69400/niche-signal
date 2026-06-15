"use client";

import { FadeIn } from "@/components/landing/FadeIn";
import { useI18n } from "@/contexts/I18nContext";

export function Testimonials() {
  const { t } = useI18n();

  return (
    <section className="px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
        {t.testimonials.map((item, i) => (
          <FadeIn key={item.name} delay={i * 100}>
            <div className="glass-card card-hover flex h-full flex-col rounded-2xl p-7">
              <p className="flex-1 text-base italic leading-relaxed text-white/90">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-glass-border pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-blue/30 bg-accent-blue/10 text-sm font-semibold text-accent-blue">
                  {item.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-muted">{item.role}</p>
                </div>
              </div>
              <p className="mt-4 font-display text-lg font-bold text-accent-sky">
                {item.stat}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
