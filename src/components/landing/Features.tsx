"use client";

import { FadeIn } from "@/components/landing/FadeIn";
import { PainPointsMockup } from "@/components/landing/mockups/PainPointsMockup";
import { CompetitorsMockup } from "@/components/landing/mockups/CompetitorsMockup";
import { ScoreMockup } from "@/components/landing/mockups/ScoreMockup";
import { useI18n } from "@/contexts/I18nContext";

const mockups = [
  <PainPointsMockup key="pain" />,
  <CompetitorsMockup key="comp" />,
  <ScoreMockup key="score" />,
];

const icons = [
  <svg key="0" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>,
  <svg key="1" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>,
  <svg key="2" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
];

export function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="relative px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-blue">
            {t.features.sectionLabel}
          </p>
          <h2 className="mt-4 text-center font-display text-3xl font-extrabold text-white sm:text-5xl">
            {t.features.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted">
            {t.features.subtitle}
          </p>
        </FadeIn>

        <div className="relative mt-24 space-y-32">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-accent-blue/40 via-accent-blue/20 to-transparent lg:block" />

          {t.features.items.map((f, i) => (
            <FadeIn key={f.title} delay={i * 80}>
              <div
                className={`relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative z-10">
                  <div className="icon-glow mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10">
                    {icons[i]}
                  </div>
                  <h3 className="font-display text-2xl font-bold sm:text-3xl">
                    <span className="gradient-text">{f.title}</span>
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-white/60">
                    {f.description}
                  </p>
                  <a
                    href="#pricing"
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent-sky transition hover:text-accent-blue"
                  >
                    {f.cta}
                  </a>
                </div>
                <div className="relative z-10">{mockups[i]}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
