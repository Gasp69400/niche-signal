"use client";

import { FadeIn } from "@/components/landing/FadeIn";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { useI18n } from "@/contexts/I18nContext";

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-accent-sky"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

export function Pricing() {
  const { locale, t } = useI18n();
  const plan = {
    ...t.pricing.pro,
    price: "€9,90",
  };

  return (
    <section id="pricing" className="px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-xl">
        <FadeIn>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-blue">
            {t.nav.pricing}
          </p>
          <h2 className="mt-4 text-center font-display text-3xl font-extrabold text-white sm:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted">
            {t.pricing.subtitle}
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="relative mt-16 flex flex-col rounded-2xl p-8 shimmer-border shadow-glow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-blue px-4 py-1 text-xs font-semibold text-white shadow-glow-sm">
              {t.pricing.badge}
            </span>
            <h3 className="font-display text-lg font-semibold text-white">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-extrabold text-white">{plan.price}</span>
              <span className="text-sm text-muted">{plan.period}</span>
            </div>
            <ul className="mt-8 flex-1 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>
            <SubscribeButton
              redirectIfPro={`/${locale}/dashboard`}
              className="btn-glow mt-10 block w-full rounded-xl bg-accent-blue py-3.5 text-center text-sm font-semibold text-white shadow-glow-sm disabled:opacity-50"
            >
              {plan.cta}
            </SubscribeButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
