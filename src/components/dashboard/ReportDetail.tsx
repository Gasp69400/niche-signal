"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useReportQuota } from "@/contexts/ReportQuotaContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useI18n } from "@/contexts/I18nContext";
import { ReportCard } from "@/components/ReportCard";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import { ReportQuotaCard } from "@/components/report/ReportQuotaCard";
import { apiFetch } from "@/lib/api/fetch";
import type { AnalyzeReport } from "@/types/market-report";

interface ReportDetailProps {
  reportId: string;
}

export function ReportDetail({ reportId }: ReportDetailProps) {
  const { locale, t } = useI18n();
  const { user, loading: authLoading, canAnalyze } = useAuth();
  const { refreshQuota } = useReportQuota();
  const { openAuth } = useAuthModal();
  const router = useRouter();

  const [report, setReport] = useState<AnalyzeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/api/reports/${reportId}`);
      if (!res.ok) {
        throw new Error(t.dashboard.reportError);
      }
      const data: AnalyzeReport = await res.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.dashboard.reportError);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [reportId, t.dashboard.reportError]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      openAuth("login");
      router.replace(`/${locale}`);
      return;
    }

    void loadReport();
  }, [authLoading, user, openAuth, router, locale, loadReport]);

  async function runAnalysis(domain: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ domain: domain.trim(), refresh: true }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" ? data.error : t.dashboard.reportError
        );
      }

      const data: AnalyzeReport = await res.json();
      void refreshQuota();
      if (data.id) {
        router.push(`/${locale}/dashboard/${data.id}`);
      } else {
        setReport(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.dashboard.reportError);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32">
        <ReportSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-28">
      <div className="mb-8">
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t.dashboard.backToList}
        </Link>
      </div>

      {canAnalyze && <ReportQuotaCard variant="compact" className="mb-6" />}

      {error && (
        <p className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </p>
      )}

      {loading ? (
        <ReportSkeleton />
      ) : report ? (
        <ReportCard
          report={report}
          onAnalyzeNiche={runAnalysis}
          onFavoriteChange={(isFavorite) =>
            setReport((prev) => (prev ? { ...prev, isFavorite } : prev))
          }
        />
      ) : null}
    </div>
  );
}
