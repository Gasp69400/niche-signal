"use client";

import { FadeIn } from "@/components/landing/FadeIn";
import { useI18n } from "@/contexts/I18nContext";

const STRIPE_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? "#pricing";

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
  const { t } = useI18n();

  const plans = [
    {
      ...t.pricing.free,
      price: "€0",
      highlighted: false,
      href: "#",
    },
    {
      ...t.pricing.pro,
      price: "€29",
      highlighted: true,
      href: STRIPE_CHECKOUT_URL,
    },
  ];

  return (
    <section id="pricing" className="px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-blue">
            Pricing
          </p>
          <h2 className="mt-4 text-center font-display text-3xl font-extrabold text-white sm:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted">
            {t.pricing.subtitle}
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-2xl p-8 ${
                  plan.highlighted
                    ? "shimmer-border shadow-glow-lg"
                    : "glass-card"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-blue px-4 py-1 text-xs font-semibold text-white shadow-glow-sm">
                    {t.pricing.mostPopular}
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm text-muted">{plan.period}</span>
                </div>
                <ul className="mt-8 flex-1 space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={`btn-glow mt-10 block rounded-xl py-3.5 text-center text-sm font-semibold ${
                    plan.highlighted
                      ? "bg-accent-blue text-white shadow-glow-sm"
                      : "border border-glass-border text-white hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
