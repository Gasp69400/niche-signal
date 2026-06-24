export interface ClaudePainPoint {
  label: string;
  score: number;
}

export interface ClaudeCompetitor {
  name: string;
  arr: string;
  founded: number;
  rating: number;
  price: string;
  region: string;
}

export interface ClaudePersona {
  role: string;
  frustration: string;
  currentTool: string;
  willingness: string;
  whereToFind: string;
}

export interface ClaudeSimilarNiche {
  name: string;
  score: number;
}

export interface ClaudeRadarDimension {
  dimension: string;
  score: number;
}

export interface ClaudeAnalyzeResponse {
  domain: string;
  opportunityScore: number;
  marketSize: string;
  competition: string;
  buildDifficulty: string;
  trend: string;
  trendPercent: string;
  willingnessToPayEstimate: string;
  marketTrendDirection: "En croissance" | "Stable" | "En déclin";
  geographicFocus: string;
  monthlyInterest?: number[];
  radar?: ClaudeRadarDimension[];
  painPoints: ClaudePainPoint[];
  competitors: ClaudeCompetitor[];
  persona: ClaudePersona;
  positioning: string;
  differentiators: string[];
  similarNiches: ClaudeSimilarNiche[];
  verdict: string;
}
