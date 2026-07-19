type AuthErrorLocale = "fr" | "en";

const MESSAGES = {
  fr: {
    rateLimit:
      "Trop d'emails envoyés. Supabase limite à ~4 emails/heure en gratuit. Réessayez dans 1 h, ou désactivez la confirmation email dans Supabase (Auth → Providers → Email).",
    invalidCredentials: "Email ou mot de passe incorrect.",
    emailNotConfirmed:
      "Confirmez d'abord votre email via le lien reçu, ou demandez à l'admin de valider votre compte dans Supabase.",
    networkError:
      "Impossible de joindre Supabase. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local (Project Settings → API), puis redémarrez npm run dev.",
  },
  en: {
    rateLimit:
      "Too many emails sent. Supabase limits to ~4 emails/hour on the free plan. Try again in 1 hour, or disable email confirmation in Supabase (Auth → Providers → Email).",
    invalidCredentials: "Incorrect email or password.",
    emailNotConfirmed:
      "Confirm your email via the link you received, or ask an admin to verify your account in Supabase.",
    networkError:
      "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (Project Settings → API), then restart npm run dev.",
  },
} as const;

export function mapAuthError(
  message: string,
  locale: AuthErrorLocale = "fr"
): string {
  const m = MESSAGES[locale];
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("email rate limit")) {
    return m.rateLimit;
  }

  if (lower.includes("invalid login credentials")) {
    return m.invalidCredentials;
  }

  if (lower.includes("email not confirmed")) {
    return m.emailNotConfirmed;
  }

  if (
    lower.includes("fetch failed") ||
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed")
  ) {
    return m.networkError;
  }

  return message;
}
