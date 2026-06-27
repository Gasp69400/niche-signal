"use client";

import { useMemo } from "react";
import { useReportQuota } from "@/contexts/ReportQuotaContext";
import { useI18n } from "@/contexts/I18nContext";

interface ReportQuotaCardProps {
  variant?: "full" | "compact";
  className?: string;
}

function formatResetDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function interpolate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

export function ReportQuotaCard({
  variant = "full",
  className = "",
}: ReportQuotaCardProps) {
  const { locale, t } = useI18n();
  const { quota, loading } = useReportQuota();

  const percentUsed = useMemo(() => {
    if (!quota || quota.limit === 0) return 0;
    return Math.min(100, Math.round((quota.used / quota.limit) * 100));
  }, [quota]);

  if (loading && !quota) {
    return (
      <div
        className={`glass-card animate-pulse rounded-2xl ${variant === "compact" ? "h-10 px-4 py-2" : "h-28 p-5"} ${className}`}
      />
    );
  }

  if (!quota) return null;

  const resetDate = formatResetDate(quota.periodReset, locale);
  const barColor =
    quota.remaining === 0
      ? "bg-red-500"
      : quota.remaining <= 10
        ? "bg-amber-400"
        : "bg-gradient-to-r from-accent-blue to-accent-sky";

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-glass-border bg-white/[0.03] px-4 py-2 text-xs ${className}`}
      >
        <span className="font-semibold text-white">
          {interpolate(t.quota.compact, {
            used: quota.used,
            limit: quota.limit,
            remaining: quota.remaining,
          })}
        </span>
        <span className="hidden text-muted sm:inline">·</span>
        <span className="text-muted">
          {interpolate(t.quota.resetOn, { date: resetDate })}
        </span>
        {quota.isExceeded && (
          <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-medium text-red-300">
            {t.quota.exhausted}
          </span>
        )}
      </div>
    );
  }

  return (
    <section
      className={`glass-card rounded-2xl border p-5 sm:p-6 ${
        quota.isExceeded ? "border-red-500/30" : "border-accent-blue/20"
      } ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-blue">
            {t.quota.title}
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {quota.remaining}
            <span className="ml-2 text-base font-medium text-muted">
              / {quota.limit} {t.quota.remainingLabel}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {interpolate(t.quota.summary, {
              used: quota.used,
              limit: quota.limit,
              remaining: quota.remaining,
            })}
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.03] px-4 py-3 text-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            {t.quota.reset}
          </p>
          <p className="mt-1 font-medium text-white">
            {interpolate(t.quota.resetOn, { date: resetDate })}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted">
            {interpolate(t.quota.percentUsed, { percent: percentUsed })}
          </span>
          <span className="font-medium text-white">
            {quota.used} / {quota.limit}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/[0.03] px-3 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
            {t.quota.used}
          </p>
          <p className="mt-1 text-lg font-bold text-white">{quota.used}</p>
        </div>
        <div className="rounded-xl bg-accent-blue/10 px-3 py-3 text-center ring-1 ring-accent-blue/20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent-sky">
            {t.quota.remaining}
          </p>
          <p className="mt-1 text-lg font-bold text-accent-sky">{quota.remaining}</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] px-3 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
            {t.quota.limit}
          </p>
          <p className="mt-1 text-lg font-bold text-white">{quota.limit}</p>
        </div>
      </div>

      {quota.isExceeded && (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/20">
          {interpolate(t.quota.exhaustedHint, {
            date: resetDate,
            limit: quota.limit,
          })}
        </p>
      )}
    </section>
  );
}
