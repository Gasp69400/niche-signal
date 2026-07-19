"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { useAuth } from "@/contexts/AuthContext";
import { useReportQuota } from "@/contexts/ReportQuotaContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useI18n } from "@/contexts/I18nContext";

export function Navbar() {
  const { locale, t } = useI18n();
  const { user, canAnalyze, signOut } = useAuth();
  const { quota } = useReportQuota();
  const { openAuth } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.features, href: `/${locale}#features` },
    ...(canAnalyze
      ? [{ label: t.nav.opportunities, href: `/${locale}/opportunities` }]
      : []),
    { label: t.nav.pricing, href: `/${locale}#pricing` },
    { label: t.nav.blog, href: "#" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-glass-border bg-background/60 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4 sm:px-8">
        <Link href={`/${locale}`} className="justify-self-start">
          <Logo showText />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <LanguageSwitcher />
          {user ? (
            <>
              {canAnalyze && quota && (
                <Link
                  href={`/${locale}/dashboard`}
                  title={t.quota.compact
                    .replace("{used}", String(quota.used))
                    .replace("{limit}", String(quota.limit))
                    .replace("{remaining}", String(quota.remaining))}
                  className="hidden rounded-lg border border-glass-border bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/90 transition hover:border-accent-blue/30 lg:inline-flex lg:flex-col lg:items-end lg:leading-tight"
                >
                  <span className="font-semibold text-accent-sky">
                    {t.nav.quotaShort
                      .replace("{remaining}", String(quota.remaining))
                      .replace("{limit}", String(quota.limit))}
                  </span>
                  <span className="text-[10px] text-muted">
                    {quota.used}/{quota.limit} {t.quota.used.toLowerCase()}
                  </span>
                </Link>
              )}
              <span className="hidden max-w-[140px] truncate text-sm text-muted xl:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="btn-glow rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:bg-white/5"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="btn-glow hidden rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:bg-white/5 sm:inline"
              >
                {t.nav.login}
              </button>
              <SubscribeButton
                redirectIfPro={`/${locale}/dashboard`}
                wrapperClassName="inline-block shrink-0"
                className="btn-glow relative overflow-hidden rounded-xl bg-accent-blue px-4 py-2 text-sm font-semibold text-white shadow-glow-sm sm:px-5 disabled:opacity-50"
              >
                <span className="relative z-10">{t.nav.startPro}</span>
                <span className="absolute inset-0 animate-shimmer-slide bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </SubscribeButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
