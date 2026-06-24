import type { GeographicFocus, MarketTrendDirection } from "@/types/market-report";

export function normalizeMarketTrendDirection(
  value: string | undefined,
  fallbackTrend?: string
): MarketTrendDirection {
  const raw = (value || fallbackTrend || "").toLowerCase();

  if (/baisse|d[eé]clin|down|fall|decrease|shrinking|contract/i.test(raw)) {
    return "declining";
  }
  if (/hausse|croissance|growing|up|rise|increase|expanding/i.test(raw)) {
    return "growing";
  }
  if (/stable|flat|stagn/i.test(raw)) {
    return "stable";
  }

  return "stable";
}

export function normalizeGeographicFocus(value: string | undefined): {
  key: GeographicFocus;
  label: string;
} {
  const raw = (value || "").trim();
  if (!raw) {
    return { key: "global", label: "Global" };
  }

  const lower = raw.toLowerCase();

  if (/france|français|french/i.test(lower) && !/europe/i.test(lower)) {
    return { key: "france", label: raw };
  }
  if (/europe|eu\b|emea|uk|dach/i.test(lower) && !/global/i.test(lower)) {
    return { key: "europe", label: raw };
  }
  if (/\bus\b|usa|united states|north america|am[eé]rique du nord/i.test(lower)) {
    if (/europe|global|\+/i.test(lower)) {
      return { key: "us_europe", label: raw };
    }
    return { key: "us", label: raw };
  }
  if (/global|worldwide|international/i.test(lower)) {
    return { key: "global", label: raw };
  }

  return { key: "other", label: raw };
}

export function resolveWillingnessToPayEstimate(
  estimate: string | undefined,
  personaWillingness?: string,
  competitorPrices?: string[]
): string {
  const primary = estimate?.trim() || personaWillingness?.trim();
  if (primary) return primary;

  if (competitorPrices?.length) {
    return `Aligné sur le marché (${competitorPrices.slice(0, 2).join(", ")})`;
  }

  return "—";
}
