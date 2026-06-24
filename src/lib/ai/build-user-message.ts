export function buildAnalyzeUserMessage(domain: string): string {
  return `Analyze this EXACT SaaS niche/category: "${domain}"

CRITICAL rules for THIS specific niche:
- Every score, label, competitor and pain point must be unique to "${domain}" — not generic SaaS advice
- opportunityScore (0-100) must reflect the real attractiveness of "${domain}" specifically
- competition and buildDifficulty must match this niche — do NOT default to "Modérée" or "Moyenne" unless truly accurate for "${domain}"
- Use the full spectrum: a saturated niche like email marketing should score differently from a narrow B2B vertical
- radar scores must vary with one decimal (e.g. 6.3, 7.8) — never identical round numbers across different analyses
- monthlyInterest must tell a story specific to this market's momentum
- willingnessToPayEstimate must be the ideal mid-market price sweet spot for "${domain}" — exclude freemium and enterprise tiers, max 2× spread (e.g. €49–89/mois, never €19–299/mois)
- marketTrendDirection must align with trend/trendPercent and this niche's real momentum
- geographicFocus must match where competitors operate and where buyers are (regions in competitors[])

Return ONLY the JSON object.`;
}
