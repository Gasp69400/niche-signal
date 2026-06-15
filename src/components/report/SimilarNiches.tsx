"use client";

import type { SimilarNiche } from "@/types/market-report";

interface SimilarNichesProps {
  niches: SimilarNiche[];
  onSelect: (niche: string) => void;
}

export function SimilarNiches({ niches, onSelect }: SimilarNichesProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {niches.map((niche) => (
        <button
          key={niche.name}
          type="button"
          onClick={() => onSelect(niche.name)}
          className="glass-card card-hover group flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition"
        >
          <span className="text-sm font-medium text-white group-hover:text-accent-sky">
            {niche.name}
          </span>
          <span className="rounded-full bg-accent-blue/20 px-2 py-0.5 text-xs font-semibold text-accent-blue">
            {niche.opportunityScore}/100
          </span>
        </button>
      ))}
    </div>
  );
}
