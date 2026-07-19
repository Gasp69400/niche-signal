/** Nombre minimum de SaaS concurrents attendus par rapport. */
export const MIN_COMPETITORS_PER_REPORT = 12;

/** Cible idéale pour une cartographie exhaustive. */
export const TARGET_COMPETITORS_PER_REPORT = 15;

export function formatCompetitorCount(count: number, locale: "fr" | "en"): string {
  if (locale === "fr") {
    return count === 1 ? "1 concurrent" : `${count} concurrents`;
  }
  return count === 1 ? "1 competitor" : `${count} competitors`;
}
