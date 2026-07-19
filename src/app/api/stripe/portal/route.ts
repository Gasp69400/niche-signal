import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { getProfileStripeFields } from "@/lib/db/profiles";
import { getServerSiteUrl, getStripe } from "@/lib/stripe/server";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const localeParam = typeof body.locale === "string" ? body.locale : defaultLocale;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale;

  try {
    const profile = await getProfileStripeFields(user.id);
    if (!profile?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Aucun abonnement Stripe associé à ce compte" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const siteUrl = getServerSiteUrl();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${siteUrl}/${locale}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("[stripe/portal]", error);
    const message =
      error instanceof Error
        ? error.message
        : "Impossible d'ouvrir le portail de facturation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
