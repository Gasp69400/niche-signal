type AuthErrorLocale = "fr" | "en";

const MESSAGES = {
  fr: {
    rateLimit:
      "Trop d'emails envoyés. Supabase limite à ~4 emails/heure en gratuit. Réessayez dans 1 h, ou désactivez la confirmation email dans Supabase (Auth → Providers → Email).",
    invalidCredentials: "Email ou mot de passe incorrect.",
    emailNotConfirmed:
      "Confirmez d'abord votre email via le lien reçu, ou demandez à l'admin de valider votre compte dans Supabase.",
  },
  en: {
    rateLimit:
      "Too many emails sent. Supabase limits to ~4 emails/hour on the free plan. Try again in 1 hour, or disable email confirmation in Supabase (Auth → Providers → Email).",
    invalidCredentials: "Incorrect email or password.",
    emailNotConfirmed:
      "Confirm your email via the link you received, or ask an admin to verify your account in Supabase.",
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

  return message;
}
