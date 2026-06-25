"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/contexts/I18nContext";
import { BRAND_EMAIL, BRAND_NAME } from "@/lib/brand";

export function Footer() {
  const { locale, t } = useI18n();
  const f = t.footer.columns;

  const columns = [
    {
      title: f.product,
      links: [
        { label: f.features, href: `/${locale}#features` },
        { label: f.pricing, href: `/${locale}#pricing` },
        { label: f.changelog, href: "#" },
      ],
    },
    {
      title: f.resources,
      links: [
        { label: f.blog, href: "#" },
        { label: "Indie Hackers", href: "https://indiehackers.com" },
        { label: "Twitter", href: "https://twitter.com" },
      ],
    },
    {
      title: f.company,
      links: [
        { label: f.about, href: "#" },
        { label: f.contact, href: `mailto:${BRAND_EMAIL}` },
      ],
    },
    {
      title: f.legal,
      links: [
        { label: f.privacy, href: "#" },
        { label: t.footer.terms, href: `/${locale}/cgv` },
        { label: t.footer.legalNotice, href: `/${locale}/mentions-legales` },
      ],
    },
  ];

  return (
    <footer className="border-t border-glass-border px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href={`/${locale}`}>
              <Logo showText />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition hover:text-accent-sky"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-glass-border pt-8 text-center text-sm text-muted">
          <p>© 2026 {BRAND_NAME} · {t.footer.builtBy}</p>
          <p className="mt-2">
            <Link
              href={`/${locale}/cgv`}
              className="text-accent-blue underline decoration-accent-blue/30 underline-offset-4 transition hover:text-accent-sky"
            >
              {t.footer.terms}
            </Link>
            {" · "}
            <Link
              href={`/${locale}/mentions-legales`}
              className="transition hover:text-accent-sky"
            >
              {t.footer.legalNotice}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
