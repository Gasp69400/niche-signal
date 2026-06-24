import type {
  GeographicFocus,
  MarketTrendDirection,
  MonetizationModel,
  PainPoint,
} from "@/types/market-report";
import { hashDomain } from "@/lib/ai/response-quality";

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatSearchVolume(count: number): string {
  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    return `~${millions >= 10 ? Math.round(millions) : millions.toFixed(1)}M/mois`;
  }
  if (count >= 1_000) {
    return `~${Math.round(count / 1_000)}K/mois`;
  }
  return `~${Math.round(count)}/mois`;
}

function parseSearchVolumeCount(value: string): number | null {
  const normalized = value.replace(/\s/g, "").toLowerCase();
  const match = normalized.match(/(\d+(?:[.,]\d+)?)\s*(k|m)?/i);
  if (!match) return null;

  let amount = parseFloat(match[1].replace(",", "."));
  const unit = match[2]?.toLowerCase();
  if (unit === "k") amount *= 1_000;
  if (unit === "m") amount *= 1_000_000;

  return amount > 0 ? amount : null;
}

function normalizeSearchVolumeLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") return trimmed;

  const count = parseSearchVolumeCount(trimmed);
  if (count) {
    return formatSearchVolume(count);
  }

  if (/recherch|search|\/mois|\/month|monthly|mensuel/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

export function resolveSearchVolume(
  searchVolume: string | undefined,
  options?: {
    monthlyInterest?: number[];
    opportunityScore?: number;
    domain?: string;
  }
): string {
  if (searchVolume?.trim()) {
    return normalizeSearchVolumeLabel(searchVolume);
  }

  const { monthlyInterest, opportunityScore = 50, domain = "" } = options ?? {};

  if (monthlyInterest?.length) {
    const avgInterest =
      monthlyInterest.reduce((sum, value) => sum + value, 0) / monthlyInterest.length;
    const seed = hashDomain(domain) % 100;
    const base = Math.round((avgInterest / 100) ** 1.45 * 120_000);
    const adjusted = Math.round(base * (0.88 + seed / 200));
    return formatSearchVolume(Math.max(adjusted, 500));
  }

  const seed = hashDomain(domain) % 100;
  const base = Math.round((opportunityScore / 100) ** 1.3 * 80_000);
  const adjusted = Math.round(base * (0.9 + seed / 250));
  return formatSearchVolume(Math.max(adjusted, 300));
}

export function resolvePainLevel(
  painLevel: number | undefined,
  painPoints?: Pick<PainPoint, "intensity">[]
): number {
  if (typeof painLevel === "number" && Number.isFinite(painLevel)) {
    return clamp(Math.round(painLevel), 1, 10);
  }

  if (painPoints?.length) {
    const avgIntensity =
      painPoints.reduce((sum, point) => sum + point.intensity, 0) / painPoints.length;
    return clamp(Math.round(avgIntensity / 10), 1, 10);
  }

  return 5;
}

export function formatPainLevel(painLevel: number): string {
  return `${painLevel}/10`;
}

const MONETIZATION_LABELS: Record<MonetizationModel, string> = {
  subscription: "SaaS mensuel",
  freemium: "Freemium",
  usage_based: "Usage-based",
  one_time: "Licence unique",
  hybrid: "Hybride",
  other: "Autre",
};

export function normalizeMonetizationModel(
  value: string | undefined,
  competitorPrices?: string[]
): { key: MonetizationModel; label: string } {
  const raw = (value || "").trim();
  const lower = raw.toLowerCase();
  const pricesText = (competitorPrices ?? []).join(" ").toLowerCase();
  const combined = `${lower} ${pricesText}`;

  const matchKey = (patterns: RegExp[], key: MonetizationModel) => {
    if (patterns.some((pattern) => pattern.test(combined))) {
      return { key, label: raw || MONETIZATION_LABELS[key] };
    }
    return null;
  };

  const matched =
    matchKey([/freemium|free tier|gratuit.*premium|free.*paid|free plan/i], "freemium") ??
    matchKey(
      [/usage.?based|pay.?as.?you|à l'usage|a l'usage|par requ|per request|cr[eé]dit|consumption|consommation/i],
      "usage_based"
    ) ??
    matchKey([/licence unique|one.?time|achat unique|perpetual|perp[eé]tuel/i], "one_time") ??
    matchKey([/hybride|hybrid|mixed|mixte|subscription.*usage|abonnement.*usage/i], "hybrid") ??
    matchKey(
      [/saas mensuel|abonnement|subscription|monthly|mensuel|recurring|r[eé]current/i],
      "subscription"
    );

  if (matched) return matched;

  if (/gratuit|free\b|\$0|0€|0 \€/i.test(pricesText)) {
    return { key: "freemium", label: raw || MONETIZATION_LABELS.freemium };
  }

  if (raw) return { key: "other", label: raw };

  return { key: "subscription", label: MONETIZATION_LABELS.subscription };
}

export function resolveMonetizationModel(
  value: string | undefined,
  competitorPrices?: string[]
): { key: MonetizationModel; label: string } {
  return normalizeMonetizationModel(value, competitorPrices);
}

export function getMonetizationModelLabel(
  key: MonetizationModel,
  labels: Record<MonetizationModel, string>,
  fallback: string
): string {
  return labels[key] ?? fallback;
}

function detectArrCurrency(text: string): string {
  if (text.includes("$")) return "$";
  if (text.includes("£")) return "£";
  return "€";
}

function parseRevenueAmount(text: string): number | null {
  const lower = text.toLowerCase();
  const normalized = text.replace(/\s/g, "").toLowerCase();
  const match = normalized.match(/(\d+(?:[.,]\d+)?)\s*(k|m|b|md)?/i);
  if (!match) return null;

  let amount = parseFloat(match[1].replace(",", "."));
  const unit = match[2]?.toLowerCase();

  if (unit === "k") amount *= 1_000;
  if (unit === "m") amount *= 1_000_000;
  if (unit === "b" || unit === "md") amount *= 1_000_000_000;

  if (/mrr|\/mois|monthly recurring|par mois/i.test(lower)) {
    amount *= 12;
  }

  return amount > 0 ? amount : null;
}

function parseRevenueAmounts(text: string): number[] {
  const amounts: number[] = [];
  const segments = text.split(/[,;]|(?:\bet\b)|(?:\band\b)/i);

  for (const segment of segments) {
    const amount = parseRevenueAmount(segment);
    if (amount) amounts.push(amount);
  }

  if (amounts.length === 0) {
    const single = parseRevenueAmount(text);
    if (single) amounts.push(single);
  }

  return amounts;
}

function formatArrValue(amount: number, currency: string): string {
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000;
    return `${currency}${billions >= 10 ? Math.round(billions) : billions.toFixed(1).replace(/\.0$/, "")}Md`;
  }
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${currency}${millions >= 10 ? Math.round(millions) : millions.toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (amount >= 1_000) {
    return `${currency}${Math.round(amount / 1_000)}K`;
  }
  return `${currency}${Math.round(amount)}`;
}

function formatArrPotential(low: number, high: number, currency: string): string {
  const roundedLow = Math.round(low);
  const roundedHigh = Math.round(high);

  if (roundedLow === roundedHigh) {
    return `~${formatArrValue(roundedLow, currency)} ARR`;
  }

  return `~${formatArrValue(roundedLow, currency)}–${formatArrValue(roundedHigh, currency)} ARR`;
}

function parseMonthlyPriceMidpoint(willingnessToPay: string): number | null {
  const amounts = parseAmounts(willingnessToPay).filter((price) => price > 0);
  if (amounts.length === 0) return null;

  const low = Math.min(...amounts);
  const high = Math.max(...amounts);
  return (low + high) / 2;
}

function normalizeArrPotentialLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") return trimmed;

  const currency = detectArrCurrency(trimmed);
  const amounts = parseRevenueAmounts(trimmed);

  if (amounts.length === 0) {
    return /arr|revenu|revenue|annual/i.test(trimmed) ? trimmed : `${trimmed} ARR`;
  }

  const low = Math.min(...amounts);
  const high = Math.max(...amounts);

  if (high / Math.max(low, 1) > 8) {
    const geoMean = Math.sqrt(low * high);
    return formatArrPotential(geoMean * 0.65, geoMean * 1.35, currency);
  }

  return formatArrPotential(low, high, currency);
}

