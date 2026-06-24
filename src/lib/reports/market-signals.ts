import type { GeographicFocus, MarketTrendDirection } from "@/types/market-report";

const MAX_RANGE_RATIO = 2;
const MAX_RANGE_SPREAD = 80;

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

function parseAmounts(text: string): number[] {
  const amounts: number[] = [];
  const regex = /(\d+(?:[.,]\d+)?)/g;
  let match: RegExpExecArray | null;
  const normalized = text.replace(/\s/g, "");

  while ((match = regex.exec(normalized)) !== null) {
    amounts.push(parseFloat(match[1].replace(",", ".")));
  }

  return amounts;
}

function detectCurrency(text: string): string {
  if (text.includes("$")) return "$";
  if (text.includes("£")) return "£";
  return "€";
}

function detectSuffix(text: string): string {
  if (/\/user|\/utilisateur|per user|par utilisateur/i.test(text)) {
    return "/mois/utilisateur";
  }
  if (/\/mo|\/month|monthly|mensuel|mois/i.test(text)) {
    return "/mois";
  }
  return "/mois";
}

function roundNice(value: number): number {
  if (value < 20) return Math.round(value);
  if (value < 100) return Math.round(value / 5) * 5;
  return Math.round(value / 10) * 10;
}

function isRangeTooWide(low: number, high: number): boolean {
  if (low <= 0 || high <= 0) return false;
  return high / low > MAX_RANGE_RATIO || high - low > MAX_RANGE_SPREAD;
}

function formatIdealRange(
  low: number,
  high: number,
  currency: string,
  suffix: string
): string {
  const roundedLow = roundNice(low);
  const roundedHigh = roundNice(high);
  if (roundedLow === roundedHigh) {
    return `${currency}${roundedLow}${suffix}`;
  }
  return `${currency}${roundedLow}–${roundedHigh}${suffix}`;
}

function filterPricingOutliers(prices: number[]): number[] {
  const sorted = [...prices].filter((price) => price > 0).sort((a, b) => a - b);
  if (sorted.length <= 2) return sorted;

  const filtered = [...sorted];
  while (filtered.length >= 3) {
    const median = filtered[Math.floor(filtered.length / 2)];
    const max = filtered[filtered.length - 1];
    if (max > median * 2.5) {
      filtered.pop();
      continue;
    }
    break;
  }

  return filtered;
}

export function computeIdealPriceRange(
  prices: number[],
  currency = "€",
  suffix = "/mois"
): string | null {
  const filtered = filterPricingOutliers(prices);
  if (filtered.length === 0) return null;

  const median = filtered[Math.floor(filtered.length / 2)];
  const q1 = filtered[Math.floor(filtered.length * 0.25)] ?? median;
  const q3 = filtered[Math.ceil(filtered.length * 0.75) - 1] ?? median;

  let low = q1;
  let high = q3;

  if (isRangeTooWide(low, high)) {
    low = median * 0.85;
    high = median * 1.2;
  }

  if (high <= low) {
    low = median * 0.9;
    high = median * 1.15;
  }

  return formatIdealRange(low, high, currency, suffix);
}

function narrowWideRange(
  low: number,
  high: number,
  currency: string,
  suffix: string
): string {
  const geoMean = Math.sqrt(low * high);
  return formatIdealRange(geoMean * 0.8, geoMean * 1.25, currency, suffix);
}

function normalizePriceEstimate(
  estimate: string,
  competitorPrices?: string[]
): string {
  const trimmed = estimate.trim();
  if (!trimmed || trimmed === "—") return trimmed;

  const currency = detectCurrency(trimmed);
  const suffix = detectSuffix(trimmed);
  const amounts = parseAmounts(trimmed);

  if (amounts.length === 0) return trimmed;

  const low = Math.min(...amounts);
  const high = Math.max(...amounts);

  if (!isRangeTooWide(low, high)) {
    return formatIdealRange(low, high, currency, suffix);
  }

  const competitorAmounts =
    competitorPrices?.flatMap((price) => parseAmounts(price)).filter((price) => price > 0) ?? [];

  if (competitorAmounts.length > 0) {
    const ideal = computeIdealPriceRange(competitorAmounts, currency, suffix);
    if (ideal) return ideal;
  }

  return narrowWideRange(low, high, currency, suffix);
}

export function resolveWillingnessToPayEstimate(
  estimate: string | undefined,
  personaWillingness?: string,
  competitorPrices?: string[]
): string {
  const primary = estimate?.trim() || personaWillingness?.trim();

  if (primary) {
    return normalizePriceEstimate(primary, competitorPrices);
  }

  const competitorAmounts =
    competitorPrices?.flatMap((price) => parseAmounts(price)).filter((price) => price > 0) ?? [];

  if (competitorAmounts.length > 0) {
    const currency = detectCurrency(competitorPrices?.[0] ?? "");
    const suffix = detectSuffix(competitorPrices?.join(" ") ?? "");
    return computeIdealPriceRange(competitorAmounts, currency, suffix) ?? "—";
  }

  return "—";
}
