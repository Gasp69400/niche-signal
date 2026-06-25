"use client";

import { BRAND_NAME } from "@/lib/brand";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/contexts/I18nContext";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const { locale, t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-glass-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5 sm:px-8">
          <Link href={`/${locale}`}>
            <Logo showText />
          </Link>
          <Link
            href={`/${locale}`}
            className="text-sm text-muted transition hover:text-accent-blue"
          >
            {t.legal.backToSite}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">
          {t.legal.lastUpdated} : {lastUpdated}
        </p>
        <article className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-muted sm:text-base">
          {children}
        </article>
      </main>

      <footer className="border-t border-glass-border px-6 py-8 text-center text-sm text-muted">
        <p>
          © 2026 {BRAND_NAME} ·{" "}
          <Link href={`/${locale}/cgv`} className="text-accent-blue transition hover:text-accent-sky">
            {t.footer.terms}
          </Link>
          {" · "}
          <Link
            href={`/${locale}/mentions-legales`}
            className="text-accent-blue transition hover:text-accent-sky"
          >
            {t.footer.legalNotice}
          </Link>
        </p>
      </footer>
    </div>
  );
}
