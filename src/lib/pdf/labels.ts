import type { Locale } from "@/i18n/config";

export interface ReportPdfLabels {
  brand: string;
  tagline: string;
  reportTitle: string;
  generatedOn: string;
  opportunityScore: string;
  marketSize: string;
  competition: string;
  buildDifficulty: string;
  marketTrend: string;
  sixMonthChange: string;
  radar: string;
  painPoints: string;
  competitors: string;
  persona: string;
  positioning: string;
  verdict: string;
  similarNiches: string;
  role: string;
  frustration: string;
  currentTool: string;
  willingnessToPay: string;
  whereToFind: string;
  arrMrr: string;
  founded: string;
  rating: string;
  price: string;
  footer: string;
  proBadge: string;
}

const LABELS: Record<Locale, ReportPdfLabels> = {
  fr: {
    brand: "NicheSignal",
    tagline: "Analyse de niche SaaS",
    reportTitle: "Rapport d'analyse de marché",
    generatedOn: "Généré le",
    opportunityScore: "Score d'opportunité",
    marketSize: "Taille du marché",
    competition: "Concurrence",
    buildDifficulty: "Difficulté de build",
    marketTrend: "Tendance du marché",
    sixMonthChange: "Évolution 6 mois",
    radar: "Analyse détaillée",
    painPoints: "Pain points",
    competitors: "Concurrents",
    persona: "Persona cible",
    positioning: "Angle de positionnement",
    verdict: "Verdict",
    similarNiches: "Niches similaires",
    role: "Rôle",
    frustration: "Frustration",
    currentTool: "Outil actuel",
    willingnessToPay: "Budget",
    whereToFind: "Où le trouver",
    arrMrr: "ARR / MRR",
    founded: "Fondé en",
    rating: "Note",
    price: "Prix",
    footer: "Rapport confidentiel — NicheSignal Pro",
    proBadge: "Plan Pro",
  },
  en: {
    brand: "NicheSignal",
    tagline: "SaaS niche intelligence",
    reportTitle: "Market analysis report",
    generatedOn: "Generated on",
    opportunityScore: "Opportunity score",
    marketSize: "Market size",
    competition: "Competition",
    buildDifficulty: "Build difficulty",
    marketTrend: "Market trend",
    sixMonthChange: "6-month change",
    radar: "Detailed analysis",
    painPoints: "Pain points",
    competitors: "Competitors",
    persona: "Target persona",
    positioning: "Positioning angle",
    verdict: "Verdict",
    similarNiches: "Similar niches",
    role: "Role",
    frustration: "Frustration",
    currentTool: "Current tool",
    willingnessToPay: "Willingness to pay",
    whereToFind: "Where to find them",
    arrMrr: "ARR / MRR",
    founded: "Founded",
    rating: "Rating",
    price: "Price",
    footer: "Confidential report — NicheSignal Pro",
    proBadge: "Pro plan",
  },
};

export function getReportPdfLabels(locale: Locale): ReportPdfLabels {
  return LABELS[locale];
}
