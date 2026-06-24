import type { Locale } from "@/i18n/config";

export interface ReportPdfLabels {
  brand: string;
  tagline: string;
  reportTitle: string;
  reportSubtitle: string;
  generatedOn: string;
  reference: string;
  executiveSummary: string;
  opportunityScore: string;
  marketSize: string;
  competition: string;
  buildDifficulty: string;
  willingnessToPayEstimate: string;
  marketTrendLabel: string;
  geographicFocus: string;
  trendGrowing: string;
  trendStable: string;
  trendDeclining: string;
  marketTrend: string;
  sixMonthChange: string;
  radar: string;
  painPoints: string;
  competitors: string;
  persona: string;
  positioning: string;
  verdict: string;
  verdictPositive: string;
  verdictCaution: string;
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
  confidential: string;
}

const LABELS: Record<Locale, ReportPdfLabels> = {
  fr: {
    brand: "NicheSignal",
    tagline: "Intelligence marché SaaS",
    reportTitle: "Dossier d'opportunité",
    reportSubtitle: "Analyse concurrentielle & scoring de niche",
    generatedOn: "Émis le",
    reference: "Réf.",
    executiveSummary: "Synthèse exécutive",
    opportunityScore: "Score d'opportunité",
    marketSize: "Taille du marché",
    competition: "Concurrence",
    buildDifficulty: "Difficulté de build",
    willingnessToPayEstimate: "Prix accepté (estimation)",
    marketTrendLabel: "Dynamique marché",
    geographicFocus: "Zone géographique",
    trendGrowing: "En croissance",
    trendStable: "Stable",
    trendDeclining: "En déclin",
    marketTrend: "Dynamique de marché",
    sixMonthChange: "Variation 6 mois",
    radar: "Dimensions stratégiques",
    painPoints: "Pain points identifiés",
    competitors: "Cartographie concurrentielle",
    persona: "Persona acheteur",
    positioning: "Angle de positionnement",
    verdict: "Recommandation",
    verdictPositive: "Fenêtre d'opportunité favorable",
    verdictCaution: "Approche prudente recommandée",
    similarNiches: "Niches adjacentes",
    role: "Rôle",
    frustration: "Frustration clé",
    currentTool: "Stack actuel",
    willingnessToPay: "Budget cible",
    whereToFind: "Canaux d'acquisition",
    arrMrr: "ARR / MRR",
    founded: "Création",
    rating: "Satisfaction",
    price: "Pricing",
    footer: "Document confidentiel — Usage interne & décision stratégique",
    proBadge: "PRO",
    confidential: "Confidentiel",
  },
  en: {
    brand: "NicheSignal",
    tagline: "SaaS market intelligence",
    reportTitle: "Opportunity brief",
    reportSubtitle: "Competitive landscape & niche scoring",
    generatedOn: "Issued",
    reference: "Ref.",
    executiveSummary: "Executive summary",
    opportunityScore: "Opportunity score",
    marketSize: "Market size",
    competition: "Competition",
    buildDifficulty: "Build difficulty",
    willingnessToPayEstimate: "Willingness to pay",
    marketTrendLabel: "Market momentum",
    geographicFocus: "Geographic focus",
    trendGrowing: "Growing",
    trendStable: "Stable",
    trendDeclining: "Declining",
    marketTrend: "Market dynamics",
    sixMonthChange: "6-month change",
    radar: "Strategic dimensions",
    painPoints: "Identified pain points",
    competitors: "Competitive landscape",
    persona: "Buyer persona",
    positioning: "Positioning angle",
    verdict: "Recommendation",
    verdictPositive: "Favorable opportunity window",
    verdictCaution: "Proceed with validation",
    similarNiches: "Adjacent niches",
    role: "Role",
    frustration: "Key frustration",
    currentTool: "Current stack",
    willingnessToPay: "Target budget",
    whereToFind: "Acquisition channels",
    arrMrr: "ARR / MRR",
    founded: "Founded",
    rating: "Satisfaction",
    price: "Pricing",
    footer: "Confidential document — Internal & strategic use only",
    proBadge: "PRO",
    confidential: "Confidential",
  },
};

export function getReportPdfLabels(locale: Locale): ReportPdfLabels {
  return LABELS[locale];
}
