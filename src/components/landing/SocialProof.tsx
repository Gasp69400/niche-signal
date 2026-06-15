"use client";

import { useI18n } from "@/contexts/I18nContext";

export function SocialProof() {
  const { t } = useI18n();
  const items = [...t.marquee, ...t.marquee];

  return (
    <section className="relative border-y border-glass-border bg-white/[0.02] py-5">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-12 px-6">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap text-sm font-medium tracking-wide text-muted/60"
            >
              {name}
              <span className="mx-6 text-glass-border">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
