function normalizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function resolveCompetitorWebsite(name: string, website?: string): string {
  const normalized = website ? normalizeWebsiteUrl(website) : null;
  if (normalized) return normalized;

  return `https://www.google.com/search?q=${encodeURIComponent(`${name} SaaS site officiel`)}`;
}

export function enrichCompetitorWebsite<T extends { name: string; website?: string }>(
  competitor: T
): T & { website: string } {
  return {
    ...competitor,
    website: resolveCompetitorWebsite(competitor.name, competitor.website),
  };
}
