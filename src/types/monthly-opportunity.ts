export interface MonthlyOpportunityItem {
  rank: number;
  domain: string;
  title: string;
  opportunityScore: number;
  marketSize: string;
  competition: string;
  trend: string;
  painLevel: number;
  highlight: string;
  whyNow: string;
  topPainPoint: string;
  willingnessToPayEstimate: string;
  sources: string[];
}

export interface MonthlyOpportunityEdition {
  id: string;
  year: number;
  month: number;
  title: string;
  subtitle: string;
  opportunities: MonthlyOpportunityItem[];
  generatedAt: string;
}

export interface MonthlyOpportunityAiResponse {
  title: string;
  subtitle: string;
  opportunities: MonthlyOpportunityItem[];
}
