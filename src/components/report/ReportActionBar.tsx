"use client";

import { useEffect, useState } from "react";

interface ReportActionBarProps {
  reportId?: string;
  isPro: boolean;
  onSave?: () => void;
}

export function ReportActionBar({ reportId, isPro, onSave }: ReportActionBarProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("report-metrics-end");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  async function handleShare() {
    const url = reportId
      ? `${window.location.origin}${window.location.pathname}?report=${reportId}`
      : window.location.href;

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportPdf() {
    window.print();
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-glass-border bg-background/80 px-4 py-3 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:justify-between">
        <button
          type="button"
          onClick={handleExportPdf}
          className="btn-glow inline-flex items-center gap-2 rounded-xl border border-glass-border px-4 py-2.5 text-sm font-medium text-white/90 transition hover:border-white/20 hover:bg-white/5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exporter en PDF
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="btn-glow inline-flex items-center gap-2 rounded-xl border border-glass-border px-4 py-2.5 text-sm font-medium text-white/90 transition hover:border-white/20 hover:bg-white/5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          {copied ? "Lien copié !" : "Partager ce rapport"}
        </button>

        <button
          type="button"
          onClick={isPro ? onSave : undefined}
          disabled={!isPro}
          title={isPro ? "Sauvegarder" : "Réservé au plan Pro"}
          className={`btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            isPro
              ? "bg-accent-blue text-white shadow-glow-sm"
              : "cursor-not-allowed border border-glass-border text-muted opacity-60"
          }`}
        >
          {!isPro && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          )}
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
