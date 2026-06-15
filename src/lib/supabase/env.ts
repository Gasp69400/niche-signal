/**
 * Normalise l'URL Supabase : uniquement https://xxx.supabase.co
 * (sans /rest/v1, /auth/v1, etc.)
 */
export function getSupabaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);

    if (!parsed.hostname.endsWith(".supabase.co")) {
      return null;
    }

    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export function getSupabaseAnonKey(): string | null {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return key || null;
}

export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";
}
