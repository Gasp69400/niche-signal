import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { getProfileStripeFields } from "@/lib/db/profiles";
import {
  getServerSiteUrl,
  getStripe,
  getStripePriceId,
} from "@/lib/stripe/server";
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
    const stripe = getStripe();
    const priceId = getStripePriceId();
    const profile = await getProfileStripeFields(user.id);
    const siteUrl = getServerSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      metadata: { userId: user.id },
      subscription_data: {
        metadata: { userId: user.id },
      },
      success_url: `${siteUrl}/${locale}?checkout=success`,
      cancel_url: `${siteUrl}/${locale}#pricing?checkout=cancel`,
      ...(profile?.stripeCustomerId
        ? { customer: profile.stripeCustomerId }
        : { customer_email: user.email ?? profile?.email }),
    });

    if (!session.url) {
      throw new Error("URL Checkout Stripe manquante");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/checkout]", error);
    const message =
      error instanceof Error ? error.message : "Impossible de démarrer le paiement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
