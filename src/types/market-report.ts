export interface Competitor {
  name: string;
  arrMrrEstimate: string;
  foundedYear: number;
  rating: number;
  price: string;
  region?: string;
}

export interface PainPoint {
  label: string;
  intensity: number;
}

export interface MarketTrendPoint {
  month: string;
  interest: number;
}

export interface RadarDimension {
  dimension: string;
  score: number;
  fullMark: number;
}

export interface TargetPersona {
  role: string;
  frustration: string;
  currentTool: string;
  willingnessToPay: string;
  whereToFind: string;
}

export interface PositioningAngle {
  oneLiner: string;
  differentiators: string[];
}

export interface SimilarNiche {
  name: string;
  opportunityScore: number;
}

export interface AnalyzeReport {
  id?: string;
  domain: string;
  opportunityScore: number;
  marketSize: string;
  competition: string;
  buildDifficulty: string;
  trend: string;
  trendPercent: string;
  painPoints: PainPoint[];
  competitors: Competitor[];
  verdict: string;
  createdAt?: string;
  cached?: boolean;
  isFavorite?: boolean;
  marketTrend: {
    data: MarketTrendPoint[];
    sixMonthChange: number;
    trend: string;
  };
  radar: RadarDimension[];
  persona: TargetPersona;
  positioning: PositioningAngle;
  similarNiches: SimilarNiche[];
}

export interface SearchRequest {
  domain: string;
}
