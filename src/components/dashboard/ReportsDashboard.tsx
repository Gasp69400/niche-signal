"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useI18n } from "@/contexts/I18nContext";
import { FavoriteButton } from "@/components/report/FavoriteButton";
import type { ReportSummary } from "@/types/report-summary";

type Tab = "all" | "favorites";

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function ReportsDashboard() {
  const { locale, t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const { openAuth } = useAuthModal();
  const router = useRouter();

  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoadingList(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (tab === "favorites") params.set("favorites", "true");
      const res = await fetch(`/api/reports?${params.toString()}`);
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
  }, [tab, t.dashboard.loadError]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      openAuth("login");
      router.replace(`/${locale}`);
      return;
    }

    void loadReports();
  }, [authLoading, user, openAuth, router, locale, loadReports]);

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((report) => report.domain.toLowerCase().includes(q));
  }, [reports, search]);

  function handleFavoriteToggle(reportId: string, isFavorite: boolean) {
    setReports((prev) => {
      if (tab === "favorites" && !isFavorite) {
        return prev.filter((report) => report.id !== reportId);
      }
      return prev.map((report) =>
        report.id === reportId ? { ...report, isFavorite } : report
      );
    });
  }

  if (authLoading || !user) {
    return <div className="mx-auto max-w-6xl px-6 py-32" />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
            {t.dashboard.label}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            {t.dashboard.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">{t.dashboard.subtitle}</p>
        </div>
        <Link
          href={`/${locale}`}
          className="btn-glow inline-flex shrink-0 items-center justify-center rounded-xl bg-accent-blue px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm"
        >
          {t.dashboard.newAnalysis}
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-xl bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === "all" ? "bg-accent-blue/20 text-white" : "text-muted hover:text-white"
            }`}
          >
            {t.dashboard.tabAll}
          </button>
          <button
            type="button"
            onClick={() => setTab("favorites")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === "favorites"
                ? "bg-rose-500/20 text-rose-300"
                : "text-muted hover:text-white"
            }`}
          >
            {t.dashboard.tabFavorites}
          </button>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.dashboard.searchPlaceholder}
          className="w-full max-w-md rounded-xl border border-glass-border bg-background/80 px-4 py-3 text-sm text-white placeholder:text-muted outline-none focus:ring-2 focus:ring-accent-blue/30"
        />
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </p>
      )}

      {loadingList ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card animate-pulse rounded-2xl p-5">
              <div className="h-5 w-3/4 rounded bg-white/10" />
              <div className="mt-4 h-4 w-1/2 rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="glass-card rounded-2xl px-6 py-16 text-center">
          <p className="text-lg font-medium text-white">
            {tab === "favorites"
              ? t.dashboard.emptyFavorites
              : search
                ? t.dashboard.noResults
                : t.dashboard.empty}
          </p>
          <Link
            href={`/${locale}`}
            className="btn-glow mt-6 inline-flex rounded-xl border border-glass-border px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/5"
          >
            {t.dashboard.newAnalysis}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <article
              key={report.id}
              className="glass-card group rounded-2xl p-5 transition hover:border-accent-blue/30"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/dashboard/${report.id}`)}
                  className="min-w-0 flex-1 text-left"
                >
                  <h2 className="truncate font-semibold text-white group-hover:text-accent-sky">
                    {report.domain}
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    {formatDate(report.createdAt, locale)}
                  </p>
                </button>
                <FavoriteButton
                  reportId={report.id}
                  isFavorite={report.isFavorite}
                  size="sm"
                  onToggle={(next) => handleFavoriteToggle(report.id, next)}
                />
              </div>

              <button
                type="button"
                onClick={() => router.push(`/${locale}/dashboard/${report.id}`)}
                className="mt-4 w-full text-left"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{t.dashboard.score}</span>
                  <span className="font-bold text-accent-blue">
                    {report.opportunityScore}/100
                  </span>
                </div>
                <p className="mt-2 truncate text-xs text-muted">{report.marketSize}</p>
                <p className="mt-4 text-xs font-medium text-accent-sky opacity-0 transition group-hover:opacity-100">
                  {t.dashboard.openReport} →
                </p>
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
