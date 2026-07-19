import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, userCanAnalyze } from "@/lib/auth/server";
import { getOrCreateCurrentEdition } from "@/lib/opportunities/edition-service";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";

function resolveLocale(request: NextRequest): Locale {
  const param = request.nextUrl.searchParams.get("locale");
  if (param && isValidLocale(param)) {
    return param;
  }
  return defaultLocale;
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const allowed = await userCanAnalyze(request);
  if (!allowed) {
    return NextResponse.json(
      { error: "Abonnement Pro requis pour accéder aux opportunités du mois" },
      { status: 403 }
    );
  }

  try {
    const locale = resolveLocale(request);
    const edition = await getOrCreateCurrentEdition(locale);
    return NextResponse.json(edition);
  } catch (error) {
    console.error("[opportunities/current]", error);
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de charger les opportunités du mois";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
