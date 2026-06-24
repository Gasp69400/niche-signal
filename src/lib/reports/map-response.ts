import type { ClaudeAnalyzeResponse } from "@/types/claude-response";
import { escapeGenericScore, hashDomain } from "@/lib/ai/response-quality";
import {
  normalizeGeographicFocus,
  normalizeMarketTrendDirection,
  resolvePainLevel,
  resolveSearchVolume,
  resolveWillingnessToPayEstimate,
} from "@/lib/reports/market-signals";
import type { AnalyzeReport, MarketTrendPoint, RadarDimension } from "@/types/market-report";

const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

const RADAR_DIMENSIONS = [
  "Taille du marché",
  "Facilité d'entrée",
  "Demande utilisateur",
  "Concurrence",
  "Potentiel de monétisation",
  "Vitesse de croissance",
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function parseTrendPercent(trendPercent: string): number {
  const match = trendPercent.match(/([+-]?\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function hashDomainLocal(domain: string): number {
  return hashDomain(domain);
}

function buildMarketTrend(
  response: ClaudeAnalyzeResponse,
  searchedDomain: string
): { data: MarketTrendPoint[]; sixMonthChange: number; trend: string } {
  const trend = response.trend;
  const sixMonthChange = parseTrendPercent(response.trendPercent);

  if (response.monthlyInterest?.length === 12) {
    const data = MONTHS.map((month, index) => ({
      month,
      interest: clamp(Math.round(response.monthlyInterest![index]), 5, 100),
    }));

    const mid = data[5].interest;
    const end = data[11].interest;
    const computedChange =
      mid > 0 ? Math.round(((end - mid) / mid) * 100) : sixMonthChange;

    return {
      data,
      sixMonthChange: sixMonthChange || computedChange,
      trend,
    };
  }

  const seed = hashDomainLocal(searchedDomain);
  const endInterest = clamp(
    Math.round(response.opportunityScore * 0.85 + 10 + (seed % 12) - 6),
    15,
    100
  );
  const startInterest = clamp(endInterest - sixMonthChange, 10, 100);

  const data = MONTHS.map((month, index) => {
    const base =
      startInterest + ((endInterest - startInterest) * index) / (MONTHS.length - 1);
    const wobble = Math.sin(index * 0.9 + seed * 0.01) * (3 + (seed % 4));
    return {
      month,
      interest: clamp(Math.round(base + wobble), 5, 100),
    };
  });

  return { data, sixMonthChange, trend };
}

function difficultyToScore(value: string): number {
  if (/faible/i.test(value)) return 8.2;
  if (/moyenne/i.test(value)) return 5.8;
  return 3.1;
}

function competitionToScore(value: string): number {
  if (/faible/i.test(value)) return 8.4;
  if (/modérée|moderee/i.test(value)) return 5.6;
  return 2.9;
}

function trendToGrowthScore(trend: string): number {
  if (/hausse/i.test(trend)) return 8.1;
  if (/stable/i.test(trend)) return 5.4;
  return 3.3;
}

function buildRadarFallback(response: ClaudeAnalyzeResponse): RadarDimension[] {
  const avgPain =
    response.painPoints.reduce((sum, point) => sum + point.score, 0) /
    response.painPoints.length /
    10;

  const scores = [
    response.opportunityScore / 10,
    difficultyToScore(response.buildDifficulty),
    avgPain,
    competitionToScore(response.competition),
    (response.opportunityScore * 0.75) / 10,
    trendToGrowthScore(response.trend),
  ];

  return RADAR_DIMENSIONS.map((dimension, index) => ({
    dimension,
    score: Math.round(scores[index] * 10) / 10,
    fullMark: 10,
  }));
}

function buildRadar(response: ClaudeAnalyzeResponse): RadarDimension[] {
  if (response.radar?.length === 6) {
    return response.radar.map((item) => ({
      dimension: item.dimension,
      score: Math.round(clamp(item.score, 0, 10) * 10) / 10,
      fullMark: 10,
    }));
  }

  return buildRadarFallback(response);
}

export function mapClaudeResponse(
  response: ClaudeAnalyzeResponse,
  searchedDomain: string
): AnalyzeReport {
  const marketTrend = buildMarketTrend(response, searchedDomain);
  const competitorPrices = response.competitors.map((c) => c.price);
  const geo = normalizeGeographicFocus(response.geographicFocus);
  const marketTrendDirection = normalizeMarketTrendDirection(
    response.marketTrendDirection,
    response.trend
  );
  const painPoints = response.painPoints.map((point) => ({
    label: point.label,
    intensity: clamp(Math.round(point.score), 0, 100),
  }));

  return {
    domain: response.domain || searchedDomain,
    opportunityScore: escapeGenericScore(
      clamp(Math.round(response.opportunityScore), 0, 100),
      searchedDomain
    ),
    marketSize: response.marketSize,
    competition: response.competition,
    buildDifficulty: response.buildDifficulty,
    trend: response.trend,
    trendPercent: response.trendPercent,
    willingnessToPayEstimate: resolveWillingnessToPayEstimate(
      response.willingnessToPayEstimate,
      response.persona.willingness,
      competitorPrices
    ),
    marketTrendDirection,
    geographicFocus: geo.label,
    geographicFocusKey: geo.key,
    searchVolume: resolveSearchVolume(response.searchVolume, {
      monthlyInterest: response.monthlyInterest,
      opportunityScore: response.opportunityScore,
      domain: searchedDomain,
    }),
    painLevel: resolvePainLevel(response.painLevel, painPoints),
    painPoints,
    competitors: response.competitors.map((competitor) => ({
      name: competitor.name,
      arrMrrEstimate: competitor.arr,
      foundedYear: competitor.founded,
      rating: competitor.rating,
      price: competitor.price,
      region: competitor.region,
    })),
    verdict: response.verdict,
    marketTrend,
    radar: buildRadar(response),
    persona: {
      role: response.persona.role,
      frustration: response.persona.frustration,
      currentTool: response.persona.currentTool,
      willingnessToPay: resolveWillingnessToPayEstimate(
        response.willingnessToPayEstimate,
        response.persona.willingness,
        competitorPrices
      ),
      whereToFind: response.persona.whereToFind,
    },
    positioning: {
      oneLiner: response.positioning,
      differentiators: response.differentiators,
    },
    similarNiches: response.similarNiches.map((niche) => ({
      name: niche.name,
      opportunityScore: clamp(Math.round(niche.score), 0, 100),
    })),
  };
}