export function resolveEstimatedArrPotential(
  estimate: string | undefined,
  options?: {
    opportunityScore?: number;
    willingnessToPay?: string;
    searchVolume?: string;
    competitorArrs?: string[];
    domain?: string;
  }
): string {
  if (estimate?.trim()) {
    return normalizeArrPotentialLabel(estimate);
  }

  const {
    opportunityScore = 50,
    willingnessToPay = "",
    searchVolume = "",
    competitorArrs = [],
    domain = "",
  } = options ?? {};

  const currency = detectArrCurrency(
    [...competitorArrs, willingnessToPay, searchVolume].join(" ")
  );

  const competitorAmounts = competitorArrs
    .flatMap((arr) => parseRevenueAmounts(arr))
    .filter((amount) => amount > 0)
    .sort((a, b) => a - b);

  if (competitorAmounts.length > 0) {
    const median = competitorAmounts[Math.floor(competitorAmounts.length / 2)];
    const share = 0.0015 + (opportunityScore / 100) * 0.006;
    const target = median * share;
    return formatArrPotential(target * 0.55, target * 1.45, currency);
  }

  const searches = parseSearchVolumeCount(searchVolume);
  const monthlyPrice = parseMonthlyPriceMidpoint(willingnessToPay);

  if (searches && monthlyPrice) {
    const conversionRate = 0.00008 + (opportunityScore / 100) * 0.00032;
    const customers = searches * conversionRate;
    const arr = customers * monthlyPrice * 12;
    return formatArrPotential(arr * 0.65, arr * 1.35, currency);
  }

  const seed = hashDomain(domain) % 100;
  const base = (opportunityScore / 100) ** 1.35 * 2_500_000;
  const adjusted = base * (0.88 + seed / 200);
  return formatArrPotential(adjusted * 0.45, adjusted * 1.05, currency);
}
