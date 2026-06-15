"use client";

import { useState } from "react";
import { ReportCard } from "@/components/ReportCard";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import { apiFetch } from "@/lib/api/fetch";
import type { AnalyzeReport } from "@/types/market-report";

export function SearchForm() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AnalyzeReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis(niche: string) {
    if (!niche.trim()) return;

    setDomain(niche);
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await apiFetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ domain: niche.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" ? data.error : "Erreur lors de l'analyse"
        );
      }

      const data: AnalyzeReport = await res.json();
      setReport(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de générer le rapport. Réessayez."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runAnalysis(domain);
  }

  return (
    <div className="flex w-full flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-premium backdrop-blur-sm">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pulse-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Ex. CRM pour PME, gestion de projet, email marketing..."
                className="w-full rounded-xl border border-transparent bg-slate-50/80 py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-pulse-200 focus:bg-white focus:ring-4 focus:ring-pulse-100"
                aria-label="Domaine SaaS à analyser"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !domain.trim()}
              className="rounded-xl bg-gradient-to-r from-pulse-500 to-pulse-600 px-8 py-4 text-sm font-semibold text-white shadow-glow transition hover:from-pulse-600 hover:to-pulse-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Analyse en cours..." : "Analyser"}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </p>
      )}

      {(isLoading || report) && (
        <div className="mt-14 w-full">
          {isLoading ? (
            <ReportSkeleton />
          ) : report ? (
            <ReportCard report={report} onAnalyzeNiche={runAnalysis} />
          ) : null}
        </div>
      )}
    </div>
  );
}
