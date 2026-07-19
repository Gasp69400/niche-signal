"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import {
  MIN_COMPETITORS_PER_REPORT,
  TARGET_COMPETITORS_PER_REPORT,
} from "@/lib/reports/competitors-config";
import type { Competitor } from "@/types/market-report";

interface ReportCompetitorsProps {
  competitors: Competitor[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? "text-amber-400" : "text-white/20"
          }`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02l4.111-2.462 4.111 2.462c.714.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.401Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
      <span className="ml-1 text-xs font-medium text-muted">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ReportCompetitors({ competitors }: ReportCompetitorsProps) {
  const { locale, t } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return competitors;
    return competitors.filter(
      (competitor) =>
        competitor.name.toLowerCase().includes(q) ||
        competitor.region?.toLowerCase().includes(q) ||
        competitor.price.toLowerCase().includes(q)
    );
  }, [competitors, query]);

  const countLabel =
    locale === "fr"
      ? `${competitors.length} SaaS mappé${competitors.length > 1 ? "s" : ""}`
      : `${competitors.length} SaaS mapped`;

  const showRefreshHint = competitors.length < MIN_COMPETITORS_PER_REPORT;

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
              {t.report.competitorsSection.title}
            </p>
            <span className="rounded-full bg-accent-blue/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent-sky">
              {countLabel}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {t.report.competitorsSection.subtitle.replace(
              "{target}",
              String(TARGET_COMPETITORS_PER_REPORT)
            )}
          </p>
        </div>

        {competitors.length > 6 && (
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.report.competitorsSection.searchPlaceholder}
            className="w-full max-w-xs rounded-xl border border-glass-border bg-background/80 px-4 py-2.5 text-sm text-white placeholder:text-muted outline-none focus:ring-2 focus:ring-accent-blue/30"
          />
        )}
      </div>

      {showRefreshHint && (
        <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
          {t.report.competitorsSection.refreshHint.replace(
            "{min}",
            String(MIN_COMPETITORS_PER_REPORT)
          )}
        </p>
      )}

      <div className="glass-card hidden overflow-hidden rounded-2xl lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-glass-border bg-white/[0.03] text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-3">{t.report.competitorsSection.columns.name}</th>
                <th className="px-4 py-3">{t.report.competitorsSection.columns.arr}</th>
                <th className="px-4 py-3">{t.report.competitorsSection.columns.founded}</th>
                <th className="px-4 py-3">{t.report.competitorsSection.columns.rating}</th>
                <th className="px-4 py-3">{t.report.competitorsSection.columns.price}</th>
                <th className="px-4 py-3">{t.report.competitorsSection.columns.region}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((competitor) => (
                <tr
                  key={competitor.name}
                  className="border-b border-glass-border/60 transition hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <a
                      href={competitor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 font-medium text-white transition hover:text-accent-sky"
                    >
                      {competitor.name}
                      <svg
                        className="h-3.5 w-3.5 text-muted transition group-hover:text-accent-sky"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </a>
                  </td>
                  <td className="px-4 py-3 font-medium text-accent-sky">
                    {competitor.arrMrrEstimate}
                  </td>
                  <td className="px-4 py-3 text-white/80">{competitor.foundedYear}</td>
                  <td className="px-4 py-3">
                    <StarRating rating={competitor.rating} />
                  </td>
                  <td className="px-4 py-3 text-white/80">{competitor.price}</td>
                  <td className="px-4 py-3 text-white/80">{competitor.region ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {filtered.map((competitor) => (
          <a
            key={competitor.name}
            href={competitor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card card-hover group block rounded-2xl p-5 transition hover:ring-1 hover:ring-accent-sky/40"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-semibold text-white transition group-hover:text-accent-sky">
                {competitor.name}
              </h4>
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:text-accent-sky"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted">
                  {t.report.competitorsSection.columns.arr}
                </dt>
                <dd className="mt-1 font-medium text-accent-sky">
                  {competitor.arrMrrEstimate}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-muted">
                    {t.report.competitorsSection.columns.founded}
                  </dt>
                  <dd className="mt-1 text-white/80">{competitor.foundedYear}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-muted">
                    {t.report.competitorsSection.columns.price}
                  </dt>
                  <dd className="mt-1 text-white/80">{competitor.price}</dd>
                </div>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted">
                  {t.report.competitorsSection.columns.rating}
                </dt>
                <dd className="mt-1">
                  <StarRating rating={competitor.rating} />
                </dd>
              </div>
            </dl>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-4 text-center text-sm text-muted">
          {t.report.competitorsSection.noResults}
        </p>
      )}
    </section>
  );
}
