"use client";

import { FadeIn } from "@/components/landing/FadeIn";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { useI18n } from "@/contexts/I18nContext";

export function FinalCTA() {
  const { locale, t } = useI18n();

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue/15 blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-accent-sky/10 blur-[80px] animate-blob-delayed" />

      <FadeIn>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
            <span className="text-white">{t.finalCta.titleLine1}</span>
            <br />
            <span className="gradient-text">{t.finalCta.titleLine2}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-muted">{t.finalCta.subtitle}</p>
          <SubscribeButton
            redirectIfPro={`/${locale}/dashboard`}
            wrapperClassName="inline-block"
            className="btn-glow mt-10 inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-10 py-4 text-base font-semibold text-white shadow-glow-lg disabled:opacity-50"
          >
            {t.finalCta.cta}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </SubscribeButton>
        </div>
      </FadeIn>
    </section>
  );
}
