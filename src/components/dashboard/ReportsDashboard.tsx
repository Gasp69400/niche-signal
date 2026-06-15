"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useI18n } from "@/contexts/I18nContext";
import { ReportCard } from "@/components/ReportCard";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import type { AnalyzeReport } from "@/types/market-report";
import type { ReportSummary } from "@/types/report-summary";

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function ReportsDashboard() {
  const { locale, t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const { openAuth } = useAuthModal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AnalyzeReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoadingList(true);
    setError(null);

    try {
      const res = await fetch("/api/reports");
      if (!res.ok) {
        throw new Error(t.dashboard.loadError);
      }
      const data: ReportSummary[] = await res.json();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.dashboard.loadError);
    } finally {
      setLoadingList(false);
    }
  }, [t.dashboard.loadError]);

  const loadReport = useCallback(
    async (id: string) => {
      setLoadingReport(true);
      setError(null);
      setSelectedId(id);

      try {
        const res = await fetch(`/api/reports/${id}`);
        if (!res.ok) {
          throw new Error(t.dashboard.reportError);
        }
        const data: AnalyzeReport = await res.json();
        setSelectedReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.dashboard.reportError);
        setSelectedReport(null);
      } finally {
        setLoadingReport(false);
      }
    },
    [t.dashboard.reportError]
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      openAuth("login");
      router.replace(`/${locale}`);
      return;
    }

    void loadReports();
  }, [authLoading, user, openAuth, router, locale, loadReports]);

  useEffect(() => {
    const reportId = searchParams.get("report");
    if (reportId && user && !authLoading) {
      void loadReport(reportId);
    }
  }, [searchParams, user, authLoading, loadReport]);

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((report) => report.domain.toLowerCase().includes(q));
  }, [reports, search]);

  async function runAnalysis(domain: string) {
    setLoadingReport(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim(), refresh: true }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" ? data.error : t.dashboard.reportError
        );
      }

      const data: AnalyzeReport = await res.json();
      setSelectedReport(data);
      if (data.id) setSelectedId(data.id);
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.dashboard.reportError);
    } finally {
      setLoadingReport(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-32">
        <ReportSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
            {t.dashboard.label}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            {t.dashboard.title}
          </h1>
          <p className="mt-2 text-sm text-muted">{t.dashboard.subtitle}</p>
        </div>
        <Link
          href={`/${locale}`}
          className="btn-glow inline-flex items-center justify-center rounded-xl bg-accent-blue px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm"
        >
          {t.dashboard.newAnalysis}
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="glass-card rounded-2xl p-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.dashboard.searchPlaceholder}
            className="w-full rounded-xl border border-glass-border bg-background/80 px-4 py-3 text-sm text-white placeholder:text-muted outline-none focus:ring-2 focus:ring-accent-blue/30"
          />

          <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto">
            {loadingList ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-white/10 p-4">
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
                </div>
              ))
            ) : filteredReports.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted">
                {search ? t.dashboard.noResults : t.dashboard.empty}
              </p>
            ) : (
              filteredReports.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => loadReport(report.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedId === report.id
                      ? "border-accent-blue/40 bg-accent-blue/10"
                      : "border-transparent bg-white/[0.03] hover:border-glass-border hover:bg-white/[0.05]"
                  }`}
                >
                  <p className="font-medium text-white">{report.domain}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
                    <span>
                      {t.dashboard.score}:{" "}
                      <span className="font-semibold text-accent-sky">
                        {report.opportunityScore}/100
                      </span>
                    </span>
                    <span>{formatDate(report.createdAt, locale)}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted">{report.marketSize}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        <main>
          {error && (
            <p className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
              {error}
            </p>
          )}

          {loadingReport ? (
            <ReportSkeleton />
          ) : selectedReport ? (
            <ReportCard report={selectedReport} onAnalyzeNiche={runAnalysis} />
          ) : (
            <div className="glass-card flex min-h-[400px] flex-col items-center justify-center rounded-2xl p-8 text-center">
              <p className="text-lg font-medium text-white">{t.dashboard.selectReport}</p>
              <p className="mt-2 max-w-sm text-sm text-muted">{t.dashboard.selectHint}</p>
              <Link
                href={`/${locale}`}
                className="btn-glow mt-6 rounded-xl border border-glass-border px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/5"
              >
                {t.dashboard.newAnalysis}
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
