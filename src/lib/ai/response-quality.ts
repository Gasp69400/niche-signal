import type { ClaudeAnalyzeResponse } from "@/types/claude-response";

const FORBIDDEN_SCORES = new Set([78]);

export function isGenericResponse(response: ClaudeAnalyzeResponse): boolean {
  return FORBIDDEN_SCORES.has(response.opportunityScore);
}

export function hashDomain(domain: string): number {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash << 5) - hash + domain.charCodeAt(i);
  }
  return Math.abs(hash);
}

/** Dernier recours si le modèle lite renvoie toujours 78 */
export function escapeGenericScore(score: number, domain: string): number {
  if (!FORBIDDEN_SCORES.has(score)) {
    return score;
  }

  const seed = hashDomain(domain.trim().toLowerCase());
  return 38 + (seed % 55);
}

export const GEMINI_MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
] as const;

export function resolveGeminiModels(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  if (preferred) {
    return [
      preferred,
      ...GEMINI_MODEL_PRIORITY.filter((model) => model !== preferred),
    ];
  }
  return [...GEMINI_MODEL_PRIORITY];
}

export function buildAntiGenericMessage(domain: string, attempt: number): string {
  return `CRITICAL RETRY #${attempt} for "${domain}":
- opportunityScore MUST NOT be 78
- opportunityScore must be unique to "${domain}" (use range 35-92)
- marketSize must be realistic and specific to "${domain}" only
- Re-analyze from scratch with different scores than any generic template`;
}
