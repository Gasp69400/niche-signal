"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useI18n } from "@/contexts/I18nContext";
import { AnalysisReadyBanner } from "@/components/landing/AnalysisReadyBanner";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import { ReportDemoMockup } from "@/components/landing/mockups/ReportDemoMockup";
import { FadeIn } from "@/components/landing/FadeIn";
import { apiFetch } from "@/lib/api/fetch";
import type { AnalyzeReport } from "@/types/market-report";

const STAT_ICONS = [
  <svg key="chart" className="h-4 w-4 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h4l3-9 4 18 3-9h4" />
  </svg>,
  <svg key="refresh" className="h-4 w-4 text-accent-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0 0 19 5" />
  </svg>,
  <svg key="spark" className="h-4 w-4 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
  </svg>,
];

export function Hero() {
  const { t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const { openAuth } = useAuthModal();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AnalyzeReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pendingAnalysisRef = useRef<string | null>(null);

  function scrollToDemo() {
    document.getElementById("hero-demo")?.scrollIntoView({ behavior: "smooth" });
  }

  const runAnalysis = useCallback(
    async (domain: string) => {
      if (!domain.trim() || authLoading) return;

      if (!user) {
        pendingAnalysisRef.current = domain.trim();
        openAuth("login");
        return;
      }

      setQuery(domain);
      setIsLoading(true);
      setError(null);
      setReport(null);

      try {
        const res = await apiFetch("/api/analyze", {
          method: "POST",
          body: JSON.stringify({ domain: domain.trim(), refresh: true }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Erreur lors de l'analyse");
        }

        const data: AnalyzeReport = await res.json();
        setReport(data);
        requestAnimationFrame(() => {
          document.getElementById("report-result")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de générer le rapport");
      } finally {
        setIsLoading(false);
      }
    },
    [authLoading, user, openAuth]
  );

  useEffect(() => {
    if (!user || authLoading || !pendingAnalysisRef.current) return;

    const domain = pendingAnalysisRef.current;
    pendingAnalysisRef.current = null;
    void runAnalysis(domain);
  }, [user, authLoading, runAnalysis]);

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    runAnalysis(query);
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-28 sm:px-8">
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-sky/10 blur-[100px] animate-blob-delayed" />

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <FadeIn>
          <div className="glass-pill mx-auto mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 animate-pulse-dot rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm text-white/70">{t.hero.badge}</span>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
            <span className="block text-white">{t.hero.titleLine1}</span>
            <span className="gradient-text mt-1 block">{t.hero.titleLine2}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p className="mx-auto mt-6 max-w-[520px] text-base leading-relaxed text-muted sm:text-lg">
            {t.hero.subtitle}
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <form onSubmit={handleAnalyze} className="mx-auto mt-10 max-w-xl">
            <div className="glass-card flex flex-col gap-2 rounded-2xl p-2 sm:flex-row">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                className="flex-1 rounded-xl border-0 bg-background/80 px-4 py-3.5 text-sm text-white placeholder:text-muted outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
              <button
                type="submit"
                disabled={isLoading || authLoading || !query.trim()}
                className="btn-glow rounded-xl bg-accent-blue px-6 py-3.5 text-sm font-semibold text-white shadow-glow-sm disabled:opacity-50"
              >
                {isLoading ? t.hero.analyzing : `${t.hero.analyze} →`}
              </button>
            </div>
            {!authLoading && !user && (
              <p className="mt-3 text-xs text-muted">{t.hero.loginRequired}</p>
            )}
          </form>
        </FadeIn>

        {(isLoading || report || error) && (
          <div className="mt-12 text-left">
            <div id="report-result" className="mx-auto max-w-2xl scroll-mt-28">
              {isLoading ? (
                <ReportSkeleton />
              ) : report ? (
                <FadeIn>
                  <AnalysisReadyBanner
                    report={report}
                    onFavoriteChange={(isFavorite) =>
                      setReport((prev) => (prev ? { ...prev, isFavorite } : prev))
                    }
                  />
                </FadeIn>
              ) : error ? (
                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-sm text-red-400">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="mt-4 text-sm font-semibold text-accent-blue hover:text-accent-sky"
                  >
                    {t.hero.retryAnalysis}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}

        <FadeIn delay={400}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => openAuth("signup")}
              className="btn-glow inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-8 py-4 text-base font-semibold text-white shadow-glow"
            >
              {t.hero.cta}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollToDemo}
              className="btn-glow rounded-2xl border border-glass-border px-8 py-4 text-base font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/5"
            >
              {t.hero.demoCta}
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={500}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {t.hero.stats.map((stat, i) => (
              <div
                key={stat}
                className="glass-pill card-hover flex items-center gap-2 rounded-full px-4 py-2"
              >
                {STAT_ICONS[i]}
                <span className="text-sm text-white/70">{stat}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {!report && !isLoading && !error && (
          <FadeIn delay={600} className="mt-16">
            <div id="hero-demo" className="animate-levitate">
              <ReportDemoMockup />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
